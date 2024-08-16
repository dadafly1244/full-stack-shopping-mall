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
import { ApolloServerErrorCode } from "@apollo/server/errors";
import { GraphQLError } from "graphql";
import { UserStatus } from "@prisma/client";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || "";
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || "";

export const UserMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("createUser", {
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
      resolve: async (_, args, context) => {
        return await context.prisma.user.create({
          data: args,
        });
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
            expiresIn: "10m",
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
            expiresIn: "1m",
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
            expiresIn: "1m",
          },
        );

        const refresh_token = jwt.sign(
          { userId: user.id, userRole: user.permissions },
          REFRESH_TOKEN_SECRET,
          {
            expiresIn: "10m",
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
      type: "AuthPayload",
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
        const refresh_token = null;

        return await context.prisma.user.update({
          refresh_token: refresh_token,
        });
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
            { expiresIn: "1m" },
          );

          // 새로운 refresh 토큰 생성
          const newRefreshToken = jwt.sign(
            { userId: user.id, userRole: user.permissions },
            REFRESH_TOKEN_SECRET,
            { expiresIn: "10m" },
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
    // 회원 정지 userSuspendedByAdmin
    t.nullable.field("userSuspendedByAdmin", {
      type: "AuthPayload",
      args: {
        user_id: nonNull(stringArg()),
        password: nonNull(stringArg()),
      },
      authorize: isAdmin,
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
            status: UserStatus.SUSPENDED,
          },
        });
        return {
          user: deleteUser,
        };
      },
    });
  },
});

const validUser = async (_: any, args: any, context: any) => {
  const { user_id } = args;
  let decoded: AuthTokenPayload = {
    userId: "",
    userRole: "",
  };
  const user = await context.prisma.user.findUnique({
    where: { user_id: user_id },
  });
  if (!user) {
    return false;
  }
  const token = context.req.headers.authorization.replace("Bearer ", "");
  try {
    decoded = jwt.verify(token, ACCESS_TOKEN_SECRET) as AuthTokenPayload;
    return decoded.userRole === "USER" && user.id === decoded.userId;
  } catch (error) {
    throw new GraphQLError("권한을 가진 사용자가 아닙니다.", {
      extensions: {
        code: "FORBIDDEN",
      },
    });
  }
};

const isAdmin = (_: any, __: any, context: any) => {
  const token = context.req.headers.authorization;
  let decoded: AuthTokenPayload = {
    userId: "",
    userRole: "",
  };
  try {
    decoded = jwt.verify(token, ACCESS_TOKEN_SECRET) as AuthTokenPayload;

    return decoded.userRole === "ADMIN";
  } catch (error) {
    throw new GraphQLError("관리자 권한이 필요합니다.", {
      extensions: {
        code: "FORBIDDEN",
      },
    });
  }
};
