import { makeSchema } from "nexus";
import { join } from "path";
import * as types from "./types/index";
export const schema = makeSchema({
  types,
  plugins: [],
  outputs: {
    schema: join(__dirname, "generated/schema.graphql"),
    typegen: join(__dirname, "generated/nexus.ts"),
  },
  contextType: {
    module: join(__dirname, "context.ts"),
    export: "Context",
  },
  sourceTypes: {
    modules: [
      {
        module: "@prisma/client",
        alias: "prisma",
      },
    ],
  },
});
