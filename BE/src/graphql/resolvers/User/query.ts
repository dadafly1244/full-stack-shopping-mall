import {
  objectType,
  enumType,
  nonNull,
  nullable,
  stringArg,
  intArg,
  booleanArg,
  extendType,
  list,
  arg,
} from "nexus";
import { isAdmin } from "#/graphql/validators";
import { Prisma } from "@prisma/client";

export const UserQuery = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.list.field("usersList", {
      //관리자 : 전체 사용자 조회
      type: "User",
      authorize: isAdmin,
      resolve: async (_, __, context) => {
        return await context.prisma.user.findMany();
      },
    });
    t.nonNull.list.field("filteredUsers", {
      // 관리자: 사용자 검색
      type: "User",
      args: {
        name: nullable(stringArg()),
        user_id: nullable(stringArg()),
        email: nullable(stringArg()),
        phone_number: nullable(stringArg()),
        status: nullable(arg({ type: "UserStatus" })),
        permissions: nullable(arg({ type: "UserPermissions" })),
        gender: nullable(arg({ type: "Gender" })),
      },
      authorize: isAdmin,
      resolve: async (_, args, context) => {
        const where: Prisma.UserWhereInput = {};
        if (args.name) where.name = { contains: args.name };
        if (args.user_id) where.user_id = { contains: args.user_id };
        if (args.email) where.email = { contains: args.email };
        if (args.phone_number)
          where.phone_number = { contains: args.phone_number };
        if (args.status) where.status = args.status;
        if (args.permissions) where.permissions = args.permissions;
        if (args.gender) where.gender = args.gender;
        const users = await context.prisma.user.findMany({ where });
        return users;
      },
    });
  },
});

export const UserBooleanQuery = extendType({
  //이메일, id 중복 체크
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
        console.log(conditions);
        const user = await context.prisma.user.findFirst({
          where: {
            OR: conditions,
          },
        });
        if (!user) return { duplicated: false };

        return { duplicated: true };
      },
    });
  },
});
