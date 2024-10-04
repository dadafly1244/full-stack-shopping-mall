import { extendType, stringArg, intArg, nonNull, list, arg } from "nexus";
import { GraphQLError } from "graphql";
import { ApolloServerErrorCode } from "@apollo/server/errors";
import { isAdmin, isAuthenticated, validUser } from "#/graphql/validators";
import { OrderStatus } from "@prisma/client";

interface CartItem {
  quantity: number;
  product: { price: number; sale?: number };
  product_id: string;
}
export const OrderMutation = extendType({
  type: "Mutation",
  definition(t) {
    // 사용자: 장바구니 전체 주문
    t.field("createOrderFromCart", {
      type: "Order",
      args: {
        cart_id: nonNull(stringArg()),
        address: nonNull(stringArg()),
      },
      authorize: isAuthenticated,
      resolve: async (_, { cart_id, address }, context) => {
        const cart = await context.prisma.cart.findUnique({
          where: { id: cart_id },
          include: { items: { include: { product: true } }, user: true },
        });

        if (!cart || cart.items.length === 0) {
          throw new GraphQLError("Cart is empty", {
            extensions: { code: ApolloServerErrorCode.BAD_USER_INPUT },
          });
        }

        // Calculate the total price
        const totalPrice = cart.items.reduce(
          (
            sum: number,
            item: {
              quantity: number;
              product: { price: number; sale?: number };
            },
          ) => {
            const price = item.product?.sale
              ? item.product?.sale
              : item.product.price;
            return sum + item.quantity * price;
          },
          0,
        );

        const order = await context.prisma.order.create({
          data: {
            user_id: cart.user_id,
            status: OrderStatus.READY_TO_ORDER,
            address,
            total_price: totalPrice, // Add this line
            cart_id: cart.id,
            order_details: {
              create: cart.items.map((item: CartItem) => {
                const price_at_order = item.product?.sale
                  ? item.product.sale
                  : item.product.price;
                return {
                  product_id: item.product_id,
                  quantity: item.quantity,
                  price_at_order,
                };
              }),
            },
          },
          include: { order_details: true },
        });

        if (!order) {
          throw new GraphQLError("Order creation failed", {
            extensions: { code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR },
          });
        }

        // Clear the cart
        await context.prisma.cartItem.deleteMany({
          where: { cart_id: cart.id },
        });

        return order;
      },
    });

    // 사용자: 장바구니 속 제품 개별 주문
    t.field("createOrderFromCartItem", {
      type: "Order",
      args: {
        cart_id: nonNull(stringArg()),
        cart_item_id: nonNull(stringArg()),
        address: nonNull(stringArg()),
      },
      authorize: isAuthenticated,
      resolve: async (_, { cart_id, cart_item_id, address }, context) => {
        const cart = await context.prisma.cart.findUnique({
          where: { id: cart_id },
          include: { user: true },
        });

        if (!cart) {
          throw new GraphQLError("Cart not found", {
            extensions: { code: ApolloServerErrorCode.BAD_USER_INPUT },
          });
        }

        const cartItem = await context.prisma.cartItem.findUnique({
          where: { id: cart_item_id },
          include: { product: true },
        });

        if (!cartItem || cartItem.cart_id !== cart_id) {
          throw new GraphQLError("Cart item not found", {
            extensions: { code: ApolloServerErrorCode.BAD_USER_INPUT },
          });
        }

        const totalPrice = cartItem.quantity * cartItem.product.price;

        const order = await context.prisma.order.create({
          data: {
            user_id: cart.user_id,
            status: OrderStatus.READY_TO_ORDER,
            address,
            total_price: totalPrice,
            cart_id: cart.id,
            order_details: {
              create: {
                product_id: cartItem.product_id,
                quantity: cartItem.quantity,
                price_at_order: cartItem.product.price,
              },
            },
          },
          include: { order_details: true },
        });

        if (!order) {
          throw new GraphQLError("order가 이상함. 실패함", {
            extensions: {
              code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR,
            },
          });
        }

        // Remove the item from the cart
        await context.prisma.cartItem.delete({
          where: { id: cart_item_id },
        });

        return order;
      },
    });

    // 사용자: 주문 취소
    t.field("cancelOrder", {
      type: "Order",
      args: {
        user_id: nonNull(stringArg()),
        order_id: nonNull(stringArg()),
      },
      authorize: isAuthenticated,
      resolve: async (_, { order_id, user_id }, context) => {
        const order = await context.prisma.order.findUnique({
          where: { id: order_id },
        });

        if (!order || order.user_id !== user_id) {
          throw new GraphQLError("Order not found", {
            extensions: { code: ApolloServerErrorCode.BAD_USER_INPUT },
          });
        }

        if (order.status !== "READY_TO_ORDER") {
          throw new GraphQLError("Order cannot be cancelled", {
            extensions: { code: ApolloServerErrorCode.BAD_USER_INPUT },
          });
        }

        return context.prisma.order.update({
          where: { id: order_id },
          data: { status: "CANCELLED" },
        });
      },
    });

    // Admin: 주문 상태 업데이트
    t.field("updateOrderStatus", {
      type: "Order",
      args: {
        order_id: nonNull(stringArg()),
        status: nonNull(arg({ type: "OrderStatus" })),
      },
      authorize: isAdmin,
      resolve: async (_, { order_id, status }, context) => {
        return context.prisma.order.update({
          where: { id: order_id },
          data: { status },
        });
      },
    });

    // Admin: 주문 삭제 (soft delete)
    t.field("deleteOrder", {
      type: "Order",
      args: {
        orderId: nonNull(stringArg()),
      },
      authorize: isAdmin,
      resolve: async (_, { orderId }, context) => {
        return context.prisma.order.update({
          where: { id: orderId },
          data: { is_deleted: true },
        });
      },
    });

    //Admin 상태로 주문 검색하기
    t.field("searchOrdersByStatus", {
      type: nonNull("PaginatedOrdersResult"),
      args: {
        status: nonNull(arg({ type: "OrderStatus" })),
        page: nonNull(intArg({ default: 1 })),
        pageSize: nonNull(intArg({ default: 10 })),
      },
      authorize: isAdmin,
      resolve: async (_, { status, page, pageSize }, context) => {
        const whereClause = {
          status,
          is_deleted: false,
        };

        const totalCount = await context.prisma.order.count({
          where: whereClause,
        });

        const orders = await context.prisma.order.findMany({
          where: whereClause,
          skip: (page - 1) * pageSize,
          take: pageSize,
          include: { order_details: { include: { product: true } } },
          orderBy: { created_at: "desc" },
        });

        return {
          orders,
          pageInfo: {
            currentPage: page,
            pageSize: pageSize,
            totalCount,
            totalPages: Math.ceil(totalCount / pageSize),
          },
        };
      },
    });
  },
});
