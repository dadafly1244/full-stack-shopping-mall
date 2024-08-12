import {
  objectType,
  enumType,
  nonNull,
  stringArg,
  intArg,
  booleanArg,
  extendType,
  nullable,
} from "nexus";

export const ProductQuery = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.list.nonNull.field("products", {
      // 물건 전체 불러오기 pagenations
      type: "Product",
      resolve: async (_, __, context) => {
        return await context.prisma.product.findMany({
          take: 20,
          orderBy: {
            updated_at: "desc",
          },
        });
      },
    });
    t.nonNull.list.nonNull.field("products", {
      // 물건 이름으로 조회하기
      type: "Product",
      args: {
        name: nonNull(stringArg()),
        skip: nullable(intArg()),
        take: nullable(intArg()),
      },
      resolve: async (_, { name, skip, take }, context) => {
        return await context.prisma.product.findMany({
          skip: skip ?? undefined,
          take: take ?? undefined,
          where: {
            name: {
              contains: name,
            },
          },
          orderBy: {
            updated_at: "desc",
          },
        });
      },
    });
    t.field("product", {
      // 물건 아이디로 물건 조회하기
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
