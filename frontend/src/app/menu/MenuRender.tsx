"use client";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MenuResponse } from "@/generated/endpoints";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

function groupBy<T extends MenuResponse>(
  list: T[],
  key: keyof T
): { group: string; items: T[] }[] {
  const grouped = list.reduce(
    (result, item) => {
      const groupKey = item[key] as string;

      if (!result[groupKey]) {
        result[groupKey] = [];
      }

      result[groupKey].push(item);

      return result;
    },
    {} as { [key: string]: T[] }
  );

  return Object.keys(grouped).map((groupKey) => ({
    group: groupKey,
    items: grouped[groupKey],
  }));
}

const MenuItem = ({ description, name, price, tags }: MenuResponse) => {
  return (
    <div className="border-b-2 border-dashed pt-6 pb-2 flex gap-2 justify-between">
      <div className="grid gap-4">
        <div className="grid gap-1">
          <span className="text-lg">{name}</span>
          {description && (
            <span className="text-muted-foreground text-sm">{description}</span>
          )}
        </div>
        {tags && (
          <div className="flex flex-wrap gap-1">
            {tags
              .split(",")
              .filter(Boolean)
              .map((tag) => (
                <Badge variant="secondary" className="capitalize" key={tag}>
                  {tag}
                </Badge>
              ))}
          </div>
        )}
      </div>
      <span className="text-primary font-bold self-end whitespace-nowrap">
        {price} SEK
      </span>
    </div>
  );
};

const MenuRender = ({ data = [] }: { data: MenuResponse[] }) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const categories = Array.from(new Set(data.map((m) => m.category ?? "")));
  const selectedCategory =
    searchParams.get("selectedCategory") || categories?.[0];

  return (
    <div className="relative grid gap-4 p-4 rounded rounded-tr-3xl rounded-bl-3xl shadow-lg bg-white overflow-hidden">
      <div
        className="inset-0 absolute"
        style={{
          opacity: 0.35,
          background:
            "url(https://ez-rest.s3.eu-north-1.amazonaws.com/adflow.se/menu-backdrop.jpg)",
        }}
      />
      <div className="relative z-10 grid gap-8">
        <Tabs
          value={selectedCategory}
          onValueChange={(category) =>
            router.push(pathname + "?selectedCategory=" + category)
          }
        >
          <TabsList className="w-full">
            {categories.map((c) => (
              <TabsTrigger value={c} key={c} className="w-full">
                {c}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <div>
          {groupBy(
            data.filter(
              (item) =>
                selectedCategory === "all" || item.category === selectedCategory
            ),
            "category"
          ).map((item) => (
            <div key={item.group}>
              <div className="text-2xl">{item.group}</div>
              {item.items.map((x, i) => (
                <MenuItem key={i} {...x} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MenuRender;
