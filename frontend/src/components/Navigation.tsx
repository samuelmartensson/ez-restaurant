"use client";
/* eslint-disable @next/next/no-img-element */
import { SiteConfig } from "@/mock_db";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { LanguagePicker } from "./LanguagePicker";
import { useIsMobile } from "@/hooks/use-mobile";
import { HandPlatter, Info, Menu, X } from "lucide-react";
import { Button } from "./ui/button";

let timer: NodeJS.Timeout | null = null;

const MobileNavigation = ({ data }: { data: SiteConfig }) => {
  const [expanded, setExpanded] = useState(false);
  const { menu, aboutTitle, orderNow } = data.siteTranslations || {};

  const hasLanguagePicker = data.languages && data.languages?.length > 0;

  return (
    <nav
      style={{ top: expanded ? 0 : "unset" }}
      className="shadow-md shadow-black fixed bottom-0 left-0 right-0 z-50 text-accent-foreground duration-300 bg-accent"
    >
      <div className="flex font-customer container gap-10 m-auto h-full">
        {!expanded ? (
          <div className="flex-1 flex items-center gap-x-0 p-2">
            {data.sections?.hero?.orderUrl && (
              <Button
                size="sm"
                onClick={() => window.open(data.sections?.hero?.orderUrl)}
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
            >
              <Menu className="!size-6" />
            </Button>
          </div>
        ) : (
          <div
            style={{ opacity: 1 }}
            className="duration-300 flex flex-1 flex-col gap-4 py-4 px-4 mt-auto"
          >
            <Link
              onClick={() => setExpanded(false)}
              href="/"
              className="m-auto mb-12"
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

            <Button
              className="justify-start"
              onClick={() => setExpanded(false)}
              asChild
              variant="ghost"
            >
              <Link href="/menu">
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
            {data.sections?.hero?.orderUrl && (
              <Button
                className="justify-start"
                onClick={() => window.open(data.sections?.hero?.orderUrl)}
              >
                <HandPlatter className="md:!size-5" /> {orderNow ?? "ORDER NOW"}
              </Button>
            )}
            <Button
              onClick={() => setExpanded(false)}
              variant="secondary"
              className="mt-auto"
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
  const { menu, aboutTitle, orderNow } = data.siteTranslations || {};
  const [isExpanded, setExpanded] = useState(false);
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
    if (isExpanded) return;
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
  }, [y, lastY, setExpanded, isExpanded]);

  if (!isLoad) return null;

  if (isMobile) {
    return <MobileNavigation data={data} />;
  }

  return (
    <nav
      style={{
        height: isExpanded ? "100%" : "unset",
        transform:
          !isMobile && options.hidden ? "translateY(-120%)" : "translateY(0%)",
      }}
      className="fixed bottom-0 md:bottom-[unset] md:top-4 left-0 right-0 z-50 duration-300"
    >
      <div className="font-customer container gap-10 m-auto max-w-screen-xl text-accent-foreground bg-accent/95 backdrop-blur supports-[backdrop-filter]:bg-accent/60 rounded-lg">
        <div className="md:text-base flex items-center gap-x-0 md:gap-x-2 py-0 px-4 md:px-8">
          <Link href="/" className="p-2">
            {data?.logo ? (
              <img
                src={data.logo}
                alt=""
                className="mr-4 h-8 max-w-[120px] md:h-16 rounded-lg object-contain"
              />
            ) : (
              <span className="mr-4 font-bold text-xl">{data.siteName}</span>
            )}
          </Link>
          {data.sections?.hero?.orderUrl && (
            <Button
              size={isMobile ? "sm" : "default"}
              onClick={() => window.open(data.sections?.hero?.orderUrl)}
            >
              <HandPlatter className="md:!size-5" /> {orderNow ?? "ORDER NOW"}
            </Button>
          )}
          <Button size={isMobile ? "sm" : "default"} asChild variant="ghost">
            <Link href="/menu">
              <Menu className="md:!size-5" /> {menu ?? "MENU"}
            </Link>
          </Button>
          <Button size={isMobile ? "sm" : "default"} asChild variant="ghost">
            <Link href="/about">
              <Info className="md:!size-5" /> {aboutTitle ?? "ABOUT"}
            </Link>
          </Button>

          {data.languages && data.languages?.length > 0 && (
            <div className="ml-auto">
              <LanguagePicker
                defaultLanguage={data.selectedLanguage}
                languages={data.languages}
              />
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
