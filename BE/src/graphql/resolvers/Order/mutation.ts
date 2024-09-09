import {
  extendType,
  idArg,
  stringArg,
  intArg,
  nonNull,
  nullable,
  list,
  arg,
  booleanArg,
} from "nexus";
import { GraphQLError } from "graphql";
import { ApolloServerErrorCode } from "@apollo/server/errors";
import {
  OrderDetail,
  OrderStatus,
  PrismaClient,
  Product,
  ProductStatus,
} from "@prisma/client";
import { createError } from "#/graphql/service/Order";
// Mutation

export const OrderMutation = extendType({
  type: "Mutation",
  definition(t) {
    // Create a new order with order items
    t.nonNull.field("createOrder", {
      type: "Order",
      args: {
        user_id: nonNull(stringArg()),
        status: nonNull("OrderStatus"),
        address: stringArg(),
        product_ids: nonNull(list(nonNull(stringArg()))),
        quantities: nonNull(list(nonNull(intArg()))),
      },
      resolve: async (
        _,
        { user_id, status, address, product_ids, quantities },
        context,
      ) => {
        if (product_ids.length !== quantities.length) {
          createError(
            "Product IDs and quantities must have the same length",
            ApolloServerErrorCode.BAD_USER_INPUT,
          );
        }

        try {
          return await context.prisma.$transaction(
            async (prisma: PrismaClient) => {
              const products = await prisma.product.findMany({
                where: { id: { in: product_ids } },
              });

              if (products.length !== product_ids.length) {
                createError(
                  "Some products not found",
                  ApolloServerErrorCode.BAD_USER_INPUT,
                );
              }

              let total_price = 0;
              const orderDetails = product_ids.map(
                (product_id: string, index: number) => {
                  const product = products.find((p) => p.id === product_id);
                  if (!product) {
                    throw new GraphQLError(
                      `Product with id ${product_id} not found`,
                      {
                        extensions: {
                          code: ApolloServerErrorCode.BAD_USER_INPUT,
                        },
                      },
                    );
                  }
                  if (product.status !== ProductStatus.AVAILABLE) {
                    throw new GraphQLError(
                      `Product ${product_id} is not available for sale`,
                      {
                        extensions: {
                          code: ApolloServerErrorCode.BAD_USER_INPUT,
                        },
                      },
                    );
                  }
                  if (product.count < quantities[index]) {
                    throw new GraphQLError(
                      `Insufficient stock for product ${product_id}`,
                      {
                        extensions: {
                          code: ApolloServerErrorCode.BAD_USER_INPUT,
                        },
                      },
                    );
                  }

                  const price = product.sale ?? product.price;
                  total_price += price * quantities[index];
                  return {
                    order_id: "", // Will be set after order creation
                    product_id,
                    quantity: quantities[index],
                    price_at_order: price,
                  };
                },
              );

              const order = await prisma.order.create({
                data: {
                  user_id,
                  status,
                  address,
                  total_price,
                  is_deleted: false,
                },
              });

              // Update order details with order_id and create them
              const orderDetailsWithId = orderDetails.map(
                (detail: OrderDetail) => ({
                  ...detail,
                  order_id: order.id,
                }),
              );
              await prisma.orderDetail.createMany({
                data: orderDetailsWithId,
              });

              // Update product counts
              for (let i = 0; i < products.length; i++) {
                await prisma.product.update({
                  where: { id: products[i].id },
                  data: { count: products[i].count - quantities[i] },
                });
              }

              return prisma.order.findUnique({
                where: { id: order.id },
                include: { order_details: true },
              });
            },
          );
        } catch (error) {
          if (error instanceof GraphQLError) {
            throw error;
          }
          throw new GraphQLError("Failed to create order", {
            extensions: { code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR },
          });
        }
      },
    });

    // Update an existing order
    t.nonNull.field("updateOrder", {
      type: "Order",
      args: {
        id: nonNull(stringArg()),
        status: nonNull(stringArg()),
        address: stringArg(),
      },
      resolve: async (_, { id, status, address }, context) => {
        if (!Object.values(OrderStatus).includes(status)) {
          throw new GraphQLError("Invalid order status", {
            extensions: { code: ApolloServerErrorCode.BAD_USER_INPUT },
          });
        }

        try {
          return await context.prisma.$transaction(
            async (prisma: PrismaClient) => {
              const order = await prisma.order.findUnique({
                where: { id },
                include: { order_details: true },
              });

              if (!order) {
                throw new GraphQLError("Order not found", {
                  extensions: { code: ApolloServerErrorCode.BAD_USER_INPUT },
                });
              }

              const oldStatus = order.status;

              // Update order
              const updatedOrder = await prisma.order.update({
                where: { id },
                data: {
                  status,
                  address: address || undefined,
                },
                include: { order_details: true },
              });

              // Adjust inventory based on status change
              if (status !== oldStatus) {
                switch (status) {
                  case OrderStatus.CANCELLED:
                  case OrderStatus.REFUND:
                    if (
                      oldStatus === OrderStatus.ORDER ||
                      oldStatus === OrderStatus.DELIVERED
                    ) {
                      // Increase inventory if order is cancelled or refunded
                      for (const detail of order.order_details) {
                        await prisma.product.update({
                          where: { id: detail.product_id },
                          data: {
                            count: {
                              increment: detail.quantity,
                            },
                          },
                        });
                      }
                    }
                    break;

                  case OrderStatus.ORDER:
                    if (
                      oldStatus === OrderStatus.CANCELLED ||
                      oldStatus === OrderStatus.REFUND
                    ) {
                      // Decrease inventory if order is reactivated
                      for (const detail of order.order_details) {
                        const product = (await prisma.product.findUnique({
                          where: { id: detail.product_id },
                        })) as Product;
                        if (product.count < detail.quantity) {
                          throw new GraphQLError(
                            `Insufficient stock for product ${detail.product_id}`,
                            {
                              extensions: {
                                code: ApolloServerErrorCode.BAD_USER_INPUT,
                              },
                            },
                          );
                        }
                        await prisma.product.update({
                          where: { id: detail.product_id },
                          data: {
                            count: {
                              decrement: detail.quantity,
                            },
                          },
                        });
                      }
                    }
                    break;
                  default:
                    break;
                }
              }

              return updatedOrder;
            },
          );
        } catch (error) {
          if (error instanceof GraphQLError) {
            throw error;
          }
          throw new GraphQLError("Failed to update order", {
            extensions: { code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR },
          });
        }
      },
    });

    // Delete an order (soft delete)
    t.nonNull.field("deleteOrder", {
      type: "Order",
      args: {
        id: nonNull(stringArg()),
      },
      resolve: async (_, { id }, context) => {
        try {
          return await context.prisma.$transaction(
            async (prisma: PrismaClient) => {
              const order = await prisma.order.findUnique({
                where: { id },
                include: { order_details: true },
              });

              if (!order) {
                throw new GraphQLError("Order not found", {
                  extensions: { code: ApolloServerErrorCode.BAD_USER_INPUT },
                });
              }

              // Increase inventory for cancelled order
              for (const detail of order.order_details) {
                await prisma.product.update({
                  where: { id: detail.product_id },
                  data: {
                    count: {
                      increment: detail.quantity,
                    },
                  },
                });
              }

              return prisma.order.update({
                where: { id },
                data: {
                  is_deleted: true,
                  status: "CANCELLED",
                },
                include: { order_details: true },
              });
            },
          );
        } catch (error) {
          if (error instanceof GraphQLError) {
            throw error;
          }
          throw new GraphQLError("Failed to delete order", {
            extensions: { code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR },
          });
        }
      },
    });
    t.nonNull.field("updateOrderQuantity", {
      type: "Order",
      args: {
        orderId: nonNull(stringArg()),
        productId: nonNull(stringArg()),
        newQuantity: nonNull(intArg()),
      },
      resolve: async (_, { orderId, productId, newQuantity }, context) => {
        if (newQuantity < 0) {
          throw new GraphQLError("Quantity cannot be negative", {
            extensions: { code: ApolloServerErrorCode.BAD_USER_INPUT },
          });
        }

        try {
          return await context.prisma.$transaction(
            async (prisma: PrismaClient) => {
              // Fetch the order with its details
              const order = await prisma.order.findUnique({
                where: { id: orderId },
                include: { order_details: true },
              });

              if (!order) {
                throw new GraphQLError("Order not found", {
                  extensions: { code: ApolloServerErrorCode.BAD_USER_INPUT },
                });
              }

              // Find the specific order detail
              const orderDetail = order.order_details.find(
                (detail) => detail.product_id === productId,
              );
              if (!orderDetail) {
                throw new GraphQLError("Product not found in this order", {
                  extensions: { code: ApolloServerErrorCode.BAD_USER_INPUT },
                });
              }

              // Calculate the quantity difference
              const quantityDifference = newQuantity - orderDetail.quantity;

              // Fetch the product to check and update inventory
              const product = await prisma.product.findUnique({
                where: { id: productId },
              });

              if (!product) {
                throw new GraphQLError("Product not found", {
                  extensions: { code: ApolloServerErrorCode.BAD_USER_INPUT },
                });
              }

              // Check if we have enough inventory
              if (product.count < quantityDifference) {
                throw new GraphQLError("Insufficient product inventory", {
                  extensions: { code: ApolloServerErrorCode.BAD_USER_INPUT },
                });
              }

              // Update product inventory
              await prisma.product.update({
                where: { id: productId },
                data: {
                  count: {
                    decrement: quantityDifference,
                  },
                },
              });
              await prisma.orderDetail.update({
                where: { id: orderDetail.id },
                data: {
                  quantity: newQuantity,
                },
              });

              // Recalculate total price
              const updatedOrderDetails = await prisma.orderDetail.findMany({
                where: { order_id: orderId },
              });

              const newTotalPrice = updatedOrderDetails.reduce(
                (sum, detail) => sum + detail.price_at_order * detail.quantity,
                0,
              );

              // Update order with new total price
              const updatedOrder = await prisma.order.update({
                where: { id: orderId },
                data: {
                  total_price: newTotalPrice,
                },
                include: { order_details: true },
              });

              return updatedOrder;
            },
          );
        } catch (error) {
          if (error instanceof GraphQLError) {
            throw error;
          }
          throw new GraphQLError("Failed to update order quantity", {
            extensions: { code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR },
          });
        }
      },
    });
  },
});
