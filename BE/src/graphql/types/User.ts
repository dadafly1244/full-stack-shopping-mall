import { objectType } from "nexus";

export const UserType = objectType({
  name: "User",
  definition(t) {
    t.nonNull.id("id");
    t.nonNull.string("user_id");
    t.nonNull.string("name");
    t.nonNull.string("email");
    t.nonNull.string("password");
    t.nonNull.field("gender", { type: "Gender" });
    t.string("phone_number");
    t.nonNull.field("status", { type: "UserStatus" });
    t.nonNull.field("permissions", { type: "UserPermissions" });
    t.nonNull.field("created_at", { type: "DateTime" });
    t.nonNull.field("updated_at", { type: "DateTime" });

    t.list.nonNull.field("carts", {
      type: "Cart",
      resolve: (parent, _, context) => {
        return context.prisma.user
          .findUnique({ where: { id: parent.id } })
          .carts();
      },
    });
    t.list.nonNull.field("reviews", {
      type: "Review",
      resolve: (parent, _, context) => {
        return context.prisma.user
          .findUnique({ where: { id: parent.id } })
          .reviews();
      },
    });
    t.list.nonNull.field("orders", {
      type: "Order",
      resolve: (parent, _, context) => {
        return context.prisma.user
          .findUnique({ where: { id: parent.id } })
          .orders();
      },
    });
  },
});

export const AuthPayloadType = objectType({
  name: "AuthPayload",
  definition(t) {
    t.nullable.string("token");
    t.nullable.string("refresh_token");
    t.nonNull.field("user", {
      type: "User",
    });
  },
});
