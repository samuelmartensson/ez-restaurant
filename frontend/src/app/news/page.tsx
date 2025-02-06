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

const News = async () => {
  const data = await getCustomerConfig();
  if (!data) return null;

  return (
    <SubPageLayout title={"News"}>
      <title>{`News | ${data?.siteName}`}</title>
      <div className="container gap-2 grid mx-auto">
        {data.sections?.newsArticles?.map((article) => {
          let truncatedContent = (article.content ?? "")?.slice(0, 320);

          if (truncatedContent?.length === 320) {
            truncatedContent += " ...";
          }

          return (
            <Card key={article.id} className="border-none">
              <CardHeader>
                <CardTitle className="text-xl">{article.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex gap-4">
                {article.image && (
                  <img
                    className="size-32 rounded-lg aspect-square object-cover"
                    src={article.image}
                    alt=""
                  />
                )}
                <CardDescription className="mb-4 text-muted-foreground text-pretty">
                  {truncatedContent.split("\n")?.map((line, index) => (
                    <Fragment key={index}>
                      {line}
                      <br />
                    </Fragment>
                  ))}
                </CardDescription>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </SubPageLayout>
  );
};

export default News;
