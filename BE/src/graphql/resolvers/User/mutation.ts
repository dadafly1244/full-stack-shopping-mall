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
  isAuthenticated,
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
            expiresIn: "1h",
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
            expiresIn: "1h",
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
            { expiresIn: "1h" },
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
    t.nonNull.field("withdrawal", {
      type: "User",
      args: {
        user_id: nonNull(stringArg()),
        password: nonNull(stringArg()),
      },
      authorize: async (_, args, context) => {
        const user = await context.prisma.user.findUnique({
          where: { user_id: args.user_id },
        });

        if (!user) {
          throw new Error("No such user found");
        }

        const result = validUser(_, { user_id: user.id }, context);
        return result;
      },
      resolve: async (_, args, context) => {
        try {
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
            where: { id: user.id },
            data: {
              status: UserStatus.INACTIVE,
            },
          });

          if (!deleteUser || !deleteUser.id) {
            throw new Error(
              "회원 상태 수정 후 사용자 정보를 찾을 수 없습니다.",
            );
          }

          return deleteUser;
        } catch (error) {
          console.error("Withdrawal error:", error);
          throw new Error("회원 탈퇴 처리 중 오류가 발생했습니다.");
        }
      },
    });
    t.field("updateMyProfile", {
      type: "User",
      args: {
        user_id: nullable(stringArg()),
        currentPassword: nullable(stringArg()),
        newPassword: nullable(stringArg()),
        name: nullable(stringArg()),
        email: nullable(stringArg()),
        gender: nullable(arg({ type: "Gender" })),
        phone_number: nullable(stringArg()),
      },
      authorize: isAuthenticated,
      resolve: async (_, args, context) => {
        const userId = context.user.id;
        if (!userId) {
          throw new Error("Not authenticated");
        }

        const user = await context.prisma.user.findUnique({
          where: { id: userId },
        });

        if (!user) {
          throw new Error("User not found");
        }

        let updateData: any = {};

        // 비밀번호 변경 처리
        if (args.currentPassword && args.newPassword) {
          const isValidPassword = await bcrypt.compare(
            args.currentPassword,
            user.password,
          );
          if (!isValidPassword) {
            throw new Error("Current password is incorrect");
          }
          updateData["password"] = await bcrypt.hash(args.newPassword, 10);
        }

        // 다른 필드들 처리
        const fields = ["user_id", "name", "email", "gender", "phone_number"];
        fields.forEach((field) => {
          if (args[field] !== undefined) {
            updateData[field] = args[field];
          }
        });

        // 업데이트 수행
        const updatedUser = await context.prisma.user.update({
          where: { id: userId },
          data: updateData,
        });

        return updatedUser;
      },
    });
  },
});
