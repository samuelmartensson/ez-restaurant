/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
"use client";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MenuItemResponse, MenuResponse } from "@/generated/endpoints";
import { Image } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useRef } from "react";

const MenuItem = ({
  description,
  name,
  price,
  tags,
  image,
  currency,
}: MenuItemResponse & { currency: string }) => {
  return (
    <div className="border-b-2 border-dashed pt-6 pb-2 flex gap-4">
      {image ? (
        <img
          src={image}
          alt=""
          className="min-w-32 max-w-32 h-32 bg-gray-200 object-cover rounded-xl"
        />
      ) : (
        <div className="grid place-items-center min-w-32 max-w-32 h-32 bg-gray-200 object-cover rounded-xl">
          <Image className="text-gray-400" />
        </div>
      )}
      <div className="grid gap-2 w-full">
        <div className="grid gap-4">
          <div className="grid gap-1">
            <span className="text-lg font-customer">{name}</span>
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
        <span className="font-customer text-primary font-bold self-end whitespace-nowrap">
          {price} {currency}
        </span>
      </div>
    </div>
  );
};

const MenuRender = ({
  data,
  currency,
}: {
  data: MenuResponse;
  currency: string;
}) => {
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
      <div className="relative z-10 grid gap-1">
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
                <TabsTrigger
                  value={String(c.id)}
                  key={c.id}
                  className="w-full font-customer text-lg"
                >
                  {c.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        )}

        <div className="max-h-[65svh] overflow-auto">
          {data.categories
            ?.filter((item) => item.id === Number(selectedCategory))
            .map((item) => (
              <div key={item.id}>
                <div className="pt-4 p-2 text-muted-foreground">
                  <span className="mb-2 block">{item.description}</span>
                  <Separator />
                </div>
                {data?.menuItems
                  ?.filter((m) => m.categoryId === item.id)
                  ?.map((x, i) => (
                    <MenuItem key={i} {...x} currency={currency} />
                  ))}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default MenuRender;
