import React from "react";
import { jwtDecode } from "jwt-decode";
import { JwtPayload } from "#/utils/auth";
import { Navigate, useLocation } from "react-router-dom";
// import { Alert } from "@material-tailwind/react";
// import { useMutation } from "@apollo/client";
// import { REFRESH_TOKEN_MUTATION } from "#/apollo/mutation";

// 인증 상태를 확인하는 함수
const checkAuth = (): { isAuthenticated: boolean; userRole: string } => {
  const token = localStorage.getItem("token");
  if (!token) return { isAuthenticated: false, userRole: "" };

  try {
    const decodedToken = jwtDecode<JwtPayload>(token);
    const currentTime = Date.now() / 1000;

    if (decodedToken.exp < currentTime) {
      return { isAuthenticated: false, userRole: "" };
    }

    return { isAuthenticated: true, userRole: decodedToken.userRole };
  } catch (e) {
    return { isAuthenticated: false, userRole: "" };
  }
};

// 보호된 라우트 컴포넌트
export const ProtectedRoute: React.FC<{ children: React.ReactNode; allowedRoles: string[] }> = ({
  children,
  allowedRoles,
}) => {
  const { userRole } = checkAuth();

  // const location = useLocation();

  // if (!isAuthenticated) {
  //   return <Navigate to="/signin" state={{ from: location }} replace />;
  // }

  if (!allowedRoles.includes(userRole)) {
    alert("접근 권한이 없습니다.");
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
};
