import { getCustomerConfig } from "@/mock_db";

export default async function Home() {
  const data = await getCustomerConfig();

  return (
    <div className="bg-primary-500 grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="text-foreground flex flex-col gap-2 items-center">
        <h1 className="text-2xl font-semibold font-customer">{data.domain}</h1>
        <div>{data.theme}</div>
        <div>{data.customer_id}</div>
      </main>
    </div>
  );
}
