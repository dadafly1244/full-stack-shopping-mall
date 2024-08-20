import { GraphQLError } from "graphql";
import { AuthTokenPayload } from "#/utils/auth";
import jwt from "jsonwebtoken";
export const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || "";
export const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || "";

export const validUser = async (_: any, args: any, context: any) => {
  const { user_id } = args;
  let decoded: AuthTokenPayload = {
    userId: "",
    userRole: "",
  };
  const user = await context.prisma.user.findUnique({
    where: { user_id: user_id },
  });
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

export const isAdmin = (_: any, __: any, context: any) => {
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
