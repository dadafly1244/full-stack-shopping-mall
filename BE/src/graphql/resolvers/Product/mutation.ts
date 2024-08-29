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

const MAX_NAME_LENGTH = 255; // 적절한 길이로 조정
const MAX_DESC_LENGTH = 5000; // 적절한 길이로 조정

function sanitizeInput(input: string) {
  // 기본적인 HTML 태그 제거 (더 강력한 라이브러리 사용 권장)
  return input.replace(/<[^>]*>?/gm, "");
}

export const ProductMutation = extendType({
  type: "Mutation",
  definition(t) {
    // 제품 생성하는 mutation
    t.nonNull.field("createProduct", {
      type: "Product",
      args: {
        name: nonNull(stringArg()),
        desc: stringArg(),
        price: nonNull(intArg()),
        sale: intArg(),
        count: intArg(),
        is_deleted: booleanArg(),
        status: nonNull("ProductStatus"),
        main_image_path: nonNull(stringArg()),
        desc_images_path: "JSON",
        category_id: nonNull(intArg()),
        store_id: nonNull(stringArg()),
      },
      resolve: async (_, args, context) => {
        try {
          const sanitizedName = sanitizeInput(args.name);
          const sanitizedDesc = args.desc ? sanitizeInput(args.desc) : null;

          if (sanitizedName.length > MAX_NAME_LENGTH) {
            throw new GraphQLError(
              `제품명은 ${MAX_NAME_LENGTH}자를 초과할 수 없습니다.`,
              {
                extensions: {
                  code: ApolloServerErrorCode.BAD_USER_INPUT,
                  invalidArgs: ["name"],
                },
              },
            );
          }

          if (sanitizedDesc && sanitizedDesc.length > MAX_DESC_LENGTH) {
            throw new GraphQLError(
              `제품 설명은 ${MAX_DESC_LENGTH}자를 초과할 수 없습니다.`,
              {
                extensions: {
                  code: ApolloServerErrorCode.BAD_USER_INPUT,
                  invalidArgs: ["desc"],
                },
              },
            );
          }
          const store = await context.prisma.store.findUnique({
            where: { id: args.store_id },
          });

          if (!store) {
            throw new GraphQLError("판매처가 존재하지 않습니다.", {
              extensions: {
                code: ApolloServerErrorCode.BAD_USER_INPUT,
                invalidArgs: ["store_id"],
              },
            });
          }

          const category = await context.prisma.category.findUnique({
            where: { id: args.category_id },
          });

          if (!category) {
            throw new GraphQLError("Category 가 존재하지 않습니다.", {
              extensions: {
                code: ApolloServerErrorCode.BAD_USER_INPUT,
                invalidArgs: ["category_id"],
              },
            });
          }
          const existNameProductInSameStore =
            await context.prisma.product.findFirst({
              where: {
                name: args.name,
                store_id: args.store_id,
              },
            });

          if (existNameProductInSameStore) {
            //다른회사에서는 같은 이름의 상품 등록할 수 있음
            throw new GraphQLError(
              "귀사에 동일한 이름의 상품이 이미 등록되어 있습니다. 다른 이름을 사용해 주세요.",
              {
                extensions: {
                  code: ApolloServerErrorCode.BAD_USER_INPUT,
                  invalidArgs: ["name"],
                },
              },
            );
          }

          if (args.price < args?.sale) {
            throw new GraphQLError("정가보다 판매가를 낮게 입력해 주세요. ", {
              extensions: {
                code: ApolloServerErrorCode.BAD_USER_INPUT,
                invalidArgs: ["sale"],
              },
            });
          }

          const result = await context.prisma.product.create({
            data: {
              ...args,
              name: sanitizedName,
              desc: sanitizedDesc,
            },
          });
          if (!result) {
            throw new GraphQLError("제품 등록을 실패했습니다.", {
              extensions: {
                code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR,
              },
            });
          }

          return result;
        } catch (error) {
          if (error instanceof GraphQLError) {
            throw error;
          }
          throw new GraphQLError("Failed to create Product", {
            extensions: {
              code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR,
            },
          });
        }
      },
    });
    //  ProductStatus만 변경할 수 있는 mutation
    t.nonNull.field("updateProductStatus", {
      type: "Product",
      args: {
        id: nonNull(stringArg()),
        status: nonNull("ProductStatus"),
      },
      resolve: async (_, args, context) => {
        try {
          const existProduct = await context.prisma.product.findUnique({
            where: { id: args.id },
          });
          if (!existProduct) {
            throw new GraphQLError("해당 제품이 존재하지 않습니다.", {
              extensions: {
                code: ApolloServerErrorCode.BAD_USER_INPUT,
                invalidArgs: ["id"],
              },
            });
          }

          const product = await context.prisma.product.update({
            where: { id: args.id },
            data: { status: args.status },
          });
          if (!product) {
            throw new GraphQLError("제품 상태 수정 실패", {
              extensions: {
                code: ApolloServerErrorCode.BAD_USER_INPUT,
                invalidArgs: ["id", "status"],
              },
            });
          }
          return product;
        } catch (error) {
          if (error instanceof GraphQLError) {
            throw error;
          }
          throw new GraphQLError("Failed to update Product status", {
            extensions: {
              code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR,
            },
          });
        }
      },
    });
    // 제품 상태 말고 다른 정보를 수정할 수 있는 update mutation
    t.nonNull.field("updateProduct", {
      type: "Product",
      args: {
        id: nonNull(stringArg()),
        name: stringArg(),
        desc: stringArg(),
        price: intArg(),
        sale: intArg(),
        count: intArg(),
        main_image_path: stringArg(),
        desc_images_path: "JSON",
        category_id: intArg(),
      },
      resolve: async (_, args, context) => {
        try {
          const { id, ...updateData } = args;

          if (updateData.name) {
            updateData.name = sanitizeInput(updateData.name);
            if (updateData.name.length > MAX_NAME_LENGTH) {
              throw new GraphQLError(
                `제품명은 ${MAX_NAME_LENGTH}자를 초과할 수 없습니다.`,
                {
                  extensions: {
                    code: ApolloServerErrorCode.BAD_USER_INPUT,
                    invalidArgs: ["name"],
                  },
                },
              );
            }
          }

          if (updateData.desc) {
            updateData.desc = sanitizeInput(updateData.desc);
            if (updateData.desc.length > MAX_DESC_LENGTH) {
              throw new GraphQLError(
                `제품 설명은 ${MAX_DESC_LENGTH}자를 초과할 수 없습니다.`,
                {
                  extensions: {
                    code: ApolloServerErrorCode.BAD_USER_INPUT,
                    invalidArgs: ["desc"],
                  },
                },
              );
            }
          }

          const existProduct = await context.prisma.product.findUnique({
            where: { id: args.id },
          });
          if (!existProduct) {
            throw new GraphQLError("해당 제품이 존재하지 않습니다.", {
              extensions: {
                code: ApolloServerErrorCode.BAD_USER_INPUT,
                invalidArgs: ["id"],
              },
            });
          }

          // 기존 제품을 조회, store_id를 얻기
          const existingProduct = await context.prisma.product.findUnique({
            where: { id },
            select: { store_id: true, name: true },
          });

          if (!existingProduct) {
            throw new GraphQLError("제품이 존재하지 않습니다.", {
              extensions: {
                code: ApolloServerErrorCode.BAD_USER_INPUT,
              },
            });
          }

          // 이름이 변경되었고, 같은 상점 내에 동일한 이름의 제품이 있는지 확인
          if (updateData.name && updateData.name !== existingProduct.name) {
            const existingNameProduct = await context.prisma.product.findFirst({
              where: {
                name: updateData.name,
                store_id: existingProduct.store_id,
                id: { not: id }, // 현재 수정 중인 제품은 제외
              },
            });

            if (existingNameProduct) {
              throw new GraphQLError(
                "귀사에 동일한 이름의 상품이 이미 등록되어 있습니다. 다른 이름을 사용해 주세요.",
                {
                  extensions: {
                    code: ApolloServerErrorCode.BAD_USER_INPUT,
                    invalidArgs: ["name"],
                  },
                },
              );
            }
          }

          // 제품 업데이트
          const updatedProduct = await context.prisma.product.update({
            where: { id },
            data: {
              ...updateData,
              category_id: Number(updateData.category_id),
            },
          });

          if (!updatedProduct) {
            throw new GraphQLError("제품 정보 수정을 실패했습니다. ", {
              extensions: {
                code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR,
              },
            });
          }
          return updatedProduct;
        } catch (error) {
          if (error instanceof GraphQLError) {
            throw error;
          }
          throw new GraphQLError("Failed to update Product", {
            extensions: {
              code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR,
            },
          });
        }
      },
    });

    // 삭제하는 mutation
    t.nonNull.field("deleteProductIfUnused", {
      type: "Product",
      args: {
        id: nonNull(stringArg()),
      },
      resolve: async (_, args, context) => {
        try {
          const existProduct = await context.prisma.product.findUnique({
            where: { id: args.id },
          });
          if (!existProduct) {
            throw new GraphQLError("삭제할 제품이 없습니다.", {
              extensions: {
                code: ApolloServerErrorCode.BAD_USER_INPUT,
                invalidArgs: ["id"],
              },
            });
          }

          // 주문 이력 확인
          // TODO: order table 만들고 난다음에 주석 해제하기(test 필요)
          // const orderHistory = await context.prisma.order.findFirst({
          //   where: {
          //     products: {
          //       some: {
          //         id: args.id,
          //       },
          //     },
          //   },
          // });

          const orderHistory = undefined;

          if (orderHistory) {
            // 주문 이력이 있으면 is_deleted만 true로 변경
            const result = await context.prisma.product.update({
              where: { id: args.id },
              data: { is_deleted: true },
            });
            if (!result) {
              throw new GraphQLError("is_deleted: true로 변경 실패", {
                extensions: {
                  code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR,
                },
              });
            }
            return result;
          } else {
            // 주문 이력이 없으면 삭제

            const result = await context.prisma.product.delete({
              where: { id: args.id },
            });
            if (!result) {
              throw new GraphQLError("진짜로 삭제 실패", {
                extensions: {
                  code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR,
                },
              });
            }
            return result;
          }
        } catch (error) {
          if (error instanceof GraphQLError) {
            throw error;
          }
          throw new GraphQLError("Failed to delete Product", {
            extensions: {
              code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR,
            },
          });
        }
      },
    });
    /**
     *
     * order 구현시  더 구현이 필요한 부분
     * 1. count 변화시키는 mutation 만들기.
     * 2. order에서 mutation 동작 시키기.
     * 3. 구매, 반품, 환불, 매출 등을 자동으로 관리하도록 !!!
     * 4. 동시에 들어오면 어떻게 처리할지 고민해보기(시간관계상 넘어가기.. )
     *
     */
  },
});
