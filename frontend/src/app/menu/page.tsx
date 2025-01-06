import { getCustomerConfig } from "@/mock_db";
import MenuRender from "./MenuRender";

const MenuPage = async () => {
  const data = await getCustomerConfig();

  if (!data?.menu) return null;
  return <MenuRender data={data.menu} currency={data?.currency ?? ""} />;
};

export default MenuPage;
