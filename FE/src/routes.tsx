import { createBrowserRouter } from "react-router-dom";
import ErrorPage from "#/pages/ErrorPage";
import RootLayout from "#/pages/RootLayout";
import HomePage from "#/pages/Home";
import SigninPage from "./pages/Signin";
import SignupPage from "./pages/Signup";

const routes = [
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "",
        element: <HomePage />,
      },
      {
        path: "signin",
        element: <SigninPage />,
      },
      {
        path: "signup",
        element: <SignupPage />,
      },
    ],
  },
];

export const router = createBrowserRouter(routes);
