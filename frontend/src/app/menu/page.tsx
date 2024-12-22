import { getCustomerConfig } from "@/mock_db";
import MenuRender from "./MenuRender";
import { MenuResponse } from "@/generated/endpoints";

const MenuPage = async () => {
  const data = await getCustomerConfig();

  if (!data?.menu) return null;
  return <MenuRender data={data?.menu as MenuResponse} />;
};

export default MenuPage;
