import { extendType, stringArg, intArg, nonNull, list, arg } from "nexus";
import { GraphQLError } from "graphql";
import { ApolloServerErrorCode } from "@apollo/server/errors";
import { isAdmin, validUser } from "#/graphql/validators";

export const OrderQuery = extendType({
  type: "Query",
  definition(t) {
    t.field("getUserOrders", {
      type: nonNull("PaginatedOrdersResult"),
      args: {
        user_id: nonNull(stringArg()),
        page: nonNull(intArg({ default: 1 })),
        pageSize: nonNull(intArg({ default: 10 })),
      },
      authorize: validUser,
      resolve: async (_, { user_id, page, pageSize }, context) => {
        const totalCount = await context.prisma.order.count({
          where: { user_id, is_deleted: false },
        });

        const orders = await context.prisma.order.findMany({
          where: { user_id, is_deleted: false },
          skip: (page - 1) * pageSize,
          take: pageSize,
          include: { order_details: true },
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

    t.field("searchUserOrders", {
      type: nonNull("PaginatedOrdersResult"),
      args: {
        user_id: nonNull(stringArg()),
        searchTerm: nonNull(stringArg()),
        page: nonNull(intArg({ default: 1 })),
        pageSize: nonNull(intArg({ default: 10 })),
        status: arg({ type: "OrderStatus" }),
      },
      authorize: validUser,
      resolve: async (
        _,
        { user_id, searchTerm, page, pageSize, status },
        context,
      ) => {
        const whereClause = {
          user_id,
          is_deleted: false,
          OR: [
            { id: { contains: searchTerm } },
            { address: { contains: searchTerm } },
            {
              order_details: {
                some: {
                  product: {
                    name: { contains: searchTerm },
                  },
                },
              },
            },
          ],
          ...(status && { status }),
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

    t.field("getUserOrder", {
      type: "Order",
      args: {
        user_id: nonNull(stringArg()),
        order_id: nonNull(stringArg()),
      },
      resolve: async (_, { user_id, order_id }, context) => {
        const order = await context.prisma.order.findUnique({
          where: { id: order_id, user_id, is_deleted: false },
          include: { order_details: true },
        });

        if (!order) {
          throw new GraphQLError("Order not found", {
            extensions: { code: ApolloServerErrorCode.BAD_USER_INPUT },
          });
        }

        return order;
      },
    });
    // Admin: 모든 주문 조회 (pagination)
    t.field("getAllOrders", {
      type: nonNull("PaginatedOrdersResult"),
      args: {
        page: nonNull(intArg({ default: 1 })),
        pageSize: nonNull(intArg({ default: 10 })),
        status: arg({ type: "OrderStatus" }),
      },
      authorize: isAdmin,
      resolve: async (_, args, context) => {
        const where = args.status
          ? { status: args.status, is_deleted: false }
          : { is_deleted: false };

        const totalCount = await context.prisma.order.count({ where });

        const orders = await context.prisma.order.findMany({
          where,
          skip: (args.page - 1) * args.pageSize,
          take: args.pageSize,
          include: { order_details: true },
          orderBy: { created_at: "desc" },
        });

        return {
          orders,
          pageInfo: {
            currentPage: args.page,
            pageSize: args.pageSize,
            totalCount,
            totalPages: Math.ceil(totalCount / args.pageSize),
          },
        };
      },
    });

    t.field("getOrder", {
      type: "Order",
      args: {
        order_id: nonNull(stringArg()),
      },
      authorize: isAdmin,
      resolve: async (_, { order_id }, context) => {
        const totalCount = await context.prisma.order.count({
          where: {
            id: order_id,
          },
        });

        const orders = await context.prisma.order.findUnique({
          where: {
            id: order_id,
          },
          include: { order_details: true },
        });

        return orders;
      },
    });

    // Admin: 주문 검색
    t.field("searchOrders", {
      type: nonNull(list(nonNull("Order"))),
      args: {
        searchTerm: nonNull(stringArg()),
      },
      authorize: isAdmin,
      resolve: async (_, { searchTerm }, context) => {
        return context.prisma.order.findMany({
          where: {
            OR: [
              { id: { contains: searchTerm } },
              { address: { contains: searchTerm } },
              { user: { name: { contains: searchTerm } } },
              { user: { email: { contains: searchTerm } } },
            ],
            is_deleted: false,
          },
          include: { order_details: true },
        });
      },
    });
  },
});
