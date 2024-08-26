import { Link } from "react-router-dom";
import { Button } from "@material-tailwind/react";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { JwtPayload } from "#/utils/auth";

const HomePage = () => {
  const token = localStorage.getItem("token") || "";

  const [isShowAdminButton, setIsShowAdminButton] = useState(false);
  useEffect(() => {
    if (!token) return;
    const decodedToken = jwtDecode<JwtPayload>(token);
    if (!decodedToken) setIsShowAdminButton(false);
    if (decodedToken.userRole === "ADMIN") setIsShowAdminButton(true);
    else setIsShowAdminButton(false);
  }, [token, isShowAdminButton]);
  return (
    <div className="h-10 w-full max-w-screen-xl bg-red-100">
      <div className="">
        홈입니다다다다다다다
        {isShowAdminButton && (
          <Button color="blue" type="submit" size="md">
            <Link to="/admin">관리자 페이지</Link>
          </Button>
        )}
      </div>
    </div>
  );
};

export default HomePage;
