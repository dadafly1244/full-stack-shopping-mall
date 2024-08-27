import { extendType, nonNull, stringArg, intArg } from "nexus";
import { ApolloServerErrorCode } from "@apollo/server/errors";
import { GraphQLError } from "graphql";
import { PrismaClient } from "@prisma/client";

export const CategoryMutation = extendType({
  type: "Mutation",
  definition(t) {
    // 카테고리 생성. 깊이는 3까지 허용
    t.nonNull.field("createCategory", {
      type: "Category",
      args: {
        name: nonNull(stringArg()),
        parentId: intArg(),
      },
      resolve: async (_, { name, parentId }, context) => {
        // 같은 이름의 카테고리가 이미 존재하는지 확인
        const existingCategory = await context.prisma.category.findUnique({
          where: { name },
        });

        if (existingCategory) {
          throw new GraphQLError("Category with this name already exists", {
            extensions: {
              code: ApolloServerErrorCode.BAD_USER_INPUT,
              invalidArgs: ["name"],
            },
          });
        }

        // 부모 카테고리 ID가 제공된 경우, 해당 카테고리가 존재하는지 확인하고 깊이를 체크
        if (parentId) {
          const parentCategory = await context.prisma.category.findUnique({
            where: { id: parentId },
            include: { parent: { include: { parent: true } } },
          });

          if (!parentCategory) {
            throw new GraphQLError("Parent category not found", {
              extensions: {
                code: ApolloServerErrorCode.BAD_USER_INPUT,
                invalidArgs: ["parentId"],
              },
            });
          }

          // 깊이 체크
          let depth = 1;
          let currentParent = parentCategory.parent;
          while (currentParent) {
            depth++;
            currentParent = currentParent.parent;
          }

          if (depth >= 3) {
            throw new GraphQLError("Maximum category depth (3) exceeded", {
              extensions: {
                code: ApolloServerErrorCode.BAD_USER_INPUT,
                invalidArgs: ["parentId"],
              },
            });
          }
        }

        // 새 카테고리 생성
        return context.prisma.category.create({
          data: {
            name,
            category_parent_id: parentId || null,
          },
        });
      },
    });
    // 같은 깊이의 카테고리 합치기
    t.nonNull.field("mergeCategories", {
      type: "Category",
      args: {
        categoryId1: nonNull(intArg()),
        categoryId2: nonNull(intArg()),
        newName: nonNull(stringArg()),
      },
      resolve: async (_, { categoryId1, categoryId2, newName }, context) => {
        // 두 카테고리를 가져옵니다
        const [category1, category2] = await Promise.all([
          context.prisma.category.findUnique({
            where: { id: categoryId1 },
            include: { parent: true, subcategories: true },
          }),
          context.prisma.category.findUnique({
            where: { id: categoryId2 },
            include: { parent: true, subcategories: true },
          }),
        ]);

        if (!newName.trim()) {
          throw new GraphQLError("이름을 입력해 주세요.", {
            extensions: {
              code: ApolloServerErrorCode.BAD_USER_INPUT,
              invalidArgs: ["newName"],
            },
          });
        }
        // 카테고리가 존재하는지 확인
        if (!category1 || !category2) {
          throw new GraphQLError("One or both categories not found", {
            extensions: {
              code: ApolloServerErrorCode.BAD_USER_INPUT,
              invalidArgs: ["categoryId1", "categoryId2"],
            },
          });
        }

        // 두 카테고리가 같은 깊이에 있는지 확인
        if (category1.parent?.id !== category2.parent?.id) {
          throw new GraphQLError("Categories must be at the same depth", {
            extensions: {
              code: ApolloServerErrorCode.BAD_USER_INPUT,
              invalidArgs: ["categoryId1", "categoryId2"],
            },
          });
        }

        // 트랜잭션을 사용하여 카테고리 병합
        return await context.prisma.$transaction(
          async (prisma: PrismaClient) => {
            // 새 카테고리 생성
            const mergedCategory = await prisma.category.create({
              data: {
                name: newName,
                category_parent_id: category1.parent?.id || null,
              },
            });

            // 하위 카테고리 이동
            await prisma.category.updateMany({
              where: {
                OR: [
                  { category_parent_id: category1.id },
                  { category_parent_id: category2.id },
                ],
              },
              data: {
                category_parent_id: mergedCategory.id,
              },
            });

            // 원래 카테고리 삭제
            await prisma.category.deleteMany({
              where: {
                id: { in: [category1.id, category2.id] },
              },
            });

            // 병합된 카테고리 반환
            return prisma.category.findUnique({
              where: { id: mergedCategory.id },
              include: { subcategories: true },
            });
          },
        );
      },
    });
    // 카테고리 이름 변경
    t.nonNull.field("renameCategory", {
      type: "Category",
      args: {
        categoryId: nonNull(intArg()),
        newName: nonNull(stringArg()),
      },
      resolve: async (_, { categoryId, newName }, context) => {
        // 카테고리가 존재하는지 확인
        const existingCategory = await context.prisma.category.findUnique({
          where: { id: categoryId },
        });

        if (!existingCategory) {
          throw new GraphQLError("Category not found", {
            extensions: {
              code: ApolloServerErrorCode.BAD_USER_INPUT,
              invalidArgs: ["categoryId"],
            },
          });
        }

        // 새 이름이 이미 사용 중인지 확인
        const categoryWithNewName = await context.prisma.category.findUnique({
          where: { name: newName },
        });

        if (categoryWithNewName) {
          throw new GraphQLError("A category with this name already exists", {
            extensions: {
              code: ApolloServerErrorCode.BAD_USER_INPUT,
              invalidArgs: ["newName"],
            },
          });
        }

        if (!newName.trim()) {
          throw new GraphQLError("이름을 입력해 주세요.", {
            extensions: {
              code: ApolloServerErrorCode.BAD_USER_INPUT,
              invalidArgs: ["newName"],
            },
          });
        }

        // 카테고리 이름 업데이트
        const updatedCategory = await context.prisma.category.update({
          where: { id: categoryId },
          data: { name: newName },
          include: { subcategories: true, products: true },
        });

        return updatedCategory;
      },
    });
  },
});
