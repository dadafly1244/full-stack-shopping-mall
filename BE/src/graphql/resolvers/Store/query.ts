import {
  objectType,
  extendType,
  nonNull,
  stringArg,
  enumType,
  list,
  inputObjectType,
} from "nexus";
import { ApolloServerErrorCode } from "@apollo/server/errors";
import { GraphQLError } from "graphql";
export const StoreQuery = extendType({
  type: "Query",
  definition(t) {
    // 모든 Store 조회
    t.list.field("stores", {
      type: "Store",
      resolve: async (_, __, ctx) => {
        try {
          const result = await ctx.prisma.store.findMany();
          if (!result) {
            throw new GraphQLError("아직 스토어가 없습니다.");
          }
          return result;
        } catch (error) {
          throw new GraphQLError("sever error, store list 불러오기 실패", {
            extensions: {
              code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR,
            },
          });
        }
      },
    });

    // ID로 Store 조회
    t.field("store", {
      type: "Store",
      args: { id: nonNull(stringArg()) },
      resolve: async (_, { id }, ctx) => {
        try {
          const store = await ctx.prisma.store.findUnique({ where: { id } });
          if (!store) {
            throw new GraphQLError("해당 id에 해당하는 store가 없습니다.", {
              extensions: {
                code: ApolloServerErrorCode.BAD_USER_INPUT,
                invalidArgs: ["id"],
              },
            });
          }
          return store;
        } catch (error) {
          throw new GraphQLError("sever에러 store 불러오기 실패", {
            extensions: {
              code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR,
            },
          });
        }
      },
    });

    // Store 검색
    t.list.field("searchStores", {
      type: "Store",
      args: { searchTerm: nonNull(stringArg()) },
      resolve: async (_, { searchTerm }, ctx) => {
        if (!searchTerm.trim()) {
          throw new GraphQLError("검색어를을 입력해 주세요.", {
            extensions: {
              code: ApolloServerErrorCode.BAD_USER_INPUT,
              invalidArgs: ["searchTerm"],
            },
          });
        }
        try {
          const result = await ctx.prisma.store.findMany({
            where: {
              OR: [
                { name: { contains: searchTerm } },
                { business_registration_number: { contains: searchTerm } },
                { desc: { contains: searchTerm } },
              ],
            },
          });
          if (!result) {
            throw new GraphQLError("검색 결과가 없습니다.", {
              extensions: {
                code: ApolloServerErrorCode.BAD_USER_INPUT,
                invalidArgs: ["searchTerm"],
              },
            });
          }
          return result;
        } catch (error) {
          throw new GraphQLError("서버 에러: 스토어 검색 실패 ", {
            extensions: {
              code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR,
              invalidArgs: ["searchTerm"],
            },
          });
        }
      },
    });
    t.field("isDuplicated", {
      type: "Boolean",
      args: {
        business_registration_number: stringArg(),
      },
      resolve: async (_, { business_registration_number }, context) => {
        if (!business_registration_number.trim()) {
          throw new GraphQLError("사업자 번호를 입력해 주세요.", {
            extensions: {
              code: ApolloServerErrorCode.BAD_USER_INPUT,
              invalidArgs: ["business_registration_number"],
            },
          });
        }

        const store = await context.prisma.store.findFirst({
          where: {
            business_registration_number: business_registration_number,
          },
        });
        if (!store) {
          throw new GraphQLError("서버 에러: 스토어 검색 실패 ", {
            extensions: {
              code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR,
            },
          });
        }

        return false; // 사용가능
      },
    });
  },
});
