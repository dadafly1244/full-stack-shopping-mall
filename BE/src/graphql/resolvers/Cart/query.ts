import {
  nonNull,
  stringArg,
  intArg,
  booleanArg,
  extendType,
  idArg,
} from "nexus";
import { ApolloServerErrorCode } from "@apollo/server/errors";
import { GraphQLError } from "graphql";
import { Cart } from "@prisma/client";
function createError(message: string, code: string) {
  return new GraphQLError(message, {
    extensions: { code: code },
  });
}
export const CartQueries = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.list.nonNull.field("getCarts", {
      type: "Cart",
      args: {
        user_id: nonNull(stringArg()),
      },
      resolve: async (_, { user_id }, ctx) => {
        const carts = await ctx.prisma.cart.findMany({
          where: { user_id, order_id: null },
          include: { product: true },
        });

        if (carts.length === 0) {
          throw createError(
            "No items in cart",
            ApolloServerErrorCode.INTERNAL_SERVER_ERROR,
          );
        }

        return carts;
      },
    });

    // Add a new query to get the total price of the cart
    t.nonNull.int("getCartTotalPrice", {
      args: {
        user_id: nonNull(stringArg()),
      },
      resolve: async (_, { user_id }, ctx) => {
        const carts = await ctx.prisma.cart.findMany({
          where: { user_id, order_id: null, is_selected: true },
          include: { product: true },
        });

        return carts.reduce(
          (
            total: number,
            cart: {
              quantity: number;
              product: { sale: number | null; price: number };
            },
          ) => {
            const price = cart.product.sale ?? cart.product.price;
            return total + cart.quantity * price;
          },
          0,
        );
      },
    });
  },
});
