"use client";
/* eslint-disable @next/next/no-img-element */
import { SiteConfig } from "@/mock_db";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { LanguagePicker } from "./LanguagePicker";

let timer: NodeJS.Timeout | null = null;

export function Navigation({ data }: { data: SiteConfig }) {
  const pathname = usePathname();
  const { menu, aboutTitle } = data.siteTranslations || {};
  const [isExpanded, setExpanded] = useState(false);
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
  const { lastY, y } = scrollData;

  const handleScroll = () => {
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
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

  if (pathname.includes("admin")) return null;

  return (
    <nav
      style={{
        height: isExpanded ? "100%" : "unset",
        transform: options.hidden ? "translateY(-100%)" : "translateY(0%)",
      }}
      className="fixed top-0 left-0 right-0 z-50 text-white duration-300 bg-black/95 backdrop-blur supports-[backdrop-filter]:bg-black/60"
    >
      <div className="font-customer container gap-10 m-auto max-w-screen-xl">
        <div className="flex h-20 items-center gap-10 px-4 md:px-8">
          <Link href="/">
            {data?.logo ? (
              <img
                src={data.logo}
                alt=""
                className="h-12 max-w-[140px] sm:h-16 rounded-lg object-contain"
              />
            ) : (
              <span className="font-bold text-xl">{data.siteName}</span>
            )}
          </Link>
          <Link href="/menu">
            <span className="text-lg cursor-pointer">{menu ?? "MENU"}</span>
          </Link>
          <Link href="/about">
            <span className="text-lg cursor-pointer">
              {aboutTitle ?? "ABOUT"}
            </span>
          </Link>
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
