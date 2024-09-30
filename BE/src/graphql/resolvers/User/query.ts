import {
  objectType,
  enumType,
  nonNull,
  nullable,
  stringArg,
  intArg,
  booleanArg,
  extendType,
  list,
  arg,
} from "nexus";
import { isAdmin } from "#/graphql/validators";
import {
  Gender,
  User,
  UserPermissions,
  UserStatus,
  Prisma,
} from "@prisma/client";
type KoreanToEnumMap = {
  gender: Record<string, Gender>;
  permissions: Record<string, UserPermissions>;
  status: Record<string, UserStatus>;
};
const koreanToEnumMap: KoreanToEnumMap = {
  gender: {
    남성: Gender.MALE,
    여성: Gender.FEMALE,
    기타: Gender.OTHER,
    선택안함: Gender.PREFER_NOT_TO_SAY,
  },
  permissions: {
    관리자: UserPermissions.ADMIN,
    사용자: UserPermissions.USER,
  },
  status: {
    활성화: UserStatus.ACTIVE,
    탈퇴: UserStatus.INACTIVE,
    정지: UserStatus.SUSPENDED,
  },
};

type SearchField = keyof Pick<
  User,
  | "gender"
  | "permissions"
  | "status"
  | "name"
  | "email"
  | "user_id"
  | "phone_number"
>;

type EnumFields = keyof KoreanToEnumMap;

function isEnumField(field: SearchField): field is EnumFields {
  return field in koreanToEnumMap;
}

function createWhereClause(
  searchField: SearchField,
  searchTerm: string,
): Prisma.UserWhereInput {
  if (isEnumField(searchField)) {
    let enumValue: Gender | Permissions | UserStatus | undefined;

    // 먼저 searchTerm이 직접적인 열거형 값인지 확인
    if (
      Object.values(koreanToEnumMap[searchField]).includes(searchTerm as any)
    ) {
      enumValue = searchTerm as Gender | Permissions | UserStatus;
    }

    if (enumValue) {
      return { [searchField]: { equals: enumValue } };
    }
    throw new Error(`Invalid ${searchField} value: ${searchTerm}`);
  }
  return { [searchField]: { contains: searchTerm } };
}

export const UserQuery = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.list.field("usersList", {
      //관리자 : 전체 사용자 조회
      type: "User",
      authorize: isAdmin,
      resolve: async (_, __, context) => {
        return await context.prisma.user.findMany();
      },
    });
    t.nonNull.list.field("filteredUsers", {
      // 관리자: 사용자 검색
      type: "User",
      args: {
        searchTerm: nonNull(stringArg()),
        searchField: nonNull(stringArg()),
      },
      authorize: isAdmin,
      resolve: async (_, { searchTerm, searchField }, context) => {
        const validatedSearchField = searchField as SearchField;
        const whereClause = createWhereClause(validatedSearchField, searchTerm);

        const users = await context.prisma.user.findMany({
          where: whereClause,
        });

        return users;
      },
    });

    //pagination 적용한 api
    t.field("paginatedUsers", {
      type: "PaginatedUsersResponse",
      args: {
        page: nonNull(intArg({ default: 1 })),
        pageSize: nonNull(intArg({ default: 10 })),
        searchTerm: nullable(stringArg()),
        searchField: nullable(stringArg()),
      },
      authorize: isAdmin,
      resolve: async (
        _,
        { page, pageSize, searchTerm, searchField },
        context,
      ) => {
        const skip = (page - 1) * pageSize;

        let whereClause = {};
        if (searchTerm && searchField) {
          const validatedSearchField = searchField as SearchField;
          whereClause = createWhereClause(validatedSearchField, searchTerm);
        }

        const [users, totalCount] = await Promise.all([
          context.prisma.user.findMany({
            where: whereClause,
            skip,
            take: pageSize,
          }),
          context.prisma.user.count({ where: whereClause }),
        ]);

        const totalPages = Math.ceil(totalCount / pageSize);

        return {
          users,
          pageInfo: {
            currentPage: page,
            pageSize,
            totalCount,
            totalPages,
          },
        };
      },
    });
  },
});

export const UserBooleanQuery = extendType({
  //이메일, id 중복 체크
  type: "Query",
  definition(t) {
    t.field("isDuplicated", {
      type: "UserBoolean",
      args: {
        user_id: nullable(stringArg()),
        email: nullable(stringArg()),
      },
      resolve: async (_, args, context) => {
        if (!args?.user_id && !args?.email) {
          throw new Error("user_id 또는 email을 입력해주세요");
        }

        const conditions = [];
        if (args.user_id) conditions.push({ user_id: args.user_id });
        if (args.email) conditions.push({ email: args.email });
        console.log(conditions);
        const user = await context.prisma.user.findFirst({
          where: {
            OR: conditions,
          },
        });
        if (!user) return { duplicated: false };

        return { duplicated: true };
      },
    });
  },
});
