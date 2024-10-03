import { objectType } from "nexus";

export const CartType = objectType({
  name: "Cart",
  definition(t) {
    t.nonNull.string("id");
    t.nonNull.string("user_id");
    t.nonNull.field("created_at", { type: "DateTime" });
    t.nonNull.field("updated_at", { type: "DateTime" });

    t.nonNull.list.nonNull.field("items", {
      type: "CartItem",
      resolve: (parent, _, context) => {
        return context.prisma.cart
          .findUnique({ where: { id: parent.id } })
          .items();
      },
    });

    t.field("user", {
      type: "User",
      resolve: (parent, _, context) => {
        return context.prisma.cart
          .findUnique({ where: { id: parent.id } })
          .user();
      },
    });

    t.nonNull.int("total_price", {
      resolve: async (parent, _, context) => {
        const items = await context.prisma.cartItem.findMany({
          where: { cart_id: parent.id },
          include: { product: true },
        });

        return items.reduce(
          (
            total: number,
            item: {
              quantity: number;
              product: { price: number; sale?: number };
            },
          ) => {
            const productPrice = item.product.sale
              ? item.product.sale
              : item.product.price;
            return total + item.quantity * productPrice;
          },
          0,
        );
      },
    });
  },
});

export const CartItemType = objectType({
  name: "CartItem",
  definition(t) {
    t.nonNull.string("id");
    t.nonNull.string("cart_id");
    t.nonNull.string("product_id");
    t.nonNull.int("quantity");
    t.nonNull.field("created_at", { type: "DateTime" });
    t.nonNull.field("updated_at", { type: "DateTime" });

    t.field("cart", {
      type: "Cart",
      resolve: (parent, _, context) => {
        return context.prisma.cartItem
          .findUnique({ where: { id: parent.id } })
          .cart();
      },
    });

    t.field("product", {
      type: "Product",
      resolve: (parent, _, context) => {
        return context.prisma.cartItem
          .findUnique({ where: { id: parent.id } })
          .product();
      },
    });
  },
});
