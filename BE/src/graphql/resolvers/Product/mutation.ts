import {
  nonNull,
  nullable,
  stringArg,
  intArg,
  booleanArg,
  extendType,
  idArg,
  list,
} from "nexus";
import { ApolloServerErrorCode } from "@apollo/server/errors";
import { GraphQLError } from "graphql";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import path from "path";
import { pipeline } from "stream/promises";

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
        main_image_path: nonNull("Upload"),
        desc_images_path: nullable(list(nonNull("Upload"))),
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

          // Save main image
          const main_image_path = await saveFile(
            args.main_image_path?.file,
            "product_images",
          );

          // Save description images
          const desc_images_path = [];
          if (args.desc_images_path) {
            for (const image of args.desc_images_path) {
              const imagePath = await saveFile(
                image?.file,
                "product_desc_images",
              );
              desc_images_path.push(imagePath);
            }
          }

          const result = await context.prisma.product.create({
            data: {
              ...args,
              name: sanitizedName,
              desc: sanitizedDesc,
              main_image_path,
              desc_images_path: JSON.stringify(desc_images_path),
            },
          });
          if (!result) {
            throw new GraphQLError("제품 등록을 실패했습니다.", {
              extensions: {
                code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR,
              },
            });
          }

          return {
            ...result,
            desc_images_path: JSON.parse(result.desc_images_path),
          };
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
          console.log({ id: args.id });
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
        main_image_path: "Upload",
        desc_images_path: list(nonNull("Upload")),
        category_id: intArg(),
      },
      resolve: async (_, args, context) => {
        try {
          const { id, main_image_path, desc_images_path, ...updateData } = args;

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

          const existCategoryId = await context.prisma.category.findUnique({
            where: { id: updateData.category_id },
          });

          if (updateData.category_id && !existCategoryId) {
            throw new GraphQLError("카테고리를 찾을 수 없습니다.", {
              extensions: {
                code: ApolloServerErrorCode.BAD_USER_INPUT,
                invalidArgs: ["name"],
              },
            });
          }
          if (updateData.name && updateData.name !== existingProduct.name) {
            // 이름이 변경되었고, 같은 상점 내에 동일한 이름의 제품이 있는지 확인
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

          if (main_image_path) {
            updateData.main_image_path = await saveFile(
              main_image_path?.file,
              "product_images",
            );
          }

          // Update description images if provided
          if (desc_images_path && desc_images_path.length > 0) {
            const newDescImagesPaths = [];
            for (const image of desc_images_path) {
              const imagePath = await saveFile(
                image?.file,
                "product_desc_images",
              );
              newDescImagesPaths.push(imagePath);
            }
            updateData.desc_images_path = JSON.stringify(newDescImagesPaths);
          }

          // 제품 업데이트
          const updatedProduct = await context.prisma.product.update({
            where: { id },
            data: {
              ...updateData,
              category_id: updateData.category_id
                ? Number(updateData.category_id)
                : Number(existProduct.category_id),
            },
          });

          console.log(updateData);

          if (!updatedProduct) {
            throw new GraphQLError("제품 정보 수정을 실패했습니다. ", {
              extensions: {
                code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR,
              },
            });
          }
          return {
            ...updatedProduct,
            desc_images_path: JSON.parse(updatedProduct.desc_images_path),
          };
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
  },
});
