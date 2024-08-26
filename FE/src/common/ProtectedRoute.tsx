import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { JwtPayload } from "#/utils/auth";
import { Navigate, useLocation } from "react-router-dom";
import { Alert } from "@material-tailwind/react";
import { useMutation } from "@apollo/client";
import { REFRESH_TOKEN_MUTATION } from "#/apollo/mutation";

const checkAuth = (): { isAuthenticated: boolean; userRole: string; needsRefresh: boolean } => {
  const token = localStorage.getItem("token");
  const refreshToken = localStorage.getItem("refresh_token");
  if (!token || !refreshToken) return { isAuthenticated: false, userRole: "", needsRefresh: false };

  try {
    const decodedToken = jwtDecode<JwtPayload>(token);
    const currentTime = Date.now() / 1000;

    if (decodedToken.exp < currentTime) {
      return { isAuthenticated: false, userRole: decodedToken.userRole, needsRefresh: true };
    }

    return { isAuthenticated: true, userRole: decodedToken.userRole, needsRefresh: false };
  } catch (e) {
    return { isAuthenticated: false, userRole: "", needsRefresh: false };
  }
};

export const ProtectedRoute: React.FC<{ children: React.ReactNode; allowedRoles: string[] }> = ({
  children,
  allowedRoles,
}) => {
  const [authState, setAuthState] = useState(checkAuth());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const location = useLocation();
  const [refreshUserFc] = useMutation(REFRESH_TOKEN_MUTATION);
  // const client = useApolloClient();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const refreshToken = async () => {
    setIsRefreshing(true);
    try {
      const refreshToken = localStorage.getItem("refresh_token");
      console.log("dkdkdk", refreshToken);
      if (!refreshToken) throw new Error("No refresh token");
      console.log(11);
      // const data = await client.mutate({
      //   mutation: REFRESH_TOKEN_MUTATION,
      //   variables: { refresh_token: refreshToken },
      // });
      // console.log("data", data);

      const result = refreshUserFc({
        errorPolicy: "all",
        variables: { refresh_token: refreshToken },
        onError(error) {
          console.log(error);
        },

        onCompleted(data) {
          console.log("끝", data);
        },
      });

      console.log(result);

      setAuthState(checkAuth());
      return true;
    } catch (error) {
      console.error("Failed to refresh token:", error);
      localStorage.removeItem("token");
      localStorage.removeItem("refresh_token");
      return false;
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (authState.needsRefresh) {
      refreshToken();
    }
  }, []);

  if (isRefreshing) {
    return <Alert>로그인을 갱신하는 중입니다.</Alert>;
  }

  if (!authState.isAuthenticated && !authState.needsRefresh) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  if (!allowedRoles.includes(authState.userRole)) {
    alert("접근 권한이 없습니다.");
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
