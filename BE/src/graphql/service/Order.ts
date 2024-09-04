import { ApolloServerErrorCode } from "@apollo/server/errors";
import { GraphQLError } from "graphql";

export function createError(message: string, code: string) {
  return new GraphQLError(message, {
    extensions: { code: code },
  });
}
