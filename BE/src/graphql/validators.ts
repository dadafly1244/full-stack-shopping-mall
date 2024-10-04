import { GraphQLError } from "graphql";
import { AuthTokenPayload } from "#/utils/auth";
import jwt from "jsonwebtoken";
import { UserPermissions } from "@prisma/client";
export const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || "";
export const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || "";

export const validUser = async (_: any, args: any, context: any) => {
  const { user_id } = args;
  let decoded: AuthTokenPayload = {
    userId: "",
    userRole: "",
  };
  const user = await context.prisma.user.findUnique({
    where: { id: user_id },
  });

  if (!user) {
    throw new GraphQLError("사용자를 찾을 수 없습니다.", {
      extensions: {
        code: "FORBIDDEN",
      },
    });
  }

  const token = context.req.headers.authorization.replace("Bearer ", "");
  // console.log("token", token);
  try {
    console.log(1);
    decoded = jwt.verify(token, ACCESS_TOKEN_SECRET) as AuthTokenPayload;
    console.log(2);
    console.log("user", decoded);
    console.log("decoded", decoded.userId, decoded.userRole);
    console.log(
      "decoded.userRole === UserPermissions.USER && user.id === decoded.userId",
      decoded.userRole,
      user.permissions,
      user.id,
      decoded.userId,
    );
    return decoded.userRole === user.permissions && user.id === decoded.userId;
  } catch (error) {
    throw new GraphQLError("권한을 가진 사용자가 아닙니다.", {
      extensions: {
        code: "FORBIDDEN",
      },
    });
  }
};

export const isAdmin = (_: any, __: any, context: any) => {
  const token = context.req.headers.authorization.replace("Bearer ", "");
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

export const isAuthenticated = (_: any, __: any, context: any) => {
  const authHeader = context.req.headers.authorization;
  if (!authHeader) {
    throw new GraphQLError("인증 토큰이 없습니다.", {
      extensions: {
        code: "UNAUTHENTICATED",
      },
    });
  }

  const token = authHeader.replace("Bearer ", "");
  try {
    const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET) as AuthTokenPayload;
    context.user = { id: decoded.userId, role: decoded.userRole };
    return true;
  } catch (error) {
    throw new GraphQLError("유효하지 않은 토큰입니다.", {
      extensions: {
        code: "UNAUTHENTICATED",
      },
    });
  }
};
