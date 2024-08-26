import { Outlet } from "react-router-dom";
import NavBar from "#/common/NavBar";

const RootLayout = () => {
  return (
    <div>
      <NavBar />
      <div className="flex justify-center content-center">
        <Outlet />
      </div>
    </div>
  );
};

export default RootLayout;
