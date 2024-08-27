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
      resolve: async (_, args, context) => {
        return await context.prisma.product.create({
          data: args,
        });
      },
    });
    // category랑 store 추가 삭제하는 api,
  },
});
