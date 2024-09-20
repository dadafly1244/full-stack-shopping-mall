import { Outlet } from "react-router-dom";
import Header from "#/common/Header";
import { useLocation } from "react-router-dom";

const RootLayout = () => {
  const location = useLocation();
  if (["/signin", "/signup"].includes(location.pathname)) {
    return (
      <div className="font-sans">
        <div className="flex flex-col justify-center content-center">
          <Outlet />
        </div>
      </div>
    );
  }
  return (
    <div className="font-sans">
      <Header />
      <div className="flex flex-col justify-center content-center">
        <Outlet />
      </div>
    </div>
  );
};

export default RootLayout;
