import { extendType, idArg, stringArg, intArg, nonNull } from "nexus";
import { GraphQLError } from "graphql";
import { ApolloServerErrorCode } from "@apollo/server/errors";

export const ProductQuery = extendType({
  type: "Query",
  definition(t) {
    // searchProducts query with pagination
    t.field("searchProducts", {
      type: nonNull("PaginatedProductsResult"),
      args: {
        id: stringArg(),
        name: stringArg(),
        desc: stringArg(),
        category_id: intArg(),
        store_id: stringArg(),
        page: nonNull(intArg({ default: 1 })),
        pageSize: nonNull(intArg({ default: 10 })),
      },
      resolve: async (_, args, context) => {
        try {
          const where = {
            OR: [
              { id: args.id },
              { name: { contains: args.name } },
              { desc: { contains: args.desc } },
              { category_id: args.category_id },
              { store_id: args.store_id },
            ],
          };

          const totalCount = await context.prisma.product.count({ where });

          if (totalCount < 0 || totalCount === undefined) {
            throw new GraphQLError("총 제품 수를 계산하지 못했습니다.", {
              extensions: {
                code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR,
              },
            });
          }
          const products = await context.prisma.product.findMany({
            where,
            skip: (args.page - 1) * args.pageSize,
            take: args.pageSize,
          });

          if (!products) {
            throw new GraphQLError("제품을 찾지 못했습니다.", {
              extensions: {
                code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR,
              },
            });
          }

          return {
            products,
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
          throw new GraphQLError("Failed to search Products", {
            extensions: {
              code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR,
              invalidArgs: Object.keys(args).filter(
                (key) => args[key] !== undefined,
              ),
            },
          });
        }
      },
    });

    // getAllProducts query with pagination
    t.field("getAllProducts", {
      type: nonNull("PaginatedProductsResult"),
      args: {
        page: nonNull(intArg({ default: 1 })),
        pageSize: nonNull(intArg({ default: 10 })),
      },
      resolve: async (_, args, context) => {
        try {
          const totalCount = await context.prisma.product.count();
          if (totalCount < 0 || totalCount === undefined) {
            throw new GraphQLError("총 제품 수를 계산하지 못했습니다.", {
              extensions: {
                code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR,
              },
            });
          }
          const products = await context.prisma.product.findMany({
            skip: (args.page - 1) * args.pageSize,
            take: args.pageSize,
          });

          if (!products) {
            throw new GraphQLError("제품을 찾지 못했습니다.", {
              extensions: {
                code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR,
              },
            });
          }
          return {
            products,
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
          throw new GraphQLError("Failed to fetch all Products", {
            extensions: {
              code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR,
            },
          });
        }
      },
    });

    // getProduct query (unchanged)
    t.field("getProduct", {
      type: "Product",
      args: {
        id: nonNull(stringArg()),
      },
      resolve: async (_, args, context) => {
        try {
          const product = await context.prisma.product.findUnique({
            where: { id: args.id },
          });
          if (!product) {
            throw new GraphQLError("제품을 찾지 못했습니다.", {
              extensions: {
                code: ApolloServerErrorCode.BAD_USER_INPUT,
                invalidArgs: ["id"],
              },
            });
          }
          return product;
        } catch (error) {
          if (error instanceof GraphQLError) {
            throw error;
          }
          throw new GraphQLError("Failed to fetch Product", {
            extensions: {
              code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR,
            },
          });
        }
      },
    });
  },
});
