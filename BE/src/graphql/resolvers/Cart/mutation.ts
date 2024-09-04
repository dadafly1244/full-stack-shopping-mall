import {
  nonNull,
  stringArg,
  intArg,
  booleanArg,
  extendType,
  idArg,
  list,
} from "nexus";
import { ApolloServerErrorCode } from "@apollo/server/errors";
import { GraphQLError } from "graphql";
import { ProductStatus } from "@prisma/client";
function createError(message: string, code: string) {
  return new GraphQLError(message, {
    extensions: { code: code },
  });
}
export const CartMutations = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("addToCart", {
      type: "Cart",
      args: {
        user_id: nonNull(stringArg()),
        product_id: nonNull(stringArg()),
        quantity: nonNull(intArg()),
      },
      resolve: async (_, { user_id, product_id, quantity }, ctx) => {
        if (quantity <= 0) {
          throw createError(
            "Quantity must be positive",
            ApolloServerErrorCode.BAD_USER_INPUT,
          );
        }

        const product = await ctx.prisma.product.findUnique({
          where: { id: product_id },
        });
        if (!product) {
          throw createError(
            "Product not found",
            ApolloServerErrorCode.INTERNAL_SERVER_ERROR,
          );
        }

        if (product.status !== ProductStatus.AVAILABLE) {
          throw createError(
            "Not AVAILABLE Product",
            ApolloServerErrorCode.BAD_USER_INPUT,
          );
        }
        if (product.count < quantity) {
          throw createError(
            "Not enough stock",
            ApolloServerErrorCode.BAD_USER_INPUT,
          );
        }

        const existingCart = await ctx.prisma.cart.findFirst({
          where: { user_id, product_id, order_id: null },
        });

        if (existingCart) {
          return ctx.prisma.cart.update({
            where: { id: existingCart.id },
            data: { quantity: existingCart.quantity + quantity },
          });
        }

        return ctx.prisma.cart.create({
          data: { user_id, product_id, quantity },
        });
      },
    });

    t.nonNull.field("updateCartQuantity", {
      type: "Cart",
      args: {
        id: nonNull(idArg()),
        quantity: nonNull(intArg()),
      },
      resolve: async (_, { id, quantity }, ctx) => {
        if (quantity <= 0) {
          throw createError(
            "Quantity must be positive",
            ApolloServerErrorCode.BAD_USER_INPUT,
          );
        }

        const cart = await ctx.prisma.cart.findUnique({
          where: { id },
          include: { product: true },
        });
        if (!cart) {
          throw createError(
            "Cart item not found",
            ApolloServerErrorCode.INTERNAL_SERVER_ERROR,
          );
        }

        if (cart.product.status !== ProductStatus.AVAILABLE) {
          throw createError(
            "Not AVAILABLE Product",
            ApolloServerErrorCode.BAD_USER_INPUT,
          );
        }

        if (cart.product.count < quantity) {
          throw createError(
            "Not enough stock",
            ApolloServerErrorCode.BAD_USER_INPUT,
          );
        }

        return ctx.prisma.cart.update({
          where: { id },
          data: { quantity },
        });
      },
    });

    t.nonNull.field("removeFromCart", {
      type: "Cart",
      args: {
        id: nonNull(idArg()),
      },
      resolve: async (_, { id }, ctx) => {
        const cart = await ctx.prisma.cart.findUnique({ where: { id } });
        if (!cart) {
          throw createError(
            "Cart item not found",
            ApolloServerErrorCode.INTERNAL_SERVER_ERROR,
          );
        }

        return ctx.prisma.cart.delete({
          where: { id },
        });
      },
    });

    t.nonNull.field("selectCartItems", {
      type: "Boolean",
      args: {
        ids: nonNull(list(nonNull(idArg()))),
        is_selected: nonNull(booleanArg()),
      },
      resolve: async (_, { ids, is_selected }, ctx) => {
        const updatedCount = await ctx.prisma.cart.updateMany({
          where: { id: { in: ids } },
          data: { is_selected },
        });

        if (updatedCount.count === 0) {
          throw createError(
            "No cart items found with the given ids",
            ApolloServerErrorCode.INTERNAL_SERVER_ERROR,
          );
        }

        return true;
      },
    });
  },
});
