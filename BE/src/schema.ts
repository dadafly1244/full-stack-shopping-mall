import {
  makeSchema,
  fieldAuthorizePlugin,
  scalarType,
  asNexusMethod,
  mutationType,
} from "nexus";
import { DateTimeResolver } from "graphql-scalars";
import { join } from "path";
import * as allTypes from "#/graphql/types";
import * as Resolvers from "#/graphql/resolvers";
import { GraphQLJSON } from "graphql-type-json";

export const JSONScalar = asNexusMethod(GraphQLJSON, "json");
export const Upload = scalarType({
  name: "Upload",
  asNexusMethod: "upload",
  description: "The `Upload` scalar type represents a file upload.",
  serialize: (value) => value,
  parseValue: (value) => value,
  parseLiteral: (ast) => ast,
});

const Mutation = mutationType({
  definition(t) {
    t.field("uploadFile", {
      type: "Boolean",
      args: {
        file: "Upload",
      },
      resolve: async (_, { file }) => {
        const { createReadStream, filename } = await file;
        const stream = createReadStream();

        // Here you would typically save the file to your desired location
        // For example, using the fs module to write to the static folder:
        // const path = `./static/${filename}`;
        // await new Promise((resolve, reject) => {
        //   const writeStream = fs.createWriteStream(path);
        //   stream.pipe(writeStream);
        //   writeStream.on('finish', resolve);
        //   writeStream.on('error', reject);
        // });

        console.log(`File ${filename} uploaded successfully`);
        return true;
      },
    });
  },
});
export const GQLDate = asNexusMethod(DateTimeResolver, "date");

export const schema = makeSchema({
  types: [allTypes, Resolvers, JSONScalar, GQLDate, Upload, Mutation],
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
      Upload: "Promise<File>",
    },
  },
});
