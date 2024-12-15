import { getCustomerConfig } from "@/mock_db";
import MenuRender from "./MenuRender";

const MenuPage = async () => {
  const data = await getCustomerConfig();

  return <MenuRender data={data?.menu ?? []} />;
};

export default MenuPage;
