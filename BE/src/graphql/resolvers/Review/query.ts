import {
  extendType,
  nonNull,
  stringArg,
  intArg,
  booleanArg,
  list,
  objectType,
} from "nexus";
import { GraphQLError } from "graphql";
import { ApolloServerErrorCode } from "@apollo/server/errors";

export const ReviewsQuery = extendType({
  type: "Query",
  definition(t) {
    t.field("paginatedReviews", {
      type: "ReviewConnection",
      args: {
        page: nonNull(intArg({ default: 1 })),
        pageSize: nonNull(intArg({ default: 5 })),
        productId: nonNull(stringArg()),
        isDeleted: booleanArg(),
      },
      resolve: async (_, args, context) => {
        try {
          const { page, pageSize, productId, isDeleted } = args;

          // 페이지 크기 제한
          const limit = Math.min(pageSize, 20);
          const skip = (page - 1) * limit;

          // 조회 조건
          const where: any = {
            product_id: productId,
            is_deleted: isDeleted,
            parent_review_id: null,
          };

          // 총 리뷰 수 조회
          const totalCount = await context.prisma.review.count({ where });
          if (totalCount < 0 || totalCount === undefined) {
            throw new GraphQLError("총 제품 수를 계산하지 못했습니다.", {
              extensions: {
                code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR,
              },
            });
          }
          // 리뷰 조회
          const reviews = await context.prisma.review.findMany({
            skip,
            take: limit,
            where,
            orderBy: { created_at: "desc" },
            // include: { user: true, product: true },
          });

          if (!reviews) {
            throw new GraphQLError("상품에 대한 리뷰를 찾지 못했습니다.", {
              extensions: {
                code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR,
              },
            });
          }

          // 총 페이지 수 계산
          const totalPages = Math.ceil(totalCount / limit);

          return {
            reviews,
            pageInfo: {
              currentPage: page,
              pageSize: limit,
              totalCount,
              totalPages,
            },
          };
        } catch (error) {
          if (error instanceof GraphQLError) {
            throw error;
          }
          throw new GraphQLError("Failed to fetch all Products", {
            extensions: {
              code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR,
            },
          });
        }
      },
    });
  },
});
