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

export const OrderQuery = extendType({
  type: "Query",
  definition(t) {
    // Get a single order by ID
    t.field("getOrder", {
      type: "Order",
      args: {
        id: nonNull(stringArg()),
      },
      resolve: async (_, { id }, context) => {
        try {
          const order = await context.prisma.order.findUnique({
            where: { id },
            include: { order_details: true },
          });
          if (!order) {
            throw new GraphQLError("Order not found", {
              extensions: { code: ApolloServerErrorCode.BAD_USER_INPUT },
            });
          }
          return order;
        } catch (error) {
          throw new GraphQLError("Failed to fetch order", {
            extensions: { code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR },
          });
        }
      },
    });

    // Get all orders
    t.field("getAllOrders", {
      type: nonNull("PaginatedOrdersResult"),
      args: {
        page: nonNull(intArg({ default: 1 })),
        pageSize: nonNull(intArg({ default: 10 })),
      },
      resolve: async (_, args, context) => {
        try {
          const totalCount = await context.prisma.order.count();
          if (totalCount < 0 || totalCount === undefined) {
            throw new GraphQLError("총 주문 수를 계산하지 못했습니다.", {
              extensions: {
                code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR,
              },
            });
          }
          const orders = await context.prisma.order.findMany({
            skip: (args.page - 1) * args.pageSize,
            take: args.pageSize,
            where: { is_deleted: false },
            include: { order_details: true },
          });

          if (!orders) {
            throw new GraphQLError("제품을 찾지 못했습니다.", {
              extensions: {
                code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR,
              },
            });
          }
          return {
            orders, // TODO: 여기에서 order 에러나는거 고치기
            pageInfo: {
              currentPage: args.page,
              pageSize: args.pageSize,
              totalCount,
              totalPages: Math.ceil(totalCount / args.pageSize),
            },
          };
        } catch (error) {
          if (error instanceof GraphQLError) {
            throw error;
          }
          throw new GraphQLError("Failed to fetch orders", {
            extensions: { code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR },
          });
        }
      },
    });

    // Search orders
    t.nonNull.list.nonNull.field("searchOrders", {
      type: "Order",
      args: {
        searchTerm: nonNull(stringArg()),
      },
      resolve: async (_, { searchTerm }, context) => {
        try {
          return await context.prisma.order.findMany({
            where: {
              OR: [
                { id: { contains: searchTerm } },
                { user_id: { contains: searchTerm } },
                { address: { contains: searchTerm } },
              ],
              is_deleted: false,
            },
            include: { order_details: true },
          });
        } catch (error) {
          if (error instanceof GraphQLError) {
            throw error;
          }
          throw new GraphQLError("Failed to search orders", {
            extensions: { code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR },
          });
        }
      },
    });
    t.nonNull.list.nonNull.field("searchOrdersByStatus", {
      type: "Order",
      args: {
        status: nullable(arg({ type: "OrderStatus" })),
      },
      resolve: async (_, { status }, context) => {
        try {
          return await context.prisma.order.findMany({
            where: {
              status,
              is_deleted: false,
            },
            include: { order_details: true },
          });
        } catch (error) {
          if (error instanceof GraphQLError) {
            throw error;
          }
          throw new GraphQLError("Failed to search orders", {
            extensions: { code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR },
          });
        }
      },
    });
  },
});

// // Query
// export const OrderQuery = extendType({
//   type: "Query",
//   definition(t) {
//     // Get a single order
//     t.field("getOrder", {
//       type: "Order",
//       args: {
//         id: nonNull(stringArg()),
//       },
//       resolve: async (_, { id }, ctx) => {
//         const order = await ctx.prisma.order.findUnique({
//           where: { id },
//           include: { users: true, carts: true },
//         });
//         if (!order) {
//           throw new GraphQLError("Order not found", {
//             extensions: { code: ApolloServerErrorCode.BAD_USER_INPUT },
//           });
//         }

//         return order;
//       },
//     });

//     // Get all orders for a user
//     t.nonNull.list.nonNull.field("getUserOrders", {
//       type: "Order",
//       args: {
//         userId: nonNull(stringArg()),
//       },
//       resolve: async (_, { userId }, ctx) => {
//         return ctx.prisma.order.findMany({
//           where: { user_id: userId, is_deleted: { not: "true" } },
//           include: { users: true, carts: true },
//           orderBy: { created_at: "desc" },
//         });
//       },
//     });

//     // Get all orders (you can add pagination here if needed)
//     t.nonNull.list.nonNull.field("getAllOrders", {
//       type: "Order",
//       resolve: (_, __, ctx) => {
//         return ctx.prisma.order.findMany();
//       },
//     });
//   },
// });
