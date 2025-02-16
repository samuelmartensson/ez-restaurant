/* eslint-disable @next/next/no-img-element */
import SubPageLayout from "@/components/SubPageLayout";
import { getCustomerConfig } from "@/mock_db";
import { Fragment } from "react";

const NewsId = async ({ params }: { params: Promise<{ id: string }> }) => {
  const data = await getCustomerConfig();
  const { id } = await params;

  if (!data) return null;
  const article = data.sections?.newsArticles?.find((a) => a.id === Number(id));
  const { news } = data.siteTranslations || {};

  if (!article)
    return (
      <SubPageLayout>
        <title>{`404 | ${data?.siteName}`}</title>
        Article not found
      </SubPageLayout>
    );

  return (
    <SubPageLayout title={news}>
      <title>{`${news} | ${data?.siteName}`}</title>
      <div className="gap-2 grid mx-auto">
        <div className="w-full h-full flex md:flex-row flex-col rounded-3xl bg-white">
          {article.image && (
            <img
              className="md:m-5 md:rounded-2xl rounded-3xl md:size-80 md:aspect-square w-full h-80 object-cover"
              src={article.image}
              alt=""
            />
          )}
          <div className="p-5 grid content-start">
            <div className="text-sm text-foreground/40 mb-3">
              {new Date(article.date ?? "").toLocaleDateString("sv-SE", {
                dateStyle: "long",
              })}
            </div>
            <div className="mb-2 text-3xl font-bold font-customer">
              {article.title}
            </div>
            <div className="flex gap-4 mb-4 leading-relaxed">
              {article.content?.split("\n")?.map((line, index) => (
                <Fragment key={index}>
                  {line}
                  <br />
                </Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>
    </SubPageLayout>
  );
};

export default NewsId;
