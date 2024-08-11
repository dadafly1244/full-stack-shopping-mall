import { objectType } from "nexus";
import {
  GenderEnum,
  UserStatusEnum,
  UserPermissionsEnum,
} from "#/graphql/types/enumType";

export const UserType = objectType({
  name: "User",
  definition(t) {
    t.nonNull.id("id");
    t.nonNull.string("user_id");
    t.nonNull.string("email");
    t.nonNull.field("gender", { type: GenderEnum });
    t.string("phone_number");
    t.nonNull.field("status", { type: UserStatusEnum });
    t.nonNull.field("permissions", { type: UserPermissionsEnum });
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
