import SubPageLayout from "@/components/SubPageLayout";
import React from "react";

const MenuLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return <SubPageLayout title="Menu">{children}</SubPageLayout>;
};

export default MenuLayout;
