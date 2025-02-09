"use client";
/* eslint-disable @next/next/no-img-element */
import { SiteConfig } from "@/mock_db";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { LanguagePicker } from "./LanguagePicker";
import { useIsMobile } from "@/hooks/use-mobile";
import { HandPlatter, Images, Info, Menu, Newspaper, X } from "lucide-react";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { gtagEvent } from "@/utils";

let timer: NodeJS.Timeout | null = null;

const MobileNavigation = ({ data }: { data: SiteConfig }) => {
  const [expanded, setExpanded] = useState(false);
  const { menu, gallery, news, aboutTitle, orderNow } =
    data.siteTranslations || {};

  const hasLanguagePicker = data.languages && data.languages?.length > 0;

  return (
    <nav
      style={{ top: expanded ? 0 : "unset" }}
      className="shadow-md shadow-black fixed bottom-0 left-0 right-0 z-50 text-accent-foreground duration-300 bg-white"
    >
      <div className="flex font-customer container gap-10 m-auto h-full">
        {!expanded ? (
          <div className="flex-1 flex items-center gap-x-0 p-2">
            {data.sections?.hero?.orderUrl && (
              <Button
                onClick={() => {
                  gtagEvent((c) => c.ORDER_NOW_CLICKS, "Navigation");
                  window.open(data.sections?.hero?.orderUrl);
                }}
              >
                <HandPlatter /> {orderNow ?? "ORDER NOW"}
              </Button>
            )}
            {hasLanguagePicker && (
              <div className="ml-auto">
                <LanguagePicker
                  defaultLanguage={data.selectedLanguage}
                  languages={data.languages ?? []}
                />
              </div>
            )}
            <Button
              onClick={() => setExpanded(true)}
              className={hasLanguagePicker ? "" : "ml-auto"}
              size="icon"
              variant="secondary"
              aria-label="Navigation"
            >
              <Menu className="!size-6" />
            </Button>
          </div>
        ) : (
          <div
            style={{ opacity: 1 }}
            className="duration-300 flex flex-1 flex-col gap-2 py-4 px-4 mt-auto"
          >
            <Link
              onClick={() => setExpanded(false)}
              href="/"
              className="m-auto"
            >
              {data?.logo ? (
                <div className="grid place-items-center gap-2">
                  <img
                    src={data.logo}
                    alt=""
                    className="h-20 max-w-[200px] rounded-lg object-contain"
                  />
                  <span className="font-bold text-xl">{data.siteName}</span>
                </div>
              ) : (
                <span className="font-bold text-xl">{data.siteName}</span>
              )}
            </Link>
            <Separator className="bg-primary/25" />
            <Button
              className="justify-start"
              onClick={() => setExpanded(false)}
              asChild
              variant="ghost"
            >
              <Link
                href="/menu"
                onClick={() => gtagEvent((c) => c.MENU_CLICKS, "Navigation")}
              >
                <Menu className="md:!size-5" /> {menu ?? "MENU"}
              </Link>
            </Button>
            <Button
              className="justify-start"
              onClick={() => setExpanded(false)}
              asChild
              variant="ghost"
            >
              <Link href="/about">
                <Info className="md:!size-5" /> {aboutTitle ?? "ABOUT"}
              </Link>
            </Button>
            {(data.sections?.gallery || [])?.length > 0 && (
              <Button
                className="justify-start"
                onClick={() => setExpanded(false)}
                asChild
                variant="ghost"
              >
                <Link href="/gallery">
                  <Images className="md:!size-5" /> {gallery ?? "GALLERY"}
                </Link>
              </Button>
            )}
            {(data.sections?.newsArticles ?? [])?.length > 0 && (
              <Button
                className="justify-start"
                onClick={() => setExpanded(false)}
                asChild
                variant="ghost"
              >
                <Link href="/news">
                  <Newspaper className="md:!size-5" /> {news ?? "NEWS"}
                </Link>
              </Button>
            )}
            {data.sections?.hero?.orderUrl && (
              <Button
                className="justify-start"
                onClick={() => {
                  gtagEvent((c) => c.ORDER_NOW_CLICKS, "Navigation");
                  window.open(data.sections?.hero?.orderUrl);
                }}
              >
                <HandPlatter className="md:!size-5" /> {orderNow ?? "ORDER NOW"}
              </Button>
            )}
            <Button
              onClick={() => setExpanded(false)}
              variant="ghost"
              className="mt-8"
            >
              <X className="!size-6" /> Close
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
};

export function Navigation({ data }: { data: SiteConfig }) {
  const pathname = usePathname();
  const { menu, aboutTitle, news, orderNow, gallery } =
    data.siteTranslations || {};
  const [isLoad, setIsLoad] = useState(false);
  const [options, setOptions] = useState({
    hidden: false,
    lastHiddenY: 0,
    fill: false,
  });
  const [scrollData, setScrollData] = useState({
    x: 0,
    y: 0,
    lastX: 0,
    lastY: 0,
  });
  const isMobile = useIsMobile();
  const { lastY, y } = scrollData;

  const handleScroll = useCallback(() => {
    if (isMobile) return;
    if (timer !== null) {
      clearTimeout(timer);
    }

    timer = setTimeout(function () {
      setOptions((s) => {
        if (window.scrollY > s.lastHiddenY) {
          return {
            ...s,
            lastHiddenY: window.scrollY,
          };
        }

        return s;
      });
    }, 150);

    setScrollData((last) => {
      return {
        ...last,
        y: window.scrollY,
        lastY: last.y,
      };
    });
  }, [isMobile]);

  useEffect(() => {
    setIsLoad(true);
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    let shouldHide = false;

    if (y > 60 && y - lastY > 0) {
      shouldHide = true;
    }

    setOptions((s) => {
      if (s.lastHiddenY - y < 4 && y > 60) {
        shouldHide = true;
      }

      return {
        hidden: shouldHide,
        fill: y > 20,
        lastHiddenY: shouldHide ? y : s.lastHiddenY,
      };
    });
  }, [y, lastY]);

  if (!isLoad) return null;

  if (isMobile) {
    return <MobileNavigation data={data} />;
  }

  return (
    <nav
      style={{
        transform: options.hidden ? "translateY(-120%)" : "translateY(0%)",
      }}
      className="fixed bottom-0 md:bottom-[unset] md:top-0 left-0 right-0 z-50 duration-300 text-accent-foreground bg-white"
    >
      <div className="font-customer container gap-10 m-auto max-w-screen-xl px-2">
        <div className="md:text-base flex relative items-center px-0.5">
          <Link href="/">
            {data?.logo ? (
              <img
                src={data.logo}
                alt=""
                className="mr-4 max-w-[120px] h-16 rounded-lg object-contain"
              />
            ) : (
              <span className="mr-4 font-bold text-xl">{data.siteName}</span>
            )}
          </Link>
          <div className="">
            <Button
              size="default"
              className={cn(
                "w-22 flex-col gap-1.5 border-b-2 border-transparent duration-500 text-accent-foreground/70 text-sm h-auto py-4 rounded-none",
                pathname === "/menu" && "border-primary"
              )}
              asChild
              variant="ghost"
            >
              <Link
                href="/menu"
                onClick={() => gtagEvent((c) => c.MENU_CLICKS, "Navigation")}
              >
                <Menu
                  className={cn(
                    "md:!size-5 text-accent-foreground",
                    pathname === "/menu" && "text-primary"
                  )}
                />{" "}
                {menu ?? "MENU"}
              </Link>
            </Button>
            <Button
              size="default"
              className={cn(
                "w-22 flex-col gap-1.5 border-b-2 border-transparent duration-500 text-accent-foreground/70 text-sm h-auto py-4 rounded-none",
                pathname === "/about" && "border-primary"
              )}
              asChild
              variant="ghost"
            >
              <Link href="/about">
                <Info
                  className={cn(
                    "md:!size-5 text-accent-foreground",
                    pathname === "/about" && "text-primary"
                  )}
                />{" "}
                {aboutTitle ?? "ABOUT"}
              </Link>
            </Button>
            {(data.sections?.gallery || [])?.length > 0 && (
              <Button
                size="default"
                className={cn(
                  "w-22 flex-col gap-1.5 border-b-2 border-transparent duration-500 text-accent-foreground/70 text-sm h-auto py-4 rounded-none",
                  pathname === "/gallery" && "border-primary"
                )}
                asChild
                variant="ghost"
              >
                <Link href="/gallery">
                  <Images
                    className={cn(
                      "md:!size-5 text-accent-foreground",
                      pathname === "/gallery" && "text-primary"
                    )}
                  />{" "}
                  {gallery ?? "GALLERY"}
                </Link>
              </Button>
            )}
            {(data.sections?.newsArticles ?? [])?.length > 0 && (
              <Button
                size="default"
                className={cn(
                  "w-22 flex-col gap-1.5 border-b-2 border-transparent duration-500 text-accent-foreground/70 text-sm h-auto py-4 rounded-none",
                  pathname === "/news" && "border-primary"
                )}
                asChild
                variant="ghost"
              >
                <Link href="/news">
                  <Newspaper
                    className={cn(
                      "md:!size-5 text-accent-foreground",
                      pathname === "/news" && "text-primary"
                    )}
                  />{" "}
                  {news ?? "NEWS"}
                </Link>
              </Button>
            )}
          </div>
          <div className="flex gap-2 absolute right-2">
            {data.sections?.hero?.orderUrl && (
              <Button
                size={isMobile ? "sm" : "default"}
                onClick={() => window.open(data.sections?.hero?.orderUrl)}
              >
                <HandPlatter className="md:!size-5" /> {orderNow ?? "ORDER NOW"}
              </Button>
            )}
            {data.languages && data.languages?.length > 0 && (
              <div className="ml-auto pr-2">
                <LanguagePicker
                  defaultLanguage={data.selectedLanguage}
                  languages={data.languages}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
