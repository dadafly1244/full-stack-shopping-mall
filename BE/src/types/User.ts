import { objectType, extendType, nonNull, stringArg, enumType } from "nexus";
import { Gender, UserStatus, UserPermissions } from "@prisma/client";
import { DateTimeResolver } from "graphql-scalars";

export const UserType = objectType({
  name: "User",
  definition(t) {
    t.nonNull.string("id");
    t.nonNull.string("user_id");
    t.nonNull.string("email");
    t.nonNull.field("gender", { type: "Gender" });
    t.string("phone_number");
    t.nonNull.field("status", { type: "UserStatus" });
    t.nonNull.field("permissions", { type: "UserPermissions" });
    t.nonNull.field("created_at", { type: "DateTime" });
    t.nonNull.field("updated_at", { type: "DateTime" });

    t.list.nonNull.field("carts", {
      type: "Cart",
      resolve: (parent, _, ctx) => {
        return ctx.prisma.user.findUnique({ where: { id: parent.id } }).carts();
      },
    });
    // 다른 필드들도 추가...
  },
});

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
      resolve: (_, args, ctx) => {
        return ctx.prisma.user.create({
          data: args,
        });
      },
    });
    // 다른 뮤테이션들 추가...
  },
});

// Gender, UserStatus, UserPermissions enum 정의
export const GenderEnum = enumType({
  name: "Gender",
  members: Object.values(Gender),
});

export const UserStatusEnum = enumType({
  name: "UserStatus",
  members: Object.values(UserStatus),
});

export const UserPermissionsEnum = enumType({
  name: "UserPermissions",
  members: Object.values(UserPermissions),
});
