import { Outlet } from "react-router-dom";
import NavBar from "#/common/NavBar";

const RootLayout = () => {
  return (
    <div className="font-sans">
      <NavBar />
      <div className="flex flex-col justify-center content-center">
        <Outlet />
      </div>
    </div>
  );
};

export default RootLayout;
