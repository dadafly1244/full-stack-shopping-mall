import { extendType, booleanArg } from "nexus";

export const CategoryQuery = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.list.nonNull.field("categories", {
      type: "Category",
      args: {
        includeHierarchy: booleanArg(),
      },
      resolve: async (_, { includeHierarchy }, context) => {
        if (includeHierarchy) {
          // 3단계까지의 계층 구조를 포함하여 최상위 카테고리만 가져옵니다
          return context.prisma.category.findMany({
            where: { category_parent_id: null },
            include: {
              subcategories: {
                include: {
                  subcategories: {
                    include: {
                      subcategories: true, // 3단계까지의 하위 카테고리를 포함
                    },
                  },
                },
              },
            },
          });
        } else {
          // 모든 카테고리를 플랫하게 가져옵니다
          return context.prisma.category.findMany();
        }
      },
    });
  },
});
