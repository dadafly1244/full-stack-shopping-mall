import { extendType, idArg, stringArg, intArg, nonNull } from "nexus";
import { GraphQLError } from "graphql";
import { ApolloServerErrorCode } from "@apollo/server/errors";

export const ProductQuery = extendType({
  type: "Query",
  definition(t) {
    // searchProducts query
    t.nonNull.list.nonNull.field("searchProducts", {
      type: "Product",
      args: {
        id: idArg(),
        name: stringArg(),
        desc: stringArg(),
        category_id: intArg(),
        store_id: stringArg(),
      },
      resolve: async (_, args, context) => {
        try {
          const products = await context.prisma.product.findMany({
            where: {
              OR: [
                { id: args.id },
                { name: { contains: args.name } },
                { desc: { contains: args.desc } },
                { category_id: args.category_id },
                { store_id: args.store_id },
              ],
            },
          });
          return products;
        } catch (error) {
          throw new GraphQLError("Failed to search Products", {
            extensions: {
              code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR,
              invalidArgs: [
                args.id && "id",
                args.desc && "desc",
                args.desc && "desc",
                args.category_id && "category_id",
                args.store_id && "store_id",
              ],
            },
          });
        }
      },
    });

    // 전체 product를 가져오는 query
    t.nonNull.list.nonNull.field("getAllProducts", {
      type: "Product",
      resolve: async (_, __, context) => {
        try {
          const products = await context.prisma.product.findMany();
          return products;
        } catch (error) {
          throw new GraphQLError("Failed to fetch all Products", {
            extensions: {
              code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR,
            },
          });
        }
      },
    });

    // 하나의 product를 가져오는 query
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
