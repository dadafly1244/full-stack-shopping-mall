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
import CreateProduct from "#/pages/Admin/CreateProduct";
import UpdateProduct from "#/pages/Admin/UpdateProduct";

const routes = [
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    handle: { title: "홈" },
    children: [
      {
        path: "",
        element: <HomePage />,
        handle: { title: "메인 페이지", description: "환영합니다!" },
      },
      {
        path: "signin",
        element: <SigninPage />,
        handle: { title: "로그인", requiresAuth: false },
      },
      {
        path: "signup",
        element: <SignupPage />,
        handle: { title: "회원가입", requiresAuth: false },
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
    handle: { title: "관리자", requiresAuth: true, role: "ADMIN" },
    children: [
      {
        path: "user-info",
        element: <UserInfoTab />,
        handle: { title: "사용자 정보" },
      },
      {
        path: "product-info",
        handle: { title: "상품 정보" },
        children: [
          {
            index: true,
            path: "",
            element: <ProductInfoTab />,
            handle: { title: "상품 목록", action: "view" },
          },
          {
            path: "new-product",
            element: <CreateProduct />,
            handle: { title: "새 상품 등록", action: "create" },
          },
          {
            path: "edit/:productId",
            element: <UpdateProduct />,
            handle: { title: "상품 상세 및 수정", action: "edit" },
          },
        ],
      },
      {
        path: "order-info",
        element: <OrderInfoTab />,
        handle: { title: "주문 정보" },
      },
      { index: true, element: <Navigate to="/admin/user-info" replace /> },
    ],
  },
];

export const router = createBrowserRouter(routes);

// const routes = [
//   {
//     path: "/",
//     element: <RootLayout />,
//     errorElement: <ErrorPage />,
//     children: [
//       {
//         path: "",
//         element: <HomePage />,
//       },
//       {
//         path: "signin",
//         element: <SigninPage />,
//       },
//       {
//         path: "signup",
//         element: <SignupPage />,
//       },
//     ],
//   },
//   {
//     path: "/admin",
//     element: (
//       <ProtectedRoute allowedRoles={["ADMIN"]}>
//         <AdminLayout />
//       </ProtectedRoute>
//     ),
//     children: [
//       { path: "user-info", element: <UserInfoTab /> },
//       {
//         path: "product-info",
//         children: [
//           { index: true, path: "", element: <ProductInfoTab /> },
//           { path: "new-product", element: <CreateProduct /> },
//           { path: "edit/:productId", element: <UpdateProduct /> },
//         ],
//       },
//       { path: "order-info", element: <OrderInfoTab /> },
//       { index: true, element: <Navigate to="/admin/user-info" replace /> },
//     ],
//   },
// ];

// export const router = createBrowserRouter(routes);
