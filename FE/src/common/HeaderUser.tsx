import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Navbar, Typography, Collapse, Button, IconButton, Alert } from "@material-tailwind/react";
import { SIGNOUT_USER_ADMIN } from "#/apollo/mutation";
import { useMutation } from "@apollo/client";
import { jwtDecode } from "jwt-decode";
import { JwtPayload } from "#/utils/auth";
import { useLocation } from "react-router-dom";
import LogoImage from "#/assets/logo.png";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [openNav, setOpenNav] = useState(false);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [currentId, setCurrentId] = useState("");

  useEffect(() => {
    setToken(localStorage.getItem("token") || "");
  }, [location]);

  const refreshToken = localStorage.getItem("refresh_token") || "";
  const [signout, { loading, error: signoutError }] = useMutation(SIGNOUT_USER_ADMIN);
  const handleSignout = async () => {
    if (token) {
      try {
        const decodedToken = jwtDecode<JwtPayload>(token);
        await signout({
          variables: {
            id: decodedToken?.userId,
          },
          onCompleted: () => {
            localStorage.setItem("token", "");
            localStorage.setItem("refresh_token", "");
            navigate("/", { replace: true });
          },
        });
      } catch (error) {
        console.error("sign out error", error);
      }
    }
  };

  const [isShowAdminButton, setIsShowAdminButton] = useState(false);
  useEffect(() => {
    if (!token) {
      return;
    }
    const decodedToken = jwtDecode<JwtPayload>(token);
    if (!decodedToken) setIsShowAdminButton(false);
    setCurrentId(decodedToken.userId);
    if (decodedToken.userRole === "ADMIN") setIsShowAdminButton(true);
    else setIsShowAdminButton(false);
  }, [token, isShowAdminButton]);

  if (signoutError) {
    <Alert color="red">로그아웃을 다시 시도해 주세요.</Alert>;
  }
  useEffect(() => {
    window.addEventListener("resize", () => window.innerWidth >= 960 && setOpenNav(false));
  }, []);

  const navList = (
    <ul className="mt-2 mb-4 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6">
      <Typography
        as="li"
        variant="small"
        color="blue-gray"
        className="flex items-center gap-x-2 p-1 font-medium"
      >
        <svg
          width="16"
          height="17"
          viewBox="0 0 16 17"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M16 8.5C16 10.6217 15.1571 12.6566 13.6569 14.1569C12.1566 15.6571 10.1217 16.5 8 16.5C5.87827 16.5 3.84344 15.6571 2.34315 14.1569C0.842855 12.6566 0 10.6217 0 8.5C0 6.37827 0.842855 4.34344 2.34315 2.84315C3.84344 1.34285 5.87827 0.5 8 0.5C10.1217 0.5 12.1566 1.34285 13.6569 2.84315C15.1571 4.34344 16 6.37827 16 8.5ZM10 5.5C10 6.03043 9.78929 6.53914 9.41421 6.91421C9.03914 7.28929 8.53043 7.5 8 7.5C7.46957 7.5 6.96086 7.28929 6.58579 6.91421C6.21071 6.53914 6 6.03043 6 5.5C6 4.96957 6.21071 4.46086 6.58579 4.08579C6.96086 3.71071 7.46957 3.5 8 3.5C8.53043 3.5 9.03914 3.71071 9.41421 4.08579C9.78929 4.46086 10 4.96957 10 5.5ZM8 9.5C7.0426 9.49981 6.10528 9.77449 5.29942 10.2914C4.49356 10.8083 3.85304 11.5457 3.454 12.416C4.01668 13.0706 4.71427 13.5958 5.49894 13.9555C6.28362 14.3152 7.13681 14.5009 8 14.5C8.86319 14.5009 9.71638 14.3152 10.5011 13.9555C11.2857 13.5958 11.9833 13.0706 12.546 12.416C12.147 11.5457 11.5064 10.8083 10.7006 10.2914C9.89472 9.77449 8.9574 9.49981 8 9.5Z"
            fill="#90A4AE"
          />
        </svg>
        <NavLink to={`/user/${currentId}/profile`} className="flex items-center">
          My Profile
        </NavLink>
        <NavLink
          to={`/user/${currentId}/cart`}
          className="flex items-center after:content-['|'] after:text-gray-400 after:mx-2"
        >
          장바구니
        </NavLink>
        <NavLink
          to={`/user/${currentId}/pay`}
          className="flex items-center after:content-['|'] after:text-gray-400 after:mx-2"
        >
          결제내역
        </NavLink>
      </Typography>
    </ul>
  );

  return (
    <Navbar className="sticky top-0 z-10 h-max max-w-full rounded-none px-4 py-2 lg:px-8 lg:py-4 shadow-none bg-white border-b border-solid border-blue-gray-50">
      <ul className="hidden mt-1 mb-2 lg:flex flex-row lg:mb-0 lg:mt-0 justify-center lg:content-center lg:max-w-screen-xl lg:w-full lg:mx-auto lg:justify-between">
        <NavLink to="/" className="flex flex-start items-center space-x-3 rtl:space-x-reverse">
          <img src={LogoImage} alt="infofla(인포플라) 로고" className="h-8" />
        </NavLink>

        <div className="flex items-center gap-x-1">
          {token && refreshToken ? (
            <>
              <Typography
                as="li"
                variant="small"
                color="blue-gray"
                className="flex items-center gap-x-2 p-1 font-medium"
              >
                <svg
                  width="16"
                  height="17"
                  viewBox="0 0 16 17"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M16 8.5C16 10.6217 15.1571 12.6566 13.6569 14.1569C12.1566 15.6571 10.1217 16.5 8 16.5C5.87827 16.5 3.84344 15.6571 2.34315 14.1569C0.842855 12.6566 0 10.6217 0 8.5C0 6.37827 0.842855 4.34344 2.34315 2.84315C3.84344 1.34285 5.87827 0.5 8 0.5C10.1217 0.5 12.1566 1.34285 13.6569 2.84315C15.1571 4.34344 16 6.37827 16 8.5ZM10 5.5C10 6.03043 9.78929 6.53914 9.41421 6.91421C9.03914 7.28929 8.53043 7.5 8 7.5C7.46957 7.5 6.96086 7.28929 6.58579 6.91421C6.21071 6.53914 6 6.03043 6 5.5C6 4.96957 6.21071 4.46086 6.58579 4.08579C6.96086 3.71071 7.46957 3.5 8 3.5C8.53043 3.5 9.03914 3.71071 9.41421 4.08579C9.78929 4.46086 10 4.96957 10 5.5ZM8 9.5C7.0426 9.49981 6.10528 9.77449 5.29942 10.2914C4.49356 10.8083 3.85304 11.5457 3.454 12.416C4.01668 13.0706 4.71427 13.5958 5.49894 13.9555C6.28362 14.3152 7.13681 14.5009 8 14.5C8.86319 14.5009 9.71638 14.3152 10.5011 13.9555C11.2857 13.5958 11.9833 13.0706 12.546 12.416C12.147 11.5457 11.5064 10.8083 10.7006 10.2914C9.89472 9.77449 8.9574 9.49981 8 9.5Z"
                    fill="#90A4AE"
                  />
                </svg>
                <NavLink
                  to={`/user/${currentId}/profile`}
                  className="flex items-center after:content-['|'] after:text-gray-400 after:mx-2"
                >
                  My Profile
                </NavLink>
                <NavLink
                  to={`/user/${currentId}/cart`}
                  className="flex items-center after:content-['|'] after:text-gray-400 after:mx-2"
                >
                  장바구니
                </NavLink>
                <NavLink
                  to={`/user/${currentId}/pay`}
                  className="flex items-center after:content-['|'] after:text-gray-400 after:mx-2"
                >
                  결제내역
                </NavLink>
                <Button
                  loading={loading}
                  variant="text"
                  size="sm"
                  onClick={handleSignout}
                  className="text-black text-xs p-1 font-normal"
                >
                  Sign out
                </Button>
              </Typography>
            </>
          ) : (
            <>
              <NavLink
                to="/signin"
                className="text-black text-sm after:content-['|'] after:text-gray-400 after:mx-2"
              >
                Sign in
              </NavLink>
              <NavLink to="/signup" className="text-black  text-sm">
                Sign up
              </NavLink>
            </>
          )}
        </div>
      </ul>

      <div className="flex">
        <div className="hidden sm:flex flex-row justify-end gap-x-2 sm:flex-row sm:items-center ml-auto lg:hidden">
          <div className="relative w-full gap-2 md:w-max">
            <div className="!absolute left-3 top-[13px]">
              <svg
                width="13"
                height="14"
                viewBox="0 0 14 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M13 13.5L9 9.5M10.3333 6.16667C10.3333 6.7795 10.2126 7.38634 9.97811 7.95252C9.74358 8.51871 9.39984 9.03316 8.9665 9.4665C8.53316 9.89984 8.01871 10.2436 7.45252 10.4781C6.88634 10.7126 6.2795 10.8333 5.66667 10.8333C5.05383 10.8333 4.447 10.7126 3.88081 10.4781C3.31462 10.2436 2.80018 9.89984 2.36683 9.4665C1.93349 9.03316 1.58975 8.51871 1.35523 7.95252C1.12071 7.38634 1 6.7795 1 6.16667C1 4.92899 1.49167 3.742 2.36683 2.86683C3.242 1.99167 4.42899 1.5 5.66667 1.5C6.90434 1.5 8.09133 1.99167 8.9665 2.86683C9.84167 3.742 10.3333 4.92899 10.3333 6.16667Z"
                  stroke="#CFD8DC"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </div>
        <IconButton
          variant="text"
          className="bg-red-300 ml-5 h-6 w-6 text-inherit hover:bg-transparent focus:bg-transparent active:bg-transparent lg:hidden sm:block"
          ripple={false}
          onClick={() => setOpenNav(!openNav)}
        >
          {openNav ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              className="h-6 w-6"
              viewBox="0 0 24 24"
              stroke="#90A4AE"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="#90A4AE"
              stroke="#90A4AE"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </IconButton>
      </div>
      <Collapse open={openNav}>
        <div className="container mx-auto">
          {navList}
          <div className="flex flex-col gap-x-2">
            <div className="flex justify-start items-center gap-x-1 my-10">
              {token || refreshToken ? (
                <div className="flex flex-col w-full gap-10">
                  {isShowAdminButton && (
                    <NavLink to="/admin" className="text-blue-gray-200 text-sm">
                      관리자 페이지
                    </NavLink>
                  )}
                  <Button
                    loading={loading}
                    fullWidth
                    variant="outlined"
                    size="sm"
                    onClick={handleSignout}
                  >
                    <span>Sign out</span>
                  </Button>
                </div>
              ) : (
                <>
                  <NavLink to="/signin" className="text-black">
                    Sign in
                  </NavLink>
                  <NavLink to="/signup" className="text-black">
                    Sign up
                  </NavLink>
                </>
              )}
            </div>
          </div>
        </div>
      </Collapse>
    </Navbar>
  );
};

export default Header;
