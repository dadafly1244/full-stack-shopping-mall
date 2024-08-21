import React from "react";
import { Outlet } from "react-router-dom";
import { Tab } from "#/common/Tabs";

const AdminLayout: React.FC = () => {
  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <nav className="flex border-b mb-4">
        <Tab to="/admin/user-info" label="User" />
        <Tab to="/admin/product-info" label="Product" />
        <Tab to="/admin/order-info" label="Order" />
      </nav>
      <Outlet />
    </div>
  );
};

export default AdminLayout;
