import "tsconfig-paths/register";

import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { PrismaClient } from "@prisma/client";
import { schema } from "#/schema";
import { createContext } from "#/apollo/context";

const prisma = new PrismaClient();

async function startServer() {
  const server = new ApolloServer({
    schema: schema,
  });

  const { url } = await startStandaloneServer(server, {
    context: createContext,
    listen: { port: 4000 },
  });

  console.log(`🚀 Server ready at ${url}`);
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
