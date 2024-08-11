import { objectType } from "nexus";
import { OrderStatusEnum } from "#/graphql/types/enumType";

export const OrderType = objectType({
  name: "Order",
  definition(t) {
    t.nonNull.string("id");
    t.nonNull.string("user_id");
    t.nonNull.field("status", { type: OrderStatusEnum });
    t.string("address");
    t.string("is_deleted");
    t.nonNull.int("price_at_order");
    t.nonNull.field("created_at", { type: "DateTime" });
    t.nonNull.field("updated_at", { type: "DateTime" });

    // 관계 필드
    t.nonNull.field("user", {
      type: "User",
      resolve: (parent, _, context) => {
        return context.prisma.order
          .findUnique({ where: { id: parent.id } })
          .users();
      },
    });

    t.nonNull.list.nonNull.field("carts", {
      type: "Cart",
      resolve: (parent, _, context) => {
        return context.prisma.order
          .findUnique({ where: { id: parent.id } })
          .carts();
      },
    });
  },
});
