/* eslint-disable @next/next/no-img-element */
import {
  NewsArticleResponse,
  SiteTranslationsResponse,
} from "@/generated/endpoints";
import Link from "next/link";
import { Button } from "./ui/button";

interface Props {
  translations: SiteTranslationsResponse;
  articles: NewsArticleResponse[];
}

const NewsWidget = ({ translations, articles }: Props) => {
  return (
    <div className="p-4 max-w-screen-xl m-auto">
      <div className="grid md:grid-cols-2 gap-6 place-items-center">
        {articles.map((article) => {
          let truncatedContent = (article.content ?? "")?.slice(0, 140);

          if (truncatedContent?.length === 140) {
            truncatedContent += " ...";
          }

          return (
            <div
              className="w-full h-full border-l-2 border-primary p-8 flex flex-col bg-accent/20"
              key={article.id}
            >
              <div className="mb-2 text-2xl font-bold font-customer">
                {article.title}
              </div>
              <div className="flex gap-4">
                {article.image && (
                  <img
                    className="size-32 rounded-lg object-cover"
                    src={article.image}
                    alt=""
                  />
                )}
                <div className="mb-8">{truncatedContent}</div>
              </div>
              <Button asChild variant="outline" className="mt-auto self-end">
                <Link href={`/news/${article.id}`}>
                  {translations.readMore}
                </Link>
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default NewsWidget;
