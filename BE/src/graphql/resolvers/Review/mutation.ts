import {
  extendType,
  nonNull,
  stringArg,
  floatArg,
  arg,
  idArg,
  booleanArg,
  nullable,
} from "nexus";
import { GraphQLError } from "graphql";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import path from "path";
import { pipeline } from "stream/promises";
import { AuthTokenPayload } from "#/utils/auth";
import { validUser, isAdmin } from "#/graphql/validators";
const MAX_NAME_LENGTH = 255;
const MAX_DESC_LENGTH = 5000;
const UPLOAD_DIR =
  process.env.UPLOAD_DIR || path.join(process.cwd(), "uploads");

const sanitizeInput = (input: string) => {
  return input.replace(/<[^>]*>?/gm, "");
};

const saveFile = async (file: any, folder: string): Promise<string> => {
  const { createReadStream, filename } = await file;
  const uniqueFilename = `${uuidv4()}-${filename.replaceAll(" ", "_")}`;
  const uploadPath = path.join(UPLOAD_DIR, folder);

  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
  }

  const filePath = path.join(uploadPath, uniqueFilename);

  await pipeline(createReadStream(), fs.createWriteStream(filePath));

  return `/${folder}/${uniqueFilename}`;
};

export const ReviewMutation = extendType({
  type: "Mutation",
  definition(t) {
    // 댓글작성
    t.field("createReview", {
      type: "Review",
      args: {
        title: nonNull(stringArg()),
        desc: stringArg(),
        score: nonNull(floatArg()),
        images_path: nullable("Upload"),
        product_id: nonNull(stringArg()),
        parent_review_id: nullable(stringArg()),
        user_id: nonNull(stringArg()),
      },
      authorize: validUser,
      resolve: async (_, args, context) => {
        const { title, desc, score, images_path, product_id, user_id } = args;

        try {
          const adminCheck = await isAdmin(_, args, context);

          // 대댓글 작성 시도 확인 (관리자가 아닌 경우)
          if (args?.parent_review_id && !adminCheck) {
            throw new GraphQLError("답글은 관리자 권한이 필요합니다.", {
              extensions: { code: "FORBIDDEN" },
            });
          }

          // 사용자 정보 조회
          const user = await context.prisma.user.findUnique({
            where: { id: user_id },
          });

          if (!user) {
            throw new GraphQLError("User not found", {
              extensions: { code: "NOT_FOUND" },
            });
          }

          // 사용자 상태 확인
          if (user.status !== "ACTIVE") {
            throw new GraphQLError("User account is not active", {
              extensions: { code: "FORBIDDEN" },
            });
          }
          // Save main image
          const image = await saveFile(
            args.images_path?.file,
            "product_images",
          );

          //TODO: 사용자가 실제로 이 상품을 주문한 이력이 있는지 확인하기하고 있으면 통과, 없으면 에러

          const newReview = await context.prisma.review.create({
            data: {
              title,
              desc,
              score,
              images_path: image,
              is_deleted: false,
              user: { connect: { id: user.id } },
              product: { connect: { id: product_id } },
              parentReview: args.parent_review_id
                ? { connect: { id: args.parent_review_id } }
                : undefined, // 관리자의 경우 대댓글 허용
            },
          });

          return newReview;
        } catch (error) {
          console.error("Error creating review:", error);
          if (error instanceof GraphQLError) {
            throw error;
          }
          throw new GraphQLError("Failed to create review", {
            extensions: { code: "INTERNAL_SERVER_ERROR" },
          });
        }
      },
    });
    t.field("updateReview", {
      type: "Review",
      args: {
        id: nonNull(idArg()),
        title: stringArg(),
        desc: stringArg(),
        score: floatArg(),
        images_path: nullable("Upload"),
        user_id: nonNull(stringArg()),
      },
      authorize: async (_, args, context) => {
        return await validUser(_, args, context);
      },
      resolve: async (_, args, context) => {
        const { id, title, desc, score, images_path, user_id } = args;

        try {
          // 리뷰 조회
          const existingReview = await context.prisma.review.findUnique({
            where: { id },
            include: { user: true },
          });

          if (!existingReview) {
            throw new GraphQLError("Review not found", {
              extensions: { code: "NOT_FOUND" },
            });
          }

          console.log(existingReview.user.id, user_id);

          // 권한 확인: 리뷰 작성자만 수정 가능
          if (existingReview.user.id !== user_id) {
            throw new GraphQLError(
              "You don't have permission to update this review",
              {
                extensions: { code: "FORBIDDEN" },
              },
            );
          }

          // 업데이트할 데이터 준비
          const updateData: any = {};
          if (title !== undefined) updateData.title = title;
          if (desc !== undefined) updateData.desc = desc;
          if (score !== undefined) updateData.score = score;
          if (images_path !== undefined) {
            const images_path = await saveFile(
              args.images_path?.file,
              "product_images",
            );
            updateData.images_path = images_path;
          }

          // 리뷰 업데이트
          const updatedReview = await context.prisma.review.update({
            where: { id },
            data: updateData,
          });

          return updatedReview;
        } catch (error) {
          console.error("Error updating review:", error);
          if (error instanceof GraphQLError) {
            throw error;
          }
          throw new GraphQLError("Failed to update review", {
            extensions: { code: "INTERNAL_SERVER_ERROR" },
          });
        }
      },
    });
    t.field("adminManageReviewRealDelete", {
      type: "Review",
      args: {
        id: nonNull(idArg()),
        is_deleted: nonNull(booleanArg()),
      },
      authorize: async (_, __, context) => {
        return await isAdmin(_, __, context);
      },
      resolve: async (_, args, context) => {
        const { id, is_deleted } = args;

        try {
          // 리뷰 존재 여부 확인
          const existingReview = await context.prisma.review.findUnique({
            where: { id },
          });

          if (!existingReview) {
            throw new GraphQLError("Review not found", {
              extensions: { code: "NOT_FOUND" },
            });
          }

          // is_deleted 상태 업데이트
          const updatedReview = await context.prisma.review.update({
            where: { id },
            data: { is_deleted },
          });

          // is_deleted가 true인 경우 실제로 리뷰 삭제
          if (is_deleted) {
            await context.prisma.review.delete({
              where: { id },
            });
            return { ...updatedReview, id, is_deleted: true };
          }

          return updatedReview;
        } catch (error) {
          console.error("Error managing review:", error);
          if (error instanceof GraphQLError) {
            throw error;
          }
          throw new GraphQLError("Failed to manage review", {
            extensions: { code: "INTERNAL_SERVER_ERROR" },
          });
        }
      },
    });
    t.field("adminManageReviewSoftDelete", {
      type: "Review",
      args: {
        id: nonNull(idArg()),
        is_deleted: nonNull(booleanArg()),
      },
      authorize: async (_, __, context) => {
        return await isAdmin(_, __, context);
      },
      resolve: async (_, args, context) => {
        const { id, is_deleted } = args;

        try {
          // 리뷰 존재 여부 확인
          const existingReview = await context.prisma.review.findUnique({
            where: { id },
          });

          if (!existingReview) {
            throw new GraphQLError("Review not found", {
              extensions: { code: "NOT_FOUND" },
            });
          }

          // is_deleted 상태 업데이트
          const updatedReview = await context.prisma.review.update({
            where: { id },
            data: { is_deleted },
          });

          return updatedReview;
        } catch (error) {
          console.error("Error managing review:", error);
          if (error instanceof GraphQLError) {
            throw error;
          }
          throw new GraphQLError("Failed to manage review", {
            extensions: { code: "INTERNAL_SERVER_ERROR" },
          });
        }
      },
    });
  },
});
