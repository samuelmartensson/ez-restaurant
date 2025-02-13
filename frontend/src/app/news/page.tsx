/* eslint-disable @next/next/no-img-element */
import NewsWidget from "@/components/NewsWidget";
import SubPageLayout from "@/components/SubPageLayout";
import { getCustomerConfig } from "@/mock_db";

const News = async () => {
  const data = await getCustomerConfig();
  if (!data) return null;

  return (
    <SubPageLayout title={data.siteTranslations?.news}>
      <title>{`${data.siteTranslations?.news} | ${data?.siteName}`}</title>
      <div className="container gap-2 grid mx-auto">
        <NewsWidget
          articles={data.sections?.newsArticles ?? []}
          translations={data.siteTranslations!}
        />
      </div>
    </SubPageLayout>
  );
};

export default News;
