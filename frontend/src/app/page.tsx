import ContactForm from "@/components/ContactForm";
import Gallery from "@/components/Gallery";
import NewsWidget from "@/components/NewsWidget";
import { Button } from "@/components/ui/button";
import { getCustomerConfig } from "@/mock_db";
import { ChevronDown, HandPlatter, Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default async function Home() {
  const data = await getCustomerConfig();
  if (!data) return null;

  const { orderNow, menu, openHoursCta } = data.siteTranslations || {};
  const heroSection = data?.sections?.hero;

  return (
    <main>
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
                <Link href="/menu">
                  <Menu className="!size-6" />
                  {menu ?? "Menu"}
                </Link>
              </Button>
              {heroSection?.orderUrl && (
                <Button size="lg" asChild>
                  <Link target="_blank" href={heroSection?.orderUrl ?? "/"}>
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

      {(data.sections?.newsArticles ?? [])?.length > 0 && (
        <div className="py-16 px-2">
          <NewsWidget articles={data.sections?.newsArticles ?? []} />
        </div>
      )}
      {data.sectionVisibility?.contactFormVisible && (
        <ContactForm data={data} />
      )}
      {(data.sections?.gallery || [])?.length > 0 && (
        <div className="pt-16 px-2">
          <Gallery
            urls={(data.sections?.gallery || [])
              ?.map((g) => g.image ?? "")
              .slice(0, 6)}
          />
        </div>
      )}
    </main>
  );
}
