import Cookies from "js-cookie";

export const isAuthenticated = () => {
  const token = Cookies.get("token"); // 쿠키에서 토큰을 확인
  return !!token; // 토큰이 있으면 true, 없으면 false 반환
};
