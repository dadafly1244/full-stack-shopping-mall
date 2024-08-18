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
        if (!args?.user_id && !args?.email) {
          throw new Error("user_id 또는 email을 입력해주세요");
        }

        const conditions = [];
        if (args.user_id) conditions.push({ user_id: args.user_id });
        if (args.email) conditions.push({ email: args.email });

        const user = await context.prisma.user.findFirst({
          where: {
            OR: conditions,
          },
        });

        return { duplicated: !!user };
      },
    });
  },
});
