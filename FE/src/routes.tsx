import { createBrowserRouter } from "react-router-dom";
import ErrorPage from "#/pages/ErrorPage";
import RootLayout from "#/pages/RootLayout";
import HomePage from "#/pages/Home";
import SigninPage from "./pages/Signin";
import SignupPage from "./pages/Signup";
import AdminLayout from "./pages/Admin";
import OrderInfoTab from "./pages/Admin/OrderInfo";
import ProductInfoTab from "./pages/Admin/ProductInfo";
import UserInfoTab from "./pages/Admin/UserInfo";
import { Navigate } from "react-router-dom";
import { ProtectedRoute } from "#/common/ProtectedRoute";

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
  {
    path: "/admin",
    element: (
      <ProtectedRoute allowedRoles={["ADMIN"]}>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: "user-info", element: <UserInfoTab /> },
      { path: "product-info", element: <ProductInfoTab /> },
      { path: "order-info", element: <OrderInfoTab /> },
      { index: true, element: <Navigate to="/admin/user-info" replace /> },
    ],
  },
];

export const router = createBrowserRouter(routes);
