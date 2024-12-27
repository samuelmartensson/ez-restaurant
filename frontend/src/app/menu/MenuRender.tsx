/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
"use client";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MenuItemResponse, MenuResponse } from "@/generated/endpoints";
import { Image } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useRef } from "react";

function groupBy<T extends MenuItemResponse>(
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

const MenuItem = ({
  description,
  name,
  price,
  tags,
  image,
}: MenuItemResponse) => {
  return (
    <div className="border-b-2 border-dashed pt-6 pb-2 flex gap-4">
      {image ? (
        <img
          src={image}
          alt=""
          className="min-w-28 max-w-28 h-28 bg-gray-200 object-cover rounded-xl"
        />
      ) : (
        <div className="grid place-items-center min-w-28 max-w-28 h-28 bg-gray-200 object-cover rounded-xl">
          <Image className="text-gray-400" />
        </div>
      )}
      <div className="grid gap-2 w-full">
        <div className="grid gap-4">
          <div className="grid gap-1">
            <span className="text-lg">{name}</span>
            {description && (
              <span className="text-muted-foreground text-sm">
                {description}
              </span>
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
    </div>
  );
};

const MenuRender = ({ data }: { data: MenuResponse }) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const ref = useRef<HTMLDivElement>(null);
  const selectedCategory =
    searchParams.get("selectedCategory") || data.categories?.[0]?.id || "all";

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
      <div className="relative z-10 grid gap-4">
        {data.categories.length > 0 && (
          <Tabs
            ref={ref}
            className="overflow-auto scroll-smooth"
            value={String(selectedCategory)}
            onValueChange={(category) => {
              router.push(pathname + "?selectedCategory=" + category);
              if (!ref.current) return;

              const scrollDistance =
                ref.current.scrollWidth - ref.current.clientWidth;
              const avgLength = scrollDistance / data.categories.length;
              const result =
                (data.categories.findIndex((c) => c.id == Number(category)) +
                  1) *
                avgLength;
              const ratio = result / scrollDistance;

              if (ratio < 0.34) {
                ref.current.scrollLeft = 0;
              }
              if (ratio > 0.7) {
                ref.current.scrollLeft = scrollDistance;
                return;
              }
              if (ratio >= 0.5) {
                ref.current.scrollLeft = scrollDistance / 2;
              }
            }}
          >
            <TabsList className="justify-start">
              {data.categories.map((c) => (
                <TabsTrigger value={String(c.id)} key={c.id} className="w-full">
                  {c.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        )}

        <div className="max-h-[65svh] overflow-auto">
          {groupBy(
            data.menuItems?.filter(
              (item) =>
                selectedCategory === "all" ||
                item.categoryId === Number(selectedCategory)
            ),
            "categoryId"
          ).map((item) => (
            <div key={item.group}>
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
