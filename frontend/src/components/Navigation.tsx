"use client";
/* eslint-disable @next/next/no-img-element */
import { CustomerConfigResponse } from "@/generated/endpoints";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Navigation({ data }: { data: CustomerConfigResponse }) {
  const pathname = usePathname();

  if (pathname.includes("admin")) return null;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 text-white bg-black/95 backdrop-blur supports-[backdrop-filter]:bg-black/60">
      <div className="font-customer container flex h-20 items-center justify-center gap-10 m-auto max-w-screen-xl">
        <Link href="/menu">
          <span className="text-lg cursor-pointer">MENU</span>
        </Link>
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
        <Link href="/about">
          <span className="text-lg cursor-pointer">ABOUT</span>
        </Link>
      </div>
    </nav>
  );
}
