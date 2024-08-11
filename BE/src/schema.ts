import { makeSchema, scalarType, asNexusMethod } from "nexus";
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
  plugins: [],
  shouldGenerateArtifacts: false,
  outputs: {
    schema: join(__dirname, "generated/schema.graphql"),
    typegen: join(__dirname, "generated/nexusTypes.ts"),
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
    mapping: {
      Date: "Date",
      DateTime: "Date",
      UUID: "string",
    },
  },
});
