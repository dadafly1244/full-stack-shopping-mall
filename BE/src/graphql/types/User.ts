import { objectType, extendType, nonNull, stringArg, enumType } from "nexus";

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
