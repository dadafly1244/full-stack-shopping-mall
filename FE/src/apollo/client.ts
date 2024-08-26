import { ApolloClient, InMemoryCache, createHttpLink, from } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { REFRESH_TOKEN_MUTATION } from "#/apollo/mutation";
import { jwtDecode } from "jwt-decode";
import { JwtPayload } from "#/utils/auth";

const refreshAccessToken = async (refreshToken: string) => {
  try {
    const { data } = await client.mutate({
      mutation: REFRESH_TOKEN_MUTATION,
      variables: { refreshToken },
    });
    const { token, refresh_token } = data.refresh;
    localStorage.setItem("token", token);
    localStorage.setItem("refresh_token", refresh_token);
    return { token, refresh_token };
  } catch (error) {
    console.error("Error refreshing token:", error);
    localStorage.removeItem("token");
    localStorage.removeItem("refresh_token");
    window.location.href = "/signin";
    return null;
  }
};

const httpLink = createHttpLink({
  uri: "http://localhost:4000/",
});

let isRefreshing = false;
let refreshPromise: Promise<{
  token: string;
  refresh_token: string;
}> | null = null;

const authLink = setContext(async (operation, { headers }) => {
  const unauthenticatedOperations = ["/", "signin", "signup"];
  const operationName = operation.operationName || "";

  if (unauthenticatedOperations.includes(operationName)) {
    return { headers };
  }

  const token = localStorage.getItem("token");
  const refreshToken = localStorage.getItem("refresh_token");

  if (!token || !refreshToken) {
    return { headers };
  }

  try {
    const decodedToken = jwtDecode<JwtPayload>(token);
    const currentTime = Math.floor(Date.now() / 1000);

    if (decodedToken.exp < currentTime) {
      if (!isRefreshing) {
        isRefreshing = true;
        refreshPromise = refreshAccessToken(refreshToken) as Promise<{
          token: string;
          refresh_token: string;
        }> | null;
      }

      const newTokens = await refreshPromise;
      console.log("newTokens", newTokens);
      isRefreshing = false;
      refreshPromise = null;

      if (newTokens) {
        return {
          headers: {
            ...headers,
            authorization: `Bearer ${newTokens.token}`,
          },
        };
      }
    } else {
      console.log(22);
      return {
        headers: {
          ...headers,
          authorization: `Bearer ${token}`,
        },
      };
    }
  } catch (error) {
    console.error("Error in auth link:", error);
  }

  return { headers };
});

const client = new ApolloClient({
  link: from([authLink, httpLink]),
  cache: new InMemoryCache(),
});

export default client;
