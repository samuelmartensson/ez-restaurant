/* eslint-disable @next/next/no-img-element */
import SubPageLayout from "@/components/SubPageLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
    <SubPageLayout title={article.title}>
      <title>{`${news} | ${data?.siteName}`}</title>
      <div className="container gap-2 grid mx-auto">
        <Card key={article.id} className="border-none">
          <CardContent className="flex flex-col gap-4">
            {article.image && (
              <img
                className="w-full max-h-96 rounded-lg object-cover"
                src={article.image}
                alt=""
              />
            )}
            <CardDescription className="mb-4 text-muted-foreground text-pretty">
              {article.content?.split("\n")?.map((line, index) => (
                <Fragment key={index}>
                  {line}
                  <br />
                </Fragment>
              ))}
            </CardDescription>
          </CardContent>
        </Card>
      </div>
    </SubPageLayout>
  );
};

export default NewsId;
