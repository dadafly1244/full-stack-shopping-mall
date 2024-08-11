import {
  objectType,
  enumType,
  nonNull,
  stringArg,
  intArg,
  booleanArg,
  extendType,
} from "nexus";

export const ProductQuery = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.list.nonNull.field("products", {
      type: "Product",
      resolve: async (_, __, context) => {
        return await context.prisma.product.findMany();
      },
    });
    t.field("product", {
      type: "Product",
      args: {
        id: nonNull(stringArg()),
      },
      resolve: async (_, { id }, context) => {
        return await context.prisma.product.findUnique({
          where: { id },
        });
      },
    });
  },
});
