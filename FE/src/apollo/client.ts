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
    alert("로그인 유지를 실패했습니다. 다시 로그인해주세요.");
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

const authLink = setContext(async (operation, { headers }) => {
  // 인증이 필요 없는 작업 목록
  const unauthenticatedOperations = ["signin", "signup"];

  const operationName = operation.operationName || "";
  // 현재 작업이 인증이 필요 없는 작업인지 확인
  if (unauthenticatedOperations.includes(operationName)) {
    return { headers };
  }

  const token = localStorage.getItem("token") || "";
  const refreshToken = localStorage.getItem("refresh_token") || "";

  if (token) {
    try {
      const decodedToken = jwtDecode<JwtPayload>(token);
      const currentTime = Date.now() / 1000;

      if (decodedToken.exp < currentTime) {
        // 토큰이 만료된 경우
        if (refreshToken) {
          const newTokens = await refreshAccessToken(refreshToken);
          console.log("newTokens:", newTokens);
          if (newTokens) {
            return {
              headers: {
                ...headers,
                authorization: `Bearer ${newTokens.token}`,
              },
            };
          }
        }
      } else {
        // 토큰이 유효한 경우
        return {
          headers: {
            ...headers,
            authorization: `Bearer ${token}`,
          },
        };
      }
    } catch (error) {
      console.error("Error decoding token:", error);
    }
  }

  return { headers };
});

const client = new ApolloClient({
  link: from([authLink, httpLink]),
  cache: new InMemoryCache(),
});

export default client;
