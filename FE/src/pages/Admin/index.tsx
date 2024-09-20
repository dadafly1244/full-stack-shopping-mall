import { Outlet } from "react-router-dom";
import HeaderAdmin from "#/common/HeaderAdmin";

const AdminLayout = () => {
  return (
    <div className="font-sans">
      <HeaderAdmin />
      <div className="flex flex-col justify-center content-center">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
