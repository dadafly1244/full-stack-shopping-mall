import { ApolloClient, InMemoryCache, from } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
import { createUploadLink } from "apollo-upload-client";

const httpLink = createUploadLink({
  uri: "http://localhost:4000/graphql",
  headers: {
    "x-apollo-operation-name": "UploadFiles",
    "apollo-require-preflight": "true",
  },
});

const errorLink = onError(({ graphQLErrors, networkError }) => {
  console.log("error");
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message }) => {
      if (message.includes("jwt expired") || message.includes("Please Sign in")) {
        try {
          localStorage.removeItem("token");
          alert("login token is expired. please retry login");
          location.replace("/signin");
        } catch (error) {
          console.error(error);
        }
      }
    });
  }
  if (networkError) {
    console.error(networkError);
  }
});

const authLink = setContext(async (_, { headers }) => {
  const token = localStorage.getItem("token");

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const client = new ApolloClient({
  link: from([errorLink, authLink.concat(httpLink)]),
  cache: new InMemoryCache(),
});

export default client;
