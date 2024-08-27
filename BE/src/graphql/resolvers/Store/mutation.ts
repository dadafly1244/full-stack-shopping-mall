import {
  objectType,
  extendType,
  nonNull,
  stringArg,
  enumType,
  list,
  inputObjectType,
} from "nexus";
import { ApolloServerErrorCode } from "@apollo/server/errors";
import { GraphQLError } from "graphql";

export const StoreMutation = extendType({
  type: "Mutation",
  definition(t) {
    // Store 생성
    t.field("createStore", {
      type: "Store",
      args: {
        business_registration_number: nonNull(stringArg()),
        name: nonNull(stringArg()),
        desc: stringArg(),
      },
      resolve: async (_, { business_registration_number, name, desc }, ctx) => {
        try {
          const existingStore = await ctx.prisma.store.findFirst({
            where: {
              OR: [{ business_registration_number }, { name }],
            },
          });

          if (existingStore) {
            throw new GraphQLError(
              "Store with this business registration number or name already exists",
              {
                extensions: {
                  code: ApolloServerErrorCode.BAD_USER_INPUT,
                  invalidArgs:
                    existingStore.business_registration_number ===
                    business_registration_number
                      ? "business_registration_number"
                      : "name",
                },
              },
            );
          }
          return await ctx.prisma.store.create({
            data: {
              business_registration_number,
              name,
              desc,
            },
          });
        } catch (error) {
          if (error instanceof GraphQLError) {
            throw error;
          }
          throw new GraphQLError("Failed to create store", {
            extensions: {
              code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR,
            },
          });
        }
      },
    });

    // Store 수정
    t.field("updateStore", {
      type: "Store",
      args: {
        id: nonNull(stringArg()),
        business_registration_number: stringArg(),
        name: stringArg(),
        desc: stringArg(),
      },
      resolve: async (_, args, ctx) => {
        try {
          const updateData = {
            business_registration_number: "",
            name: "",
            desc: "",
          };

          if (args.business_registration_number !== "") {
            updateData.business_registration_number =
              args.business_registration_number;
          }

          if (args.name !== "") {
            updateData.name = args.name;
          }

          if (!updateData.name && !updateData.business_registration_number) {
            throw new GraphQLError("변경할 정보를 입력해 주세요.", {
              extensions: {
                code: ApolloServerErrorCode.BAD_USER_INPUT,
                http: { status: 422 },
                invalidArgs: [
                  updateData.name && "name",
                  updateData.business_registration_number &&
                    "business_registration_number",
                ],
              },
            });
          }
          if (args.desc != "") {
            updateData.desc = args.desc;
          }
          const store = await ctx.prisma.store.findFirst({
            where: { id: args.id },
          });

          if (!store) {
            throw new GraphQLError("Store not found", {
              extensions: {
                code: ApolloServerErrorCode.BAD_USER_INPUT,
                http: { status: 404 },
                invalidArgs: ["id"],
              },
            });
          }

          if (updateData?.business_registration_number) {
            const numberStore = await ctx.prisma.store.findFirst({
              where: {
                business_registration_number:
                  updateData?.business_registration_number,
              },
            });
            if (numberStore) {
              throw new GraphQLError(
                "해당 비즈니스 번호를 가진 Store가 존재합니다.",
                {
                  extensions: {
                    code: ApolloServerErrorCode.BAD_USER_INPUT,
                    http: { status: 409 },
                    invalidArgs: ["business_registration_number"],
                  },
                },
              );
            }
          }

          const updatedStore = await ctx.prisma.store.update({
            where: { id: args.id },
            data: updateData,
          });

          if (!updatedStore) {
            throw new GraphQLError("업데이트를 실패했습니다.", {
              extensions: {
                code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR,
                http: { status: 500 },
              },
            });
          }
          return updatedStore;
        } catch (error) {
          console.log(error);
          if (error instanceof GraphQLError) {
            throw error;
          }
          throw new GraphQLError("서버에러: 알 수 없는 에러입니다.", {
            extensions: {
              code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR,
              http: { status: 500 },
            },
          });
        }
      },
    });

    // Store 삭제
    t.field("deleteStore", {
      type: "Store",
      args: { id: nonNull(stringArg()) },
      resolve: async (_, { id }, ctx) => {
        try {
          // 먼저 해당 상점과 연관된 제품이 있는지 확인
          const storeWithProducts = await ctx.prisma.store.findUnique({
            where: { id },
            include: { products: { select: { id: true }, take: 1 } }, // 성능을 위해서 1개만 확인
          });

          if (!storeWithProducts) {
            throw new GraphQLError("Store not found", {
              extensions: {
                code: "NOT_FOUND",
                http: { status: 404 },
              },
            });
          }

          if (storeWithProducts.products.length > 0) {
            throw new GraphQLError(
              "Cannot delete store with associated products",
              {
                extensions: {
                  code: "CONSTRAINT_VIOLATION",
                  http: { status: 400 },
                },
              },
            );
            // fe에서는 사용자에게 먼저 제품을 삭제하라는 메시지를 표시
          }

          // 연관된 제품이 없으면 상점 삭제
          const deletedStore = await ctx.prisma.store.delete({ where: { id } });
          return deletedStore;
        } catch (error) {
          if (error instanceof GraphQLError) {
            throw error;
          }

          throw new GraphQLError(
            "Business registration number already exists",
            {
              extensions: {
                code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR,
                http: { status: 500 },
              },
            },
          );
        }
      },
    });
  },
});
