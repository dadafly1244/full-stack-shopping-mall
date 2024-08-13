import {
  makeSchema,
  fieldAuthorizePlugin,
  scalarType,
  asNexusMethod,
} from "nexus";
import { DateTimeResolver } from "graphql-scalars";
import { join } from "path";
import * as allTypes from "#/graphql/types";
import * as Resolvers from "#/graphql/resolvers";

export const JSONScalar = scalarType({
  name: "JSON",
  asNexusMethod: "json",
  // check out graphql-type-json for inspiration on how to handle the rest of the scalar constructor
});

export const GQLDate = asNexusMethod(DateTimeResolver, "date");

export const schema = makeSchema({
  types: [allTypes, Resolvers, JSONScalar, GQLDate],
  plugins: [fieldAuthorizePlugin()],
  shouldGenerateArtifacts: true,
  outputs: {
    schema: join(process.cwd(), "generated/schema.graphql"),
    typegen: join(process.cwd(), "generated/nexusTypes.ts"),
  },
  contextType: {
    module: join(process.cwd(), "src/apollo/context.ts"),
    export: "Context",
  },
  sourceTypes: {
    modules: [
      {
        module: "@prisma/client",
        alias: "prisma",
      },
    ],
    mapping: {
      Date: "Date",
      DateTime: "Date",
      UUID: "string",
    },
  },
});
