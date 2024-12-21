"use client";
/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { Button } from "./ui/button";
import { usePathname } from "next/navigation";
import { CustomerConfigResponse } from "@/generated/endpoints";

export function Navigation({ data }: { data: CustomerConfigResponse }) {
  const pathname = usePathname();

  if (pathname.includes("admin")) return null;

  return (
    <div className="w-full sticky top-0 inset-x-0 p-2 sm:py-6 sm:px-4 z-50 bg-black/50">
      <div className="max-w-screen-xl m-auto">
        <div className="flex items-center gap-1 px-4">
          {data?.logo && (
            <Link href="/">
              <img
                src={data.logo}
                alt=""
                className="h-12 sm:h-16 rounded-lg mr-4 sm:mr-8"
              />
            </Link>
          )}
          <Link href="/">
            <Button className="text-background text-lg" variant="link">
              Home
            </Button>
          </Link>
          <Link href="/menu">
            <Button className="text-background text-lg" variant="link">
              Menu
            </Button>
          </Link>
          <Link href="/about">
            <Button className="text-background text-lg" variant="link">
              About
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
