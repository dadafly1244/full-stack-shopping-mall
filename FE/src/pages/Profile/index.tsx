import Header from "#/common/HeaderUser";
import { Outlet } from "react-router-dom";

const ProfilePageLayout = () => {
  return (
    <div>
      <Header />
      <div className="max-w-screen-xl mx-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default ProfilePageLayout;
