import "tsconfig-paths/register";
import express from "express";
import http from "http";
import cors from "cors";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { PrismaClient } from "@prisma/client";
import { schema } from "#/schema";
import { createContext } from "#/apollo/context";
import path from "path";
import { graphqlUploadExpress } from "graphql-upload-minimal";

const prisma = new PrismaClient();

async function startServer() {
  const app = express();
  const httpServer = http.createServer(app);

  const server = new ApolloServer({
    schema: schema,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });

  await server.start();

  // Static folder setup
  app.use(express.static(path.join(__dirname, "static")));

  app.use("/uploads", express.static(path.join(__dirname, "../", "uploads")));

  // File upload middleware
  app.use(graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 }));

  const corsOptions = {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  };

  app.use(
    "/graphql",
    cors<cors.CorsRequest>(corsOptions),
    express.json(),
    expressMiddleware(server, {
      context: async ({ req, res }) => {
        return createContext({ req, res });
      },
    }),
  );

  await new Promise<void>((resolve) =>
    httpServer.listen({ port: 4000 }, resolve),
  );

  console.log(`🚀 Server ready at http://localhost:4000/graphql`);
}

startServer().catch((error) => {
  console.error("Error starting server:", error);
  process.exit(1);
});

// 애플리케이션 종료 시 Prisma 연결 닫기
process.on("SIGINT", () => {
  prisma.$disconnect();
  process.exit(0);
});
