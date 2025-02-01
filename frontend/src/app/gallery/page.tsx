import Gallery from "@/components/Gallery";
import SubPageLayout from "@/components/SubPageLayout";
import { getCustomerConfig } from "@/mock_db";

const GalleryPage = async () => {
  const data = await getCustomerConfig();
  if (!data) return null;

  const section = data.sections?.gallery;
  const galleryTitle = data.siteTranslations?.gallery ?? "";

  return (
    <SubPageLayout title={galleryTitle}>
      <title>{`${galleryTitle} | ${data?.siteName}`}</title>
      <Gallery urls={(section || [])?.map((g) => g.image ?? "")} />
    </SubPageLayout>
  );
};

export default GalleryPage;
