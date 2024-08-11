import {
  objectType,
  enumType,
  nonNull,
  stringArg,
  intArg,
  booleanArg,
  extendType,
} from "nexus";

export const UserMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("createUser", {
      type: "User",
      args: {
        user_id: nonNull(stringArg()),
        email: nonNull(stringArg()),
        password: nonNull(stringArg()),
        gender: nonNull("Gender"),
      },
      resolve: async (_, args, context) => {
        return await context.prisma.user.create({
          data: args,
        });
      },
    });
    // 다른 뮤테이션들 추가...
  },
});
