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
      resolve: async (_, __, context) => {
        return await context.prisma.user.findMany();
      },
    });
    t.nonNull.list.nonNull.field("users", {
      type: "User",
      resolve: async (_, args, context) => {
        const { user_id, email } = args;

        const user = await context.prisma.user.findUnique({
          where: { user_id: user_id, email: email },
        });
        if (!user) {
          return true;
        } else {
          return false;
        }
      },
    });
  },
});
