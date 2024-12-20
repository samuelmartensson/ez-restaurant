/* eslint-disable @next/next/no-img-element */
import { Button } from "@/components/ui/button";
import { getCustomerConfig } from "@/mock_db";
import Image from "next/image";
import Link from "next/link";

export default async function Home() {
  const data = await getCustomerConfig();
  if (!data) return null;

  return (
    <main className="grid place-items-center min-h-nav-sm sm:min-h-nav">
      <div className="absolute inset-0 bg-black">
        <Image
          priority
          src={data.heroUrl}
          fill
          alt="hero"
          className="object-cover opacity-55"
        />
      </div>
      <div className="m-auto relative max-w-screen-xl grid place-items-center z-10">
        <div className="p-4 grid place-items-center gap-8">
          <img src={data.iconUrl} alt="" className="h-32 rounded-lg" />
          <h1 className="text-primary-foreground font-customer text-3xl md:text-6xl uppercase max-w-3xl text-center">
            {data.config.siteName}
          </h1>
          <p className="text-lg md:text-xl max-w-4xl text-primary-foreground text-center">
            {data.config.siteMetaTitle}
          </p>
          <div className="grid gap-2 grid-flow-col">
            <Button size="lg" asChild variant="secondary">
              <Link href="/menu">Menu</Link>
            </Button>
            <Button size="lg" asChild>
              <Link href="/">Order now</Link>
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
