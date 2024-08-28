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
        id: idArg(),
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
          const products = await context.prisma.product.findMany({
            where,
            skip: (args.page - 1) * args.pageSize,
            take: args.pageSize,
          });

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
          const products = await context.prisma.product.findMany({
            skip: (args.page - 1) * args.pageSize,
            take: args.pageSize,
          });

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
        id: nonNull(idArg()),
      },
      resolve: async (_, args, context) => {
        try {
          const product = await context.prisma.product.findUnique({
            where: { id: args.id },
          });
          if (!product) {
            throw new GraphQLError("Product not found", {
              extensions: {
                code: ApolloServerErrorCode.BAD_USER_INPUT,
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
