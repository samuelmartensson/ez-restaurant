import { getCustomerConfig } from "@/mock_db";
import MenuRender from "./MenuRender";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Menu",
};

const MenuPage = async () => {
  const data = await getCustomerConfig();

  if (!data?.menu) return null;
  return (
    <>
      <MenuRender data={data.menu} currency={data?.currency ?? ""} />;
      <title>{`${data.siteTranslations?.menu} | ${data?.siteName}`}</title>
    </>
  );
};

export default MenuPage;
