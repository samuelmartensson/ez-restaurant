/* eslint-disable @next/next/no-img-element */
import { NewsArticleResponse } from "@/generated/endpoints";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

interface Props {
  articles: NewsArticleResponse[];
}

const NewsWidget = ({ articles }: Props) => {
  return (
    <div className="p-4 max-w-screen-xl m-auto">
      <Badge className="mb-4 font-customer">
        <h2 className="text-4xl">Händelser</h2>
      </Badge>
      <div className="grid grid-cols-2 gap-6 place-items-center">
        {articles.map((article) => {
          let truncatedContent = (article.content ?? "")?.slice(0, 140);

          if (truncatedContent?.length === 140) {
            truncatedContent += " ...";
          }

          return (
            <div
              className="w-full h-full border-l-2 border-primary p-8 flex flex-col bg-accent"
              key={article.id}
            >
              <div className="mb-2 text-lg font-bold">{article.title}</div>
              <div className="mb-8">{truncatedContent}</div>
              <Button variant="outline" className="mt-auto self-end">
                Läs mer
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default NewsWidget;
