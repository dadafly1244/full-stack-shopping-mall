import { nonNull, stringArg, intArg, extendType, idArg } from "nexus";
import { ApolloServerErrorCode } from "@apollo/server/errors";
import { GraphQLError } from "graphql";
import { CartItem, ProductStatus } from "@prisma/client";
import { isAuthenticated, validUser } from "#/graphql/validators";

function createError(message: string, code: string) {
  return new GraphQLError(message, {
    extensions: { code: code },
  });
}

export const AuthenticatedCartMutations = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("addToCart", {
      type: "Cart",
      args: {
        user_id: nonNull(stringArg()),
        product_id: nonNull(stringArg()),
        quantity: nonNull(intArg()),
      },
      authorize: validUser,
      resolve: async (_, { user_id, product_id, quantity }, ctx) => {
        if (quantity <= 0) {
          throw createError(
            "수량은 양수여야 합니다",
            ApolloServerErrorCode.BAD_USER_INPUT,
          );
        }

        const product = await ctx.prisma.product.findUnique({
          where: { id: product_id },
        });
        if (!product) {
          throw createError(
            "제품을 찾을 수 없습니다",
            ApolloServerErrorCode.INTERNAL_SERVER_ERROR,
          );
        }

        if (product.status !== ProductStatus.AVAILABLE) {
          throw createError(
            "현재 구매 불가능한 제품입니다",
            ApolloServerErrorCode.BAD_USER_INPUT,
          );
        }
        if (product.count < quantity) {
          throw createError(
            "재고가 부족합니다",
            ApolloServerErrorCode.BAD_USER_INPUT,
          );
        }

        // Find or create cart
        let cart = await ctx.prisma.cart.findUnique({
          where: { user_id },
          include: { items: true },
        });

        if (!cart) {
          cart = await ctx.prisma.cart.create({
            data: {
              user_id,
              items: {
                create: {
                  product_id,
                  quantity,
                },
              },
            },
            include: { items: true },
          });
        } else {
          const existingCartItem = cart.items.find(
            (item: CartItem) => item.product_id === product_id,
          );

          if (existingCartItem) {
            await ctx.prisma.cartItem.update({
              where: { id: existingCartItem.id },
              data: { quantity },
            });
          } else {
            await ctx.prisma.cartItem.create({
              data: {
                cart_id: cart.id,
                product_id,
                quantity,
              },
            });
          }

          // Fetch the updated cart
          cart = await ctx.prisma.cart.findUnique({
            where: { id: cart.id },
            include: { items: true },
          });
        }

        return cart;
      },
    });

    t.nonNull.field("updateCartItemQuantity", {
      type: "CartItem",
      args: {
        cart_item_id: nonNull(idArg()),
        quantity: nonNull(intArg()),
      },
      authorize: isAuthenticated,
      resolve: async (_, { cart_item_id, quantity }, ctx) => {
        if (quantity <= 0) {
          throw createError(
            "수량은 양수여야 합니다",
            ApolloServerErrorCode.BAD_USER_INPUT,
          );
        }

        const cartItem = await ctx.prisma.cartItem.findUnique({
          where: { id: cart_item_id },
          include: { product: true },
        });
        if (!cartItem) {
          throw createError(
            "장바구니 항목을 찾을 수 없습니다",
            ApolloServerErrorCode.INTERNAL_SERVER_ERROR,
          );
        }

        if (cartItem.product.status !== ProductStatus.AVAILABLE) {
          throw createError(
            "현재 구매 불가능한 제품입니다",
            ApolloServerErrorCode.BAD_USER_INPUT,
          );
        }

        if (cartItem.product.count < quantity) {
          throw createError(
            "재고가 부족합니다",
            ApolloServerErrorCode.BAD_USER_INPUT,
          );
        }

        return ctx.prisma.cartItem.update({
          where: { id: cart_item_id },
          data: { quantity },
        });
      },
    });

    t.nonNull.field("removeFromCart", {
      type: "CartItem",
      args: {
        cart_item_id: nonNull(idArg()),
      },
      authorize: isAuthenticated,
      resolve: async (_, { cart_item_id }, ctx) => {
        const cartItem = await ctx.prisma.cartItem.findUnique({
          where: { id: cart_item_id },
          include: { cart: true },
        });
        if (!cartItem) {
          throw createError(
            "장바구니 항목을 찾을 수 없습니다",
            ApolloServerErrorCode.INTERNAL_SERVER_ERROR,
          );
        }

        return ctx.prisma.cartItem.delete({
          where: { id: cart_item_id },
        });
      },
    });
  },
});
