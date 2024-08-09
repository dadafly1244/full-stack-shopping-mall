import {
  objectType,
  enumType,
  nonNull,
  stringArg,
  intArg,
  booleanArg,
  extendType,
} from "nexus";

export const UserQuery = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.list.nonNull.field("users", {
      type: "User",
      resolve: (_, __, ctx) => {
        return ctx.prisma.user.findMany();
      },
    });
    // 다른 쿼리들 추가...
  },
});
