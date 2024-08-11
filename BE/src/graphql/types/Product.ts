import {
  objectType,
  enumType,
  nonNull,
  stringArg,
  intArg,
  booleanArg,
  extendType,
} from "nexus";

import { ProductStatusEnum } from "#/graphql/types/enumType";

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
    t.nonNull.field("status", { type: ProductStatusEnum });
    t.nonNull.string("main_image_path");
    t.nullable.field("desc_images_path", { type: "JSON" });
    t.nonNull.field("created_at", { type: "DateTime" });
    t.nonNull.field("updated_at", { type: "DateTime" });
    t.nonNull.int("category_id");
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
