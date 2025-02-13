/* eslint-disable @next/next/no-img-element */
import {
  NewsArticleResponse,
  SiteTranslationsResponse,
} from "@/generated/endpoints";
import Link from "next/link";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";

interface Props {
  translations: SiteTranslationsResponse;
  articles: NewsArticleResponse[];
}

const NewsWidget = ({ translations, articles }: Props) => {
  return (
    <div className="px-2 max-w-screen-xl m-auto">
      <div className="grid md:grid-cols-2 gap-6 place-items-center">
        {articles.map((article) => {
          let truncatedContent = (article.content ?? "")?.slice(0, 140);

          if (truncatedContent?.length === 140) {
            truncatedContent += " ...";
          }

          return (
            <div
              className="w-full h-full border-l-2 border-primary p-8 flex flex-col bg-gray-50"
              key={article.id}
            >
              <div className="mb-4 text-2xl font-bold font-customer">
                {article.title}
              </div>
              <div className="flex gap-4">
                {article.image && (
                  <img
                    className="size-24 md:size-32 rounded-lg object-cover"
                    src={article.image}
                    alt=""
                  />
                )}
                <div>{truncatedContent}</div>
              </div>
              <div className="flex justify-between mt-auto items-end pt-4">
                <div className="text-sm text-muted-foreground">
                  {new Date(article.date ?? "").toLocaleDateString("sv-SE", {
                    dateStyle: "medium",
                  })}
                </div>
                <Button asChild variant="outline">
                  <Link href={`/news/${article.id}`}>
                    {translations.readMore}
                  </Link>
                </Button>
              </div>
            </div>
          );
        })}
      </div>
      <Separator className="mt-16 max-w-screen-lg mx-auto" />
    </div>
  );
};

export default NewsWidget;
