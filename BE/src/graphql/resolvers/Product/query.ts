import {
  extendType,
  idArg,
  stringArg,
  intArg,
  nonNull,
  nullable,
  arg,
  booleanArg,
  objectType,
} from "nexus";
import { GraphQLError } from "graphql";
import { ApolloServerErrorCode } from "@apollo/server/errors";
import { Product } from "@prisma/client";
export const CustomError = objectType({
  name: "CustomError",
  definition(t) {
    t.nonNull.string("message");
    t.nonNull.string("code");
  },
});
export const ProductQuery = extendType({
  type: "Query",
  definition(t) {
    // searchProducts query with pagination
    t.field("searchProducts", {
      type: nonNull("PaginatedProductsResult"),
      args: {
        id: stringArg(),
        name: stringArg(),
        desc: stringArg(),
        status: nullable(arg({ type: "ProductStatus" })),
        is_deleted: nullable(booleanArg()),
        category_id: intArg(),
        store_id: stringArg(),
        page: nonNull(intArg({ default: 1 })),
        pageSize: nonNull(intArg({ default: 10 })),
      },
      resolve: async (_, args, context) => {
        try {
          const where = {
            OR: [
              { id: args.id },
              { name: { contains: args.name } },
              { desc: { contains: args.desc } },
              { status: args.status },
              { is_deleted: args.is_deleted },
              { category_id: args.category_id },
              { store_id: args.store_id },
            ],
          };

          const totalCount = await context.prisma.product.count({ where });

          if (totalCount < 0 || totalCount === undefined) {
            throw new GraphQLError("총 제품 수를 계산하지 못했습니다.", {
              extensions: {
                code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR,
              },
            });
          }
          const products = await context.prisma.product.findMany({
            where,
            skip: (args.page - 1) * args.pageSize,
            take: args.pageSize,
          });

          if (!products) {
            throw new GraphQLError("제품을 찾지 못했습니다.", {
              extensions: {
                code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR,
              },
            });
          }
          const processedProducts = products.map((product: Product) => ({
            ...product,
            desc_images_urls: product.desc_images_path
              ? JSON.parse(product.desc_images_path as string)
              : null,
          }));

          return {
            products: processedProducts,
            pageInfo: {
              currentPage: args.page,
              pageSize: args.pageSize,
              totalCount,
              totalPages: Math.ceil(totalCount / args.pageSize),
            },
          };
        } catch (error) {
          if (error instanceof GraphQLError) {
            throw error;
          }
          throw new GraphQLError("Failed to search Products", {
            extensions: {
              code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR,
              invalidArgs: Object.keys(args).filter(
                (key) => args[key] !== undefined,
              ),
            },
          });
        }
      },
    });

    // getAllProducts query with pagination
    t.field("getAllProducts", {
      type: nonNull("PaginatedProductsResult"),
      args: {
        page: nonNull(intArg({ default: 1 })),
        pageSize: nonNull(intArg({ default: 10 })),
      },
      resolve: async (_, args, context) => {
        try {
          const totalCount = await context.prisma.product.count();
          if (totalCount < 0 || totalCount === undefined) {
            throw new GraphQLError("총 제품 수를 계산하지 못했습니다.", {
              extensions: {
                code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR,
              },
            });
          }
          const products = await context.prisma.product.findMany({
            skip: (args.page - 1) * args.pageSize,
            take: args.pageSize,
          });

          if (!products) {
            throw new GraphQLError("제품을 찾지 못했습니다.", {
              extensions: {
                code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR,
              },
            });
          }

          // JSON 필드 처리
          const processedProducts = products.map((product: Product) => {
            if (product.desc_images_path) {
              return {
                ...product,
                desc_images_path: product.desc_images_path
                  ? JSON.parse(product.desc_images_path as string)
                  : // ?(product.desc_images_path as string)
                    //   .slice(1, -1)
                    //   .split(", ")
                    null,
              };
            } else return product;
          });
          return {
            products: processedProducts,
            pageInfo: {
              currentPage: args.page,
              pageSize: args.pageSize,
              totalCount,
              totalPages: Math.ceil(totalCount / args.pageSize),
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

    // getProduct query
    t.field("getProduct", {
      type: "Product",
      args: {
        id: nonNull(stringArg()),
      },
      resolve: async (_, args, context) => {
        try {
          const product = await context.prisma.product.findUnique({
            where: { id: args.id },
          });
          if (!product) {
            throw new GraphQLError("제품을 찾지 못했습니다.", {
              extensions: {
                code: ApolloServerErrorCode.BAD_USER_INPUT,
                invalidArgs: ["id"],
              },
            });
          }
          const processedProduct = {
            ...product,
            desc_images_path: product.desc_images_path
              ? JSON.parse(product.desc_images_path as string)
              : [],
          };

          return processedProduct;
        } catch (error) {
          if (error instanceof GraphQLError) {
            throw error;
          }
          throw new GraphQLError("Failed to fetch Product", {
            extensions: {
              code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR,
            },
          });
        }
      },
    });
    // t.field("getAllProducts", {
    //   type: nonNull("PaginatedProductsResult"),
    //   args: {
    //     page: nonNull(intArg()),
    //     pageSize: nonNull(intArg()),
    //   },
    //   resolve: async (_, args, context) => {
    //     try {
    //       const totalCount = await context.prisma.product.count();
    //       if (totalCount < 0 || totalCount === undefined) {
    //         throw new GraphQLError("총 제품 수를 계산하지 못했습니다.", {
    //           extensions: {
    //             code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR,
    //           },
    //         });
    //       }
    //       const products = await context.prisma.product.findMany({
    //         skip: (args.page - 1) * args.pageSize,
    //         take: args.pageSize,
    //       });

    //       if (!products) {
    //         throw new GraphQLError("제품을 찾지 못했습니다.", {
    //           extensions: {
    //             code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR,
    //           },
    //         });
    //       }
    //       return {
    //         products,
    //         pageInfo: {
    //           currentPage: args.page,
    //           pageSize: args.pageSize,
    //           totalCount,
    //           totalPages: Math.ceil(totalCount / args.pageSize),
    //         },
    //       };
    //     } catch (error) {
    //       if (error instanceof GraphQLError) {
    //         throw error;
    //       }
    //       throw new GraphQLError("Failed to fetch all Products", {
    //         extensions: {
    //           code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR,
    //         },
    //       });
    //     }
    //   },
    // });

    //HomePage를 위한 조회 api
    t.field("getAllProductsForHomePage", {
      type: nonNull("ProductsResultFormHome"),
      args: {
        category: nullable(stringArg()),
      },
      resolve: async (_, args, context) => {
        const { category } = args;
        let adProducts = [];
        let newProducts = [];
        let eventProducts = [];
        const errors = [];
        const count = await context.prisma.product.count();

        const parseProduct = (product: Product) => ({
          ...product,
          desc_images_path: JSON.parse(
            (product.desc_images_path as string) || "[]",
          ),
        });
        // 1. Ad products: main이미지 있는 것 중에서 렌덤으로 4개 가져오기
        try {
          adProducts = await context.prisma.product.findMany({
            where: {
              is_deleted: false,
            },
            skip: Math.floor(Math.random() * (count - 4)),
            take: 4,
          });
          adProducts = adProducts?.map(parseProduct);
        } catch (error) {
          console.error("Error fetching ad products:", error);
          errors.push(
            new GraphQLError("Failed to fetch ad products", {
              extensions: { code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR },
            }),
          );
        }

        // 2. New products: 최근에 등록된 8개 제품 가져오기. 카테고리가 있으면 그 안에서 가져오기.
        try {
          let newProductsQuery;
          if (category) {
            const categoryExists = await context.prisma.category.findUnique({
              where: { name: category },
            });

            if (!categoryExists) {
              throw new GraphQLError("Category not found", {
                extensions: { code: ApolloServerErrorCode.BAD_USER_INPUT },
              });
            } else {
              newProductsQuery = {
                where: {
                  is_deleted: false,
                  category: { name: category },
                },
                orderBy: {
                  created_at: "desc",
                },
                take: 8,
                skip: Math.floor(Math.random() * (count - 8)),
              };
            }
            newProductsQuery = {
              where: {
                is_deleted: false,
              },
              orderBy: {
                created_at: "desc",
              },
              take: 8,
              skip: Math.floor(Math.random() * (count - 8)),
            };
          } else {
            newProductsQuery = {
              where: {
                is_deleted: false,
              },
              orderBy: {
                created_at: "desc",
              },
              take: 8,
              skip: Math.floor(Math.random() * (count - 8)),
            };
          }

          newProducts = await context.prisma.product.findMany(newProductsQuery);
          newProducts = newProducts?.map(parseProduct);
          if (newProducts.length === 0) {
            console.warn(
              `No new products found${category ? ` in category ${category}` : ""}`,
            );
          }
        } catch (error) {
          console.error("Error fetching new products:", error);
          if (error instanceof GraphQLError) {
            errors.push(error);
          } else {
            errors.push(
              new GraphQLError("Failed to fetch new products", {
                extensions: {
                  code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR,
                },
              }),
            );
          }
        }

        // 3. Event products: sale 값이 있는 것 중에서 9개 랜덤으로 가져오기
        try {
          eventProducts = await context.prisma.product.findMany({
            where: {
              sale: { not: null },
              is_deleted: false,
            },
            take: 9,
            skip: Math.floor(Math.random() * (count - 9)),
          });
          eventProducts = eventProducts?.map(parseProduct);

          if (eventProducts.length === 0) {
            console.warn("No products with sale value found");
          }
        } catch (error) {
          console.error("Error fetching event products:", error);
          errors.push(
            new GraphQLError("Failed to fetch event products", {
              extensions: { code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR },
            }),
          );
        }

        // If all queries failed, throw a general error
        if (errors.length === 3) {
          throw new GraphQLError("Failed to fetch any products", {
            extensions: { code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR },
          });
        }

        // Return partial results with error messages
        return {
          ad: adProducts,
          new: newProducts,
          event: eventProducts,
          errors: errors.length > 0 ? errors : null,
        };
      },
    });
  },
});
