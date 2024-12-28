import { Button } from "@/components/ui/button";
import { getCustomerConfig } from "@/mock_db";
import { ChevronDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default async function Home() {
  const data = await getCustomerConfig();
  if (!data) return null;

  const section = data?.sections?.hero;

  return (
    <main className="relative grid place-items-center min-h-svh">
      {section && (
        <div className="absolute inset-0 bg-black">
          <Image
            priority
            src={section.heroImage ?? ""}
            fill
            alt="hero"
            className="object-cover opacity-55"
          />
        </div>
      )}
      <div className="m-auto relative max-w-screen-xl grid place-items-center z-10">
        <div className="p-4 grid place-items-center gap-8">
          <h1 className="text-primary-foreground font-customer text-3xl md:text-6xl uppercase max-w-3xl text-center">
            {data.siteName}
          </h1>
          <p className="text-lg md:text-xl max-w-4xl text-primary-foreground text-center text-balance">
            {data.siteMetaTitle}
          </p>
          <div className="grid gap-2 grid-flow-col">
            <Button size="lg" asChild variant="secondary">
              <Link href="/menu">Menu</Link>
            </Button>
            {section?.orderUrl && (
              <Button size="lg" asChild>
                <Link target="_blank" href={section?.orderUrl ?? "/"}>
                  Order now
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
      <Link
        href="#open-hours"
        className="absolute bottom-4 grid place-items-center text-white"
      >
        <span>Open hours</span>
        <ChevronDown className="animate-[bounce_3s_ease-in-out_infinite]" />
      </Link>
    </main>
  );
}
