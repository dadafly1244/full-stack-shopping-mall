import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { FieldResolver } from "nexus";

export interface AuthTokenPayload {
  userId: string;
  userRole: string;
}

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || "";
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || "";

export function decodeAuthHeader(authHeader: String): AuthTokenPayload {
  const token = authHeader.replace("Bearer ", "");

  if (!token) {
    throw new Error("No token found");
  }

  let verified = jwt.verify(token, ACCESS_TOKEN_SECRET) as AuthTokenPayload;

  return verified;
}

export function verifyToken(token: string, secret: string): AuthTokenPayload {
  try {
    return jwt.verify(token, secret) as AuthTokenPayload;
  } catch (error) {
    throw new Error("Invalid token");
  }
}
