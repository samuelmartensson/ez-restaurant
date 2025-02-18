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
    <div className="px-2 max-w-screen-xl m-auto">
      <div className="grid md:grid-cols-2 gap-6 place-items-center">
        {articles.map((article) => {
          let truncatedContent = (article.content ?? "")?.slice(0, 140);

          if (truncatedContent?.length === 140) {
            truncatedContent += " ...";
          }

          return (
            <div
              className="w-full h-full flex flex-col rounded-3xl bg-white"
              key={article.id}
            >
              {article.image && (
                <img
                  className="w-full h-80 rounded-3xl object-cover"
                  src={article.image}
                  alt=""
                />
              )}
              <div className="p-5 grid flex-1">
                <div className="text-sm text-foreground/40 mb-3">
                  {new Date(article.date ?? "").toLocaleDateString("sv-SE", {
                    dateStyle: "long",
                  })}
                </div>
                <div className="mb-2 text-3xl font-bold font-customer">
                  {article.title}
                </div>
                <div className="flex gap-4 mb-4">
                  <div className="leading-relaxed">{truncatedContent}</div>
                </div>
                <div className="justify-self-end flex justify-between mt-auto items-end pt-4">
                  <Button asChild variant="secondary">
                    <Link href={`/news/${article.id}`}>
                      {translations.readMore}
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default NewsWidget;
