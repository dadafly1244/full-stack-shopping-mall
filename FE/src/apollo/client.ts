import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  from,
  split,
  ApolloLink,
} from "@apollo/client";
import { getToken, refreshToken, clearTokens } from "./tokenManagement";
import { onError } from "@apollo/client/link/error";

// const httpLink = createHttpLink({
//   uri: "http://localhost:4000/",
// });

// let refreshAttempts = 0;
// const MAX_REFRESH_ATTEMPTS = 3;

// const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
//   if (graphQLErrors) {
//     for (const err of graphQLErrors) {
//       if (isUnauthenticatedError(err as GraphQLError)) {
//         if (refreshAttempts >= MAX_REFRESH_ATTEMPTS) {
//           console.log("Max refresh attempts reached. Redirecting to login.");
//           redirectToLogin();
//           return;
//         }

//         return new Observable((observer) => {
//           refreshToken()
//             .then((newToken) => {
//               if (newToken) {
//                 const oldHeaders = operation.getContext().headers;
//                 operation.setContext({
//                   headers: {
//                     ...oldHeaders,
//                     authorization: `Bearer ${newToken}`,
//                   },
//                 });
//                 forward(operation).subscribe(observer);
//               } else {
//                 refreshAttempts++;
//                 if (refreshAttempts >= MAX_REFRESH_ATTEMPTS) {
//                   console.log("Max refresh attempts reached. Redirecting to login.");
//                   redirectToLogin();
//                 }
//                 observer.error(err);
//               }
//             })
//             .catch((error) => {
//               console.error("Error refreshing token:", error);
//               refreshAttempts++;
//               if (refreshAttempts >= MAX_REFRESH_ATTEMPTS) {
//                 console.log("Max refresh attempts reached. Redirecting to login.");
//                 redirectToLogin();
//               }
//               observer.error(error);
//             });
//         });
//       }
//     }
//   }
//   if (networkError) {
//     console.log(`[Network error]: ${networkError}`);
//   }
// });

// const authLink = setContext((operation, { headers }) => {
//   const unauthenticatedOperations = ["signin", "signup"];
//   const operationName = operation.operationName || "";

//   if (unauthenticatedOperations.includes(operationName)) {
//     return { headers };
//   }
//   const token = localStorage.getItem("token");
//   return {
//     headers: {
//       ...headers,
//       authorization: token ? `Bearer ${token}` : "",
//     },
//   };
// });

// const client = new ApolloClient({
//   link: from([authLink, httpLink, errorLink]),
//   cache: new InMemoryCache(),
// });

// async function refreshToken() {
//   const refreshToken = localStorage.getItem("refresh_token");
//   if (!refreshToken) return null;

//   try {
//     console.log("refresh");
//     const result = await client.mutate({
//       mutation: REFRESH_TOKEN_MUTATION,
//       variables: { refresh_token: refreshToken },
//       context: {
//         headers: {},
//       },
//     });

//     const newToken = result.data.refresh.token;
//     const newRefreshToken = result.data.refresh.refresh_token;

//     localStorage.setItem("token", newToken);
//     localStorage.setItem("refresh_token", newRefreshToken);

//     refreshAttempts = 0;

//     return newToken;
//   } catch (error) {
//     console.error("Error refreshing token:", error);
//     return null;
//   }
// }

// function isUnauthenticatedError(error: GraphQLError): boolean {
//   return error.extensions?.code === "UNAUTHENTICATED";
// }

// function redirectToLogin() {
//   localStorage.removeItem("token");
//   localStorage.removeItem("refresh_token");
//   window.location.href = "/signin";
// }

// export default client;
// const httpLink = createHttpLink({
//   uri: "http://localhost:4000/",
// });

// const authFetch = (uri: string, options: RequestInit) => {
//   const token = getToken();
//   const headers = {
//     ...options.headers,
//     authorization: token ? `Bearer ${token}` : "",
//   };
//   return fetch(uri, { ...options, headers });
// };

// const unauthFetch = (uri: string, options: RequestInit) => {
//   const headers = {
//     ...options.headers,
//     // Remove authorization header if it exists
//     authorization: "",
//   };
//   return fetch(uri, { ...options, headers });
// };

// // Create two separate links
// const authLink = new ApolloLink((operation, forward) => {
//   operation.setContext({
//     fetchOptions: {
//       fetch: authFetch,
//     },
//   });
//   return forward(operation);
// });

// const unauthLink = new ApolloLink((operation, forward) => {
//   operation.setContext({
//     fetchOptions: {
//       fetch: unauthFetch,
//     },
//   });
//   return forward(operation);
// });

// // Function to determine which link to use
// const isUnauthOperation = (operation: any) => {
//   const unauthOperations = ["signin", "signup"];
//   return unauthOperations.includes(operation.operationName);
// };

// // Split the links based on the operation
// const splitLink = split(isUnauthOperation, unauthLink, authLink);

// const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
//   if (graphQLErrors) {
//     for (const err of graphQLErrors) {
//       if (!err.extensions) return console.log("helloworld");
//       switch (err.extensions.code) {
//         case "UNAUTHENTICATED":
//           return new Promise((resolve, reject) => {
//             refreshToken(client)
//               .then((newToken) => {
//                 if (newToken) {
//                   // Retry the failed request
//                   const oldHeaders = operation.getContext().headers;
//                   operation.setContext({
//                     headers: {
//                       ...oldHeaders,
//                       authorization: `Bearer ${newToken}`,
//                     },
//                   });
//                   resolve(forward(operation));
//                 } else {
//                   console.log("안뇽1");
//                   // clearTokens();
//                   // window.location.href = "/signin";
//                   // reject(err);
//                 }
//               })
//               .catch((error) => {
//                 console.log("안뇽2");
//                 // clearTokens();
//                 // window.location.href = "/signin";
//                 reject(error);
//               });
//           });
//       }
//     }
//   }

//   if (networkError) {
//     console.log(`[Network error]: ${networkError}`);
//   }
// });

// const client = new ApolloClient({
//   link: from([errorLink, splitLink, httpLink]),
//   cache: new InMemoryCache(),
// });

// export default client;
