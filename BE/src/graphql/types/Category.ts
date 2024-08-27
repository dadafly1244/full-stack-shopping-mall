import { objectType } from "nexus";

export const CategoryType = objectType({
  name: "Category",
  definition(t) {
    t.nonNull.int("id");
    t.nonNull.string("name");
    t.int("category_parent_id");

    // 부모 카테고리 관계
    t.field("parent", {
      type: "Category",
      resolve: (parent, _, context) => {
        if (!parent.category_parent_id) return null;
        return context.prisma.category.findUnique({
          where: { id: parent.category_parent_id },
        });
      },
    });

    // 하위 카테고리 관계
    t.nonNull.list.nonNull.field("subcategories", {
      type: "Category",
      resolve: (parent, _, context) => {
        return context.prisma.category.findMany({
          where: { category_parent_id: parent.id },
        });
      },
    });

    // 제품 관계
    t.nonNull.list.nonNull.field("products", {
      type: "Product",
      resolve: (parent, _, context) => {
        return context.prisma.category
          .findUnique({ where: { id: parent.id } })
          .products();
      },
    });
  },
});
