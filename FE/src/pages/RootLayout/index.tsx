import { Outlet } from "react-router-dom";
import NavBar from "#/common/NavBar";

const RootLayout = () => {
  return (
    <div>
      <NavBar />
      <Outlet />
    </div>
  );
};

export default RootLayout;
