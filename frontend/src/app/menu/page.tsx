import { getCustomerConfig } from "@/mock_db";
import MenuRender from "./MenuRender";
import SubPageLayout from "@/components/SubPageLayout";

const MenuPage = async () => {
  const data = await getCustomerConfig();

  if (!data?.menu) return null;
  return (
    <SubPageLayout title={data.siteTranslations?.menu}>
      <MenuRender data={data.menu} currency={data?.currency ?? ""} />
      <title>{`${data.siteTranslations?.menu} | ${data?.siteName}`}</title>
    </SubPageLayout>
  );
};

export default MenuPage;
