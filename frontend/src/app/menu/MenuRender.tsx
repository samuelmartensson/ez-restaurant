"use client";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MenuItem as MenuItemType } from "@/types";
import { usePathname, useSearchParams, useRouter } from "next/navigation";

function groupBy<T extends MenuItemType>(
  list: T[],
  key: keyof T
): { group: string; items: T[] }[] {
  const grouped = list.reduce((result, item) => {
    const groupKey = item[key] as string;

    if (!result[groupKey]) {
      result[groupKey] = [];
    }

    result[groupKey].push(item);

    return result;
  }, {} as { [key: string]: T[] });

  return Object.keys(grouped).map((groupKey) => ({
    group: groupKey,
    items: grouped[groupKey],
  }));
}

const MenuItem = ({ description, name, price, tags }: MenuItemType) => {
  return (
    <div className="border-b last:border-none py-4 flex justify-between">
      <div className="grid gap-4">
        <div className="grid gap-1">
          <span className="text-lg font-bold text-primary">{name}</span>
          {description && (
            <span className="text-muted-foreground">{description}</span>
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
      <span className="font-medium">{price} SEK</span>
    </div>
  );
};

const MenuRender = ({ data }: { data: MenuItemType[] }) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const selectedCategory = searchParams.get("selectedCategory") ?? "all";
  const categories = Array.from(new Set(data.map((m) => m.category)));

  return (
    <div className="grid gap-4">
      <Tabs
        value={selectedCategory}
        onValueChange={(category) =>
          router.push(pathname + "?selectedCategory=" + category)
        }
      >
        <TabsList className="w-full">
          <TabsTrigger className="w-full" value="all">
            Allt
          </TabsTrigger>
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
          <div key={item.group} className="mb-8 border-b">
            <div className="text-2xl">{item.group}</div>
            {item.items.map((x, i) => (
              <MenuItem key={i} {...x} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MenuRender;
