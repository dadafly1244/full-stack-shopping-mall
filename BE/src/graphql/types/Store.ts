import { objectType, extendType, nonNull, stringArg, enumType } from "nexus";

export const StoreType = objectType({
  name: "Store",
  definition(t) {
    t.nonNull.id("id");
    t.nonNull.string("business_registration_number");
    t.nonNull.string("name");
    t.nullable.string("desc");
    t.nonNull.string("product_id");

    t.list.nonNull.field("products", {
      type: "Product",
      resolve: (parent, _, context) => {
        return context.prisma.store
          .findUnique({ where: { id: parent.id } })
          .products();
      },
    });
  },
});
