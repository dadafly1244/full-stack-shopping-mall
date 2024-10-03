import { createBrowserRouter } from "react-router-dom";
import ErrorPage from "#/pages/ErrorPage";
import RootLayout from "#/pages/RootLayout";
import HomePage from "#/pages/Home";
import SearchResult from "#/pages/Home/SearchResult";
import ProductDetail from "#/pages/Home/ProductDetail";
import SigninPage from "#/pages/Signin";
import SignupPage from "#/pages/Signup";
import AdminLayout from "#/pages/Admin";
import OrderInfoTab from "#/pages/Admin/OrderInfo";
import ProductInfoTab from "#/pages/Admin/ProductInfo";
import UserInfoTab from "#/pages/Admin/UserInfo";
import { Navigate } from "react-router-dom";
import { ProtectedRoute } from "#/common/ProtectedRoute";
import CreateProduct from "#/pages/Admin/CreateProduct";
import UpdateProduct from "#/pages/Admin/UpdateProduct";
import ProfilePageLayout from "#/pages/Profile";
import OrderSheet from "#/pages/Profile/OrderSheet";
import OrderDetail from "#/pages/Profile/OrderDetail";
import PaymentList from "#/pages/Profile/PaymentList";
import Cart from "#/pages/Profile/Cart";
import MyProfile from "#/pages/Profile/MyProfile";
import UserIndexRedirect from "#/pages/Profile/UserIndexRedirect";
import OrderIndexRedirect from "#/pages/Profile/OrderIndexRedirect";

const routes = [
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    handle: { title: "홈" },
    children: [
      {
        index: true,
        path: "",
        element: <HomePage />,
        handle: { title: "메인 페이지", description: "환영합니다!", action: "view" },
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
      {
        path: "product/search",
        element: <SearchResult />,
        handle: { title: "검색 결과", description: "상품 검색 결과", action: "view" },
      },
      {
        path: "product/detail/:productId",
        element: <ProductDetail />,
        handle: { title: "상품 상세 페이지", description: "상품 상세 페이지", action: "view" },
      },
    ],
  },
  {
    path: "/user/:userId",
    element: (
      <ProtectedRoute allowedRoles={["USER", "ADMIN"]}>
        <ProfilePageLayout />
      </ProtectedRoute>
    ),
    handle: { title: "My", requiresAuth: true, role: "USER" },
    children: [
      {
        path: "profile",
        element: <MyProfile />,
        handle: { title: "정보 관리" },
      },
      {
        path: "cart",
        element: <Cart />,
        handle: { title: "장바구니" },
      },
      {
        path: "order",
        handle: { title: "주문" },
        children: [
          {
            path: "sheet", // 주문서
            element: <OrderSheet />,
            handle: { title: "" },
          },
          {
            path: "status/:orderId", // 주문 상세 페이지
            element: <OrderDetail />,
            handle: { title: "상세 페이지" },
          },
          { index: true, element: <OrderIndexRedirect /> },
        ],
      },
      {
        path: "pay",
        handle: { title: "결제내역" },
        element: <PaymentList />,
      },
      { index: true, element: <UserIndexRedirect /> },
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
            handle: { action: "view" },
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
