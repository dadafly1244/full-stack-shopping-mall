import { ApolloClient } from "@apollo/client";
import { REFRESH_TOKEN_MUTATION } from "#/apollo/mutation";

export async function refreshToken(client: ApolloClient<any>): Promise<string | null> {
  console.log("Refreshing token");
  const refreshToken = localStorage.getItem("refresh_token");
  if (!refreshToken) {
    console.log("No refresh token found");
    return null;
  }

  try {
    console.log("Sending refresh token mutation");
    const result = await client.mutate({
      mutation: REFRESH_TOKEN_MUTATION,
      variables: { refresh_token: refreshToken },
    });
    console.log("Received response from refresh token mutation");

    if (result.data && result.data.refresh) {
      const newToken = result.data.refresh.token;
      const newRefreshToken = result.data.refresh.refresh_token;

      if (newToken && newRefreshToken) {
        console.log("Storing new tokens in localStorage");
        localStorage.setItem("token", newToken);
        localStorage.setItem("refresh_token", newRefreshToken);

        console.log("Token refreshed successfully");
        return newToken;
      } else {
        console.log("New tokens are missing in the response");
        return null;
      }
    } else {
      console.log("Unexpected response structure from refresh mutation");
      return null;
    }
  } catch (error) {
    console.error("Error refreshing token:", error);
    return null;
  }
}

export function getToken(): string | null {
  return localStorage.getItem("token");
}

export function setTokens(token: string, refreshToken: string): void {
  localStorage.setItem("token", token);
  localStorage.setItem("refresh_token", refreshToken);
}

export function clearTokens(): void {
  localStorage.removeItem("token");
  localStorage.removeItem("refresh_token");
}
