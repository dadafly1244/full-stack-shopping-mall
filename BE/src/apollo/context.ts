import { PrismaClient } from "@prisma/client";
import { decodeAuthHeader } from "#/utils/auth";
import { Request, Response } from "express";

const prisma = new PrismaClient();

export interface Context {
  prisma: PrismaClient;
  userId?: string;
  userRole?: string;
}

export interface ContextFunction {
  (context: { req: any; res: any }): Promise<Context>;
}

export const createContext: ContextFunction = async ({ req }) => {
  const token =
    req && req.headers.authorization
      ? decodeAuthHeader(req.headers.authorization)
      : null;

  return {
    prisma,
    userId: token?.userId,
    userRole: token?.userRole,
  };
};
