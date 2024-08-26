import {
  objectType,
  enumType,
  nonNull,
  stringArg,
  intArg,
  booleanArg,
  extendType,
  arg,
  nullable,
} from "nexus";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import "dotenv/config";
import { AuthTokenPayload } from "#/utils/auth";
import { UserStatus } from "@prisma/client";
import {
  validUser,
  isAdmin,
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,
} from "#/graphql/validators";

export const UserMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("createUser", {
      // 관리자: 회원 생성
      type: "User",
      args: {
        user_id: nonNull(stringArg()),
        email: nonNull(stringArg()),
        name: nonNull(stringArg()),
        password: nonNull(stringArg()),
        gender: nonNull(arg({ type: "Gender" })),
        phone_number: nullable(stringArg()),
        status: nonNull(arg({ type: "UserStatus" })),
        permissions: nonNull(arg({ type: "UserPermissions" })),
      },
      authorize: isAdmin,
      resolve: async (_, args, context) => {
        const { id, ...updateData } = args;

        // 변경할 데이터만 포함하는 객체 생성
        const filteredUpdateData = Object.fromEntries(
          Object.entries(updateData).filter(
            ([_, value]) => value !== undefined,
          ),
        );

        // 변경할 데이터가 있는 경우에만 업데이트 수행
        if (Object.keys(filteredUpdateData).length > 0) {
          const updatedUser = await context.prisma.user.update({
            where: { id },
            data: filteredUpdateData,
          });

          return updatedUser;
        } else {
          // 변경할 데이터가 없는 경우, 현재 사용자 정보 반환
          const currentUser = await context.prisma.user.findUnique({
            where: { id },
          });

          if (!currentUser) {
            throw new Error("User not found");
          }

          return currentUser;
        }
      },
    });
    t.nonNull.field("updateUserStateSuspended", {
      // 관리자 : 회원 자격 정지
      type: "AuthPayload",
      args: {
        id: nonNull(stringArg()),
      },
      authorize: isAdmin,
      resolve: async (_, args, context) => {
        const deleteUser = await context.prisma.user.update({
          where: { id: args.id },
          data: {
            status: UserStatus.SUSPENDED,
          },
        });
        return {
          user: deleteUser,
        };
      },
    });
    t.nonNull.field("updateUserStateActive", {
      // 관리자 : 회원 자격 활성화
      type: "AuthPayload",
      args: {
        id: nonNull(stringArg()),
      },
      authorize: isAdmin,
      resolve: async (_, args, context) => {
        const activeUser = await context.prisma.user.update({
          where: { id: args.id },
          data: {
            status: UserStatus.ACTIVE,
          },
        });
        return {
          user: activeUser,
        };
      },
    });
    t.nonNull.field("updateUser", {
      // 관리자 : 회원 정보 수정
      type: "User",
      args: {
        id: nonNull(stringArg()),
        user_id: nullable(stringArg()),
        email: nullable(stringArg()),
        name: nullable(stringArg()),
        gender: nullable(arg({ type: "Gender" })),
        phone_number: nullable(stringArg()),
        permissions: nullable(arg({ type: "UserPermissions" })),
      },
      authorize: isAdmin,
      resolve: async (_, args, context) => {
        const { id, ...updateData } = args;
        const currentUser = await context.prisma.user.findUnique({
          where: { id },
        });
        // 변경할 데이터만 포함하는 객체 생성
        const filteredUpdateData = Object.fromEntries(
          Object.entries(updateData).filter(
            ([key, value]) => value !== undefined && value !== currentUser[key],
          ),
        );

        // 변경할 데이터가 있는 경우에만 업데이트 수행
        if (Object.keys(filteredUpdateData).length > 0) {
          const updatedUser = await context.prisma.user.update({
            where: { id },
            data: filteredUpdateData,
          });

          return updatedUser;
        } else {
          // 변경할 데이터가 없는 경우, 현재 사용자 정보 반환
          if (!currentUser) {
            throw new Error("User not found");
          }

          return currentUser;
        }
      },
    });
  },
});

export const AuthMutation = extendType({
  type: "Mutation",
  definition(t) {
    // 회원가입
    t.nonNull.field("signup", {
      type: "AuthPayload",
      args: {
        user_id: nonNull(stringArg()),
        email: nonNull(stringArg()),
        name: nonNull(stringArg()),
        password: nonNull(stringArg()),
        gender: nonNull(arg({ type: "Gender" })),
        phone_number: nullable(stringArg()),
        status: nonNull(arg({ type: "UserStatus" })),
        permissions: nonNull(arg({ type: "UserPermissions" })),
      },
      resolve: async (_, args, context) => {
        const {
          user_id,
          email,
          name,
          gender,
          status,
          phone_number,
          permissions,
        } = args;
        const password = await bcrypt.hash(args.password, 10);

        const refresh_token = jwt.sign(
          { userId: user_id, userRole: permissions },
          REFRESH_TOKEN_SECRET,
          {
            expiresIn: "1h",
          },
        );

        const user = await context.prisma.user.create({
          data: {
            user_id,
            email,
            name,
            gender,
            status,
            phone_number,
            permissions,
            password,
            refresh_token: refresh_token,
          },
        });
        const token = jwt.sign(
          { userId: user.id, userRole: user.permissions },
          ACCESS_TOKEN_SECRET,
          {
            expiresIn: "20s",
          },
        );

        return {
          token,
          refresh_token,
          user,
        };
      },
    });
    //로그인
    t.nonNull.field("signin", {
      type: "AuthPayload",
      args: {
        user_id: nonNull(stringArg()),
        password: nonNull(stringArg()),
      },
      resolve: async (_, args, context) => {
        const user = await context.prisma.user.findUnique({
          where: { user_id: args.user_id },
        });

        if (!user) {
          throw new Error("No such user found");
        }
        const valid = await bcrypt.compare(args.password, user.password);
        if (!valid) {
          throw new Error("Invalid password");
        }
        const token = jwt.sign(
          { userId: user.id, userRole: user.permissions },
          ACCESS_TOKEN_SECRET,
          {
            expiresIn: "20s",
          },
        );

        const refresh_token = jwt.sign(
          { userId: user.id, userRole: user.permissions },
          REFRESH_TOKEN_SECRET,
          {
            expiresIn: "1h",
          },
        );
        const updatedUser = await context.prisma.user.update({
          where: { id: user.id },
          data: {
            refresh_token: refresh_token,
          },
        });

        return {
          token,
          refresh_token,
          user: updatedUser,
        };
      },
    });
    //로그아웃
    t.nonNull.field("signout", {
      type: "User",
      args: {
        id: nonNull(stringArg()),
      },
      resolve: async (_, { id }, context) => {
        const user = await context.prisma.user.findUnique({
          where: { id: id },
        });
        if (!user) {
          throw new Error("No such user found");
        }
        const updatedUser = context.prisma.user.update({
          where: { id: id },
          data: {
            refresh_token: null,
          },
        });
        return updatedUser;
      },
    });
    // access token 만료시 refresh token
    t.nonNull.field("refresh", {
      type: "AuthPayload",
      args: {
        refresh_token: nonNull(stringArg()),
      },
      resolve: async (_, { refresh_token }, context) => {
        try {
          // Refresh 토큰 검증
          const decodedRefreshToken = jwt.verify(
            refresh_token,
            REFRESH_TOKEN_SECRET,
          ) as AuthTokenPayload;

          // 사용자 검색
          const user = await context.prisma.user.findUnique({
            where: { id: decodedRefreshToken.userId },
          });

          if (!user) {
            throw new Error("User not found");
          }

          if (user.refresh_token !== refresh_token) {
            throw new Error("refresh_token not matched");
          }
          // 새로운 access 토큰 생성
          const newAccessToken = jwt.sign(
            { userId: user.id, userRole: user.permissions },
            ACCESS_TOKEN_SECRET,
            { expiresIn: "20s" },
          );

          // 새로운 refresh 토큰 생성
          const newRefreshToken = jwt.sign(
            { userId: user.id, userRole: user.permissions },
            REFRESH_TOKEN_SECRET,
            { expiresIn: "1h" },
          );

          // 새로운 refresh 토큰을 DB에 저장
          await context.prisma.user.update({
            where: { id: user.id },
            data: { refresh_token: newRefreshToken },
          });

          return {
            token: newAccessToken,
            refresh_token: newRefreshToken,
            user,
          };
        } catch (error) {
          throw new Error("Unable to refresh token");
        }
      },
    });
    // 회원 탈퇴 withdrawal
    t.nullable.field("withdrawal", {
      type: "AuthPayload",
      args: {
        user_id: nonNull(stringArg()),
        password: nonNull(stringArg()),
      },
      authorize: validUser,
      resolve: async (_, args, context) => {
        const user = await context.prisma.user.findUnique({
          where: { user_id: args.user_id },
        });

        if (!user) {
          throw new Error("No such user found");
        }
        const valid = await bcrypt.compare(args.password, user.password);
        if (!valid) {
          throw new Error("Invalid password");
        }

        const deleteUser = await context.prisma.user.update({
          where: { user_id: args.user_id },
          data: {
            status: UserStatus.INACTIVE,
          },
        });
        return {
          user: deleteUser,
        };
      },
    });
  },
});
