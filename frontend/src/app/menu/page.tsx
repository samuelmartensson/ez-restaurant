import SubPageLayout from "@/components/SubPageLayout";
import { getCustomerMenu } from "@/mock_db";
import MenuRender from "./MenuRender";

const MenuPage = async () => {
  const data = await getCustomerMenu();

  if (!data?.menu) return null;
  return (
    <SubPageLayout title={data.translations?.menu}>
      <MenuRender data={data.menu} currency={data?.meta.currency ?? ""} />
      <title>{`${data.translations?.menu} | ${data?.meta?.siteName}`}</title>
    </SubPageLayout>
  );
};

export default MenuPage;
