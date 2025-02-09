"use client";
import { Button } from "@/components/ui/button";
import { CustomerConfigResponse } from "@/generated/endpoints";
import { gtagEvent } from "@/utils";
import { ChevronDown, HandPlatter, Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const Hero = ({ data }: { data: CustomerConfigResponse }) => {
  const { orderNow, menu, openHoursCta } = data.siteTranslations || {};
  const heroSection = data?.sections?.hero;

  return (
    <div className="relative grid place-items-center min-h-svh">
      {heroSection && (
        <div className="absolute inset-0 bg-black">
          <Image
            priority
            src={heroSection.heroImage ?? ""}
            fill
            alt="hero"
            className="object-cover opacity-25"
          />
        </div>
      )}
      <div className="m-auto relative max-w-screen-xl grid place-items-center z-10">
        <div className="p-4 grid place-items-center gap-8">
          <h1 className="text-white font-customer text-3xl md:text-6xl uppercase max-w-3xl text-center">
            {data.siteName}
          </h1>
          <p className="text-white text-lg md:text-xl max-w-4xl text-primary-foreground text-center text-balance">
            {data.siteMetaTitle}
          </p>
          <div className="grid gap-2 grid-flow-col">
            <Button
              size="lg"
              asChild
              variant="outline"
              className="bg-transparent text-background"
            >
              <Link
                href="/menu"
                onClick={() => gtagEvent((c) => c.MENU_CLICKS, "Home page")}
              >
                <Menu className="!size-6" />
                {menu ?? "Menu"}
              </Link>
            </Button>
            {heroSection?.orderUrl && (
              <Button size="lg" asChild>
                <Link
                  target="_blank"
                  href={heroSection?.orderUrl ?? "/"}
                  onClick={() =>
                    gtagEvent((c) => c.ORDER_NOW_CLICKS, "Home page")
                  }
                >
                  <HandPlatter className="!size-6" />
                  {orderNow ?? "Order now"}
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
      <Link
        href="#open-hours"
        className="absolute md:bottom-4 bottom-28 grid place-items-center text-white"
      >
        <span>{openHoursCta ?? "Open hours"}</span>
        <ChevronDown className="animate-[bounce_3s_ease-in-out_infinite]" />
      </Link>
    </div>
  );
};

export default Hero;
