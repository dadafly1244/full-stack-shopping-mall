import {
  objectType,
  enumType,
  nonNull,
  stringArg,
  intArg,
  booleanArg,
  extendType,
} from "nexus";

export const ProductMutation = extendType({
  type: "Mutation",
  definition(t) {
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
      resolve: (_, args, ctx) => {
        return ctx.prisma.product.create({
          data: args,
        });
      },
    });
    // 필요에 따라 updateProduct, deleteProduct 등의 뮤테이션을 추가할 수 있습니다.
  },
});
