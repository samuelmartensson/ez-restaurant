import SubPageLayout from "@/components/SubPageLayout";
import React from "react";
import AdminMenu from "./menu/page";

const Admin = async () => {
  return (
    <SubPageLayout title="Admin">
      <AdminMenu />
    </SubPageLayout>
  );
};

export default Admin;
