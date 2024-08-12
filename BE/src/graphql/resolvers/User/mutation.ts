import {
  objectType,
  enumType,
  nonNull,
  nullable,
  stringArg,
  intArg,
  arg,
  booleanArg,
  extendType,
} from "nexus";

export const UserMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("createUser", {
      // 사용자 생성 - 권한관련? 설정이 필요한 것 같음.!!
      type: "User",
      args: {
        user_id: nonNull(stringArg()),
        email: nonNull(stringArg()),
        password: nonNull(stringArg()),
        gender: nonNull(arg({ type: "Gender" })),
        phone_number: nullable(stringArg()),
        status: nonNull(arg({ type: "UserStatus" })),
        permissions: nonNull(arg({ type: " UserPermissions" })),
      },
      resolve: async (_, args, context) => {
        return await context.prisma.user.create({
          data: args,
        });
      },
    });
    t.nonNull.field("updateUser", {
      //사용자 업데이트
      type: "User",
      args: {
        id: nonNull(stringArg()),
        user_id: nonNull(stringArg()),
        email: nonNull(stringArg()),
        password: nonNull(stringArg()),
        gender: nonNull(arg({ type: "Gender" })),
        phone_number: nullable(stringArg()),
        status: nonNull(arg({ type: "UserStatus" })),
        permissions: nonNull(arg({ type: " UserPermissions" })),
      },
      resolve: async (
        _,
        {
          id,
          user_id,
          email,
          password,
          gender,
          phone_number,
          status,
          permissions,
        },
        context,
      ) => {
        return await context.prisma.user.update({
          where: { id: id },
          data: {
            user_id,
            email,
            password,
            gender,
            phone_number,
            status,
            permissions,
          },
        });
      },
    });
    t.nonNull.field("deleteUser", {
      type: "User",
      args: {
        id: nonNull(stringArg()),
      },
      resolve: async (_, { id }, context) => {
        return await context.prisma.user.create({
          where: { id: id },
        });
      },
    });
  },
});
