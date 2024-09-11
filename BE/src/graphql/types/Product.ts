import {
  objectType,
  enumType,
  nonNull,
  stringArg,
  intArg,
  booleanArg,
  extendType,
} from "nexus";
import { GraphQLUpload } from "graphql-upload-minimal";

export const Upload = GraphQLUpload;

export const PageInfo = objectType({
  name: "PageInfo",
  definition(t) {
    t.nonNull.int("currentPage");
    t.nonNull.int("pageSize");
    t.nonNull.int("totalCount");
    t.nonNull.int("totalPages");
  },
});

// PaginatedProductsResult 타입 정의
export const PaginatedProductsResult = objectType({
  name: "PaginatedProductsResult",
  definition(t) {
    t.nonNull.list.nonNull.field("products", { type: "Product" });
    t.nonNull.field("pageInfo", { type: "PageInfo" });
  },
});

export const ProductsResultFormHome = objectType({
  name: "ProductsResultFormHome",
  definition(t) {
    t.nonNull.list.nonNull.field("ad", { type: "Product" }); // 제품 4개
    t.nonNull.list.nonNull.field("new", { type: "Product" }); // 제품 8개
    t.nonNull.list.nonNull.field("event", { type: "Product" }); // 제품 9개
  },
});

export const ProductType = objectType({
  name: "Product",
  definition(t) {
    t.nonNull.id("id");
    t.nonNull.string("name");
    t.string("desc");
    t.nonNull.int("price");
    t.int("sale");
    t.nonNull.int("count");
    t.nonNull.boolean("is_deleted");
    t.nonNull.field("status", { type: "ProductStatus" });
    t.field("main_image_path", { type: "String" });
    t.list.string("desc_images_path");
    t.nonNull.field("created_at", { type: "DateTime" });
    t.nonNull.field("updated_at", { type: "DateTime" });
    t.nonNull.list.nonNull.field("categories", {
      type: "Category",
      resolve: (parent, _, context) => {
        return context.prisma.product
          .findUnique({ where: { id: parent.id } })
          .categories();
      },
    });
    t.nonNull.string("store_id");

    t.field("store", {
      type: "Store",
      resolve: (parent, _, context) => {
        return context.prisma.product
          .findUnique({ where: { id: parent.id } })
          .store();
      },
    });

    t.field("category", {
      type: "Category",
      resolve: (parent, _, context) => {
        return context.prisma.product
          .findUnique({ where: { id: parent.id } })
          .category();
      },
    });

    t.nonNull.list.nonNull.field("carts", {
      type: "Cart",
      resolve: (parent, _, context) => {
        return context.prisma.product
          .findUnique({ where: { id: parent.id } })
          .carts();
      },
    });

    t.nonNull.list.nonNull.field("reviews", {
      type: "Review",
      resolve: (parent, _, context) => {
        return context.prisma.product
          .findUnique({ where: { id: parent.id } })
          .reviews();
      },
    });
  },
});
