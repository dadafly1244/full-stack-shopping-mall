import {
  extendType,
  nonNull,
  stringArg,
  booleanArg,
  intArg,
  objectType,
  enumType,
  inputObjectType,
  arg,
} from "nexus";
import { GraphQLError } from "graphql";
import { PrismaClient, Prisma, Category } from "@prisma/client";
import { ApolloServerErrorCode } from "@apollo/server/errors";
export const SortOrder = enumType({
  name: "SortOrder",
  members: ["asc", "desc"],
});

// 전체 카테고리 조회
// 단일 카테고리 조회
// 카테고리 이름 검색

export const CategoryOrderByInput = inputObjectType({
  name: "CategoryOrderByInput",
  definition(t) {
    t.field("id", { type: "SortOrder" });
    t.field("name", { type: "SortOrder" });
  },
});

export const CategoryQuery = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.list.nonNull.field("categories", {
      type: "Category",
      args: {
        includeHierarchy: booleanArg(),
        orderBy: arg({ type: "CategoryOrderByInput" }),
      },
      resolve: async (_, { includeHierarchy, orderBy }, context) => {
        const prismaArgs: Prisma.CategoryFindManyArgs = {
          orderBy: orderBy || { id: "asc" },
        };

        if (includeHierarchy) {
          prismaArgs.where = { category_parent_id: null };
          prismaArgs.include = {
            subcategories: {
              include: {
                subcategories: {
                  include: {
                    subcategories: true,
                  },
                },
              },
            },
          };
        }

        return context.prisma.category.findMany(prismaArgs);
      },
    });
    // 새로운 단일 카테고리 쿼리 추가
    t.field("category", {
      type: "Category",
      args: {
        id: nonNull(intArg()),
        includeHierarchy: booleanArg(),
      },
      resolve: async (_, { id, includeHierarchy }, context) => {
        const prismaArgs: Prisma.CategoryFindUniqueArgs = {
          where: { id },
        };

        if (includeHierarchy) {
          prismaArgs.include = {
            subcategories: {
              include: {
                subcategories: {
                  include: {
                    subcategories: true,
                  },
                },
              },
            },
            parent: true,
          };
        }

        return context.prisma.category.findUnique(prismaArgs);
      },
    });
    //카테고리 이름 검색 쿼리
    t.nonNull.list.nonNull.field("searchCategories", {
      type: "Category",
      args: {
        nameContains: nonNull(stringArg()),
        includeHierarchy: booleanArg(),
      },
      resolve: async (_, { nameContains, includeHierarchy }, context) => {
        const prismaArgs: Prisma.CategoryFindManyArgs = {
          where: {
            name: {
              contains: nameContains,
            },
          },
        };

        if (!nameContains.trim()) {
          throw new GraphQLError("검색어를을 입력해 주세요.", {
            extensions: {
              code: ApolloServerErrorCode.BAD_USER_INPUT,
              invalidArgs: ["nameContains"],
            },
          });
        }
        if (includeHierarchy) {
          prismaArgs.include = {
            subcategories: {
              include: {
                subcategories: {
                  include: {
                    subcategories: true,
                  },
                },
              },
            },
            parent: true,
          };
        }

        const categories = await context.prisma.category.findMany(prismaArgs);

        if (categories.length === 0) {
          throw new GraphQLError(
            `No categories found containing "${nameContains}"`,
          );
        }

        return categories;
      },
    });
  },
});
/**

{
  categories(includeHierarchy: true, orderBy: {name: asc}) {
    id
    name
    category_parent_id
    parent {
      id
      name
      category_parent_id
     
    }
    subcategories {
      id
      name
      category_parent_id
     subcategories {
      id
      name
      category_parent_id
     
   
    }
   
    }

  }
}

/////

{
  category(id: 3, includeHierarchy: true) {
    id
    name
    category_parent_id
    parent {
      id
      name
      category_parent_id
    }
    subcategories {
      id
      name
      category_parent_id
        subcategories {
      id
      name
      category_parent_id
    }
    }

  }
}



{
  searchCategories(nameContains: "h", includeHierarchy: true) {
    id
    name
    category_parent_id
    parent {
      id
      name
      category_parent_id
    
    }
    subcategories {
      id
      name
      category_parent_id
     subcategories {
      id
      name
      category_parent_id
    
    }
    }
   
  }
}


 */
