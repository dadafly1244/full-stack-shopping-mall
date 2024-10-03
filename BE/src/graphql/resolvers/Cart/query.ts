import { nonNull, stringArg, extendType, nullable } from "nexus";
import { GraphQLError } from "graphql";
import { validUser } from "#/graphql/validators";

function createError(message: string, code: string) {
  return new GraphQLError(message, {
    extensions: { code: code },
  });
}

export const CartQueries = extendType({
  type: "Query",
  definition(t) {
    t.field("getUserCart", {
      type: "Cart",
      args: {
        user_id: nullable(stringArg()),
      },
      authorize: validUser,
      resolve: async (_, args, context) => {
        const userId = args.user_id || context.user.id; // context.user.id는 현재 인증된 사용자의 ID를 가정합니다.

        if (!userId) {
          throw createError(
            "사용자 ID가 제공되지 않았습니다.",
            "BAD_USER_INPUT",
          );
        }

        const user = await context.prisma.user.findUnique({
          where: { id: userId },
        });

        if (!user) {
          throw createError("사용자를 찾을 수 없습니다.", "NOT_FOUND");
        }

        const cart = await context.prisma.cart.findUnique({
          where: { user_id: userId },
          include: {
            items: {
              include: {
                product: true,
              },
            },
          },
        });

        if (!cart) {
          // 장바구니가 없으면 빈 장바구니를 생성합니다.
          return context.prisma.cart.create({
            data: { user_id: userId },
            include: { items: { include: { product: true } } },
          });
        }

        return cart;
      },
    });
  },
});
