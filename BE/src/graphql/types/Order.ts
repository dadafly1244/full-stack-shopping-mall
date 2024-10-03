import { objectType } from "nexus";

export const OrderType = objectType({
  name: "Order",
  definition(t) {
    t.nonNull.string("id");
    t.nonNull.string("user_id");
    t.nonNull.field("status", { type: "OrderStatus" });
    t.string("address");
    t.nonNull.boolean("is_deleted");
    t.nonNull.int("total_price");
    t.nonNull.field("created_at", { type: "DateTime" });
    t.nonNull.field("updated_at", { type: "DateTime" });
    t.string("cart_id");

    t.nonNull.field("user", {
      type: "User",
      resolve: (parent, _, context) => {
        return context.prisma.order
          .findUnique({ where: { id: parent.id } })
          .user();
      },
    });

    t.nonNull.list.nonNull.field("order_details", {
      type: "OrderDetail",
      resolve: (parent, _, context) => {
        return context.prisma.order
          .findUnique({ where: { id: parent.id } })
          .order_details();
      },
    });

    t.field("cart", {
      type: "Cart",
      resolve: (parent, _, context) => {
        if (!parent.cart_id) return null;
        return context.prisma.cart.findUnique({
          where: { id: parent.cart_id },
        });
      },
    });
  },
});

export const OrderDetailType = objectType({
  name: "OrderDetail",
  definition(t) {
    t.nonNull.int("id");
    t.nonNull.string("order_id");
    t.nonNull.string("product_id");
    t.nonNull.int("quantity");
    t.nonNull.int("price_at_order");
    t.nonNull.field("order", {
      type: "Order",
      resolve: (parent, _, context) => {
        return context.prisma.orderDetail
          .findUnique({ where: { id: parent.id } })
          .order();
      },
    });
    t.nonNull.field("product", {
      type: "Product",
      resolve: (parent, _, context) => {
        return context.prisma.orderDetail
          .findUnique({ where: { id: parent.id } })
          .product();
      },
    });
  },
});

export const PaginatedOrdersResult = objectType({
  name: "PaginatedOrdersResult",
  definition(t) {
    t.nonNull.list.nonNull.field("orders", { type: "Order" });
    t.nonNull.field("pageInfo", { type: "PageInfo" });
  },
});
