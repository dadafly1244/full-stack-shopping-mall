import {
  objectType,
  enumType,
  nonNull,
  nullable,
  stringArg,
  intArg,
  booleanArg,
  extendType,
} from "nexus";

export const UserQuery = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.list.field("users", {
      type: "User",
      resolve: async (_, __, context) => {
        return await context.prisma.user.findMany();
      },
    });
  },
});

export const UserBooleanQuery = extendType({
  type: "Query",

  definition(t) {
    t.field("isDuplicated", {
      type: "UserBoolean",
      args: {
        user_id: nullable(stringArg()),
        email: nullable(stringArg()),
      },
      resolve: async (_, args, context) => {
        let user;
        if (args?.user_id) {
          user = await context.prisma.user.findUnique({
            where: { user_id: args.user_id },
          });
        } else if (args?.email) {
          user = await context.prisma.user.findUnique({
            where: { email: args.email },
          });
        } else throw new Error("id나 email를 입력해주세요");

        if (!user) return { duplicated: false };
        else return { duplicated: true };
      },
    });
  },
});
