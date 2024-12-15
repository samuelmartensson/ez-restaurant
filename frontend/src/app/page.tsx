import { Button } from "@/components/ui/button";
import { getCustomerConfig } from "@/mock_db";
import Image from "next/image";
import Link from "next/link";

export default async function Home() {
  const data = await getCustomerConfig();
  if (!data) return null;

  return (
    <main className="h-[100svh]">
      <div className="absolute inset-0">
        <Image
          priority
          src={data.heroUrl}
          fill
          alt="hero"
          className="object-cover"
        />
      </div>
      <div className="m-auto relative max-w-screen-xl h-[100svh] grid place-items-center z-10">
        <div className="p-4 grid place-items-center gap-8">
          <h1 className="text-primary-foreground font-customer text-3xl md:text-6xl uppercase max-w-3xl text-center">
            Welcome to original italian pizzeria
          </h1>
          <p className="text-lg md:text-xl max-w-4xl text-primary-foreground text-center">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. In
            cursus turpis massa tincidu dui ut ornare. Sodales neque sodales ut
            etiam.
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
