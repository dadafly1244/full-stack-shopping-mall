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
      resolve: (_, __, ctx) => {
        return ctx.prisma.product.findMany();
      },
    });
    t.field("product", {
      type: "Product",
      args: {
        id: nonNull(stringArg()),
      },
      resolve: (_, { id }, ctx) => {
        return ctx.prisma.product.findUnique({
          where: { id },
        });
      },
    });
  },
});
