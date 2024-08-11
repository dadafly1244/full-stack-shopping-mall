import { objectType } from "nexus";

export const CartType = objectType({
  name: "Cart",
  definition(t) {
    t.nonNull.string("id");
    t.nonNull.string("product_id");
    t.nonNull.string("user_id");
    t.nonNull.int("count");
    t.nonNull.field("created_at", { type: "DateTime" });
    t.nonNull.field("updated_at", { type: "DateTime" });
    t.nonNull.boolean("is_ordered");

    t.nonNull.field("product", {
      type: "Product",
      resolve: (parent, _, context) => {
        return context.prisma.cart
          .findUnique({ where: { id: parent.id } })
          .product();
      },
    });

    t.nonNull.list.nonNull.field("orders", {
      type: "Order",
      resolve: (parent, _, context) => {
        return context.prisma.cart
          .findUnique({ where: { id: parent.id } })
          .orders();
      },
    });
  },
});
