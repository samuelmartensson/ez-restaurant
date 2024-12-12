import { headers } from "next/headers";

interface CustomerConfig {
  name: string;
  theme: "rustic" | "modern";
  heroType: 1 | 2;
}

const createConfig = (data: CustomerConfig) => ({ ...data });

const customerConfigs: Record<string, CustomerConfig> = {
  testdomain: createConfig({ name: "MinButik", heroType: 1, theme: "rustic" }),
  elpaso: createConfig({ name: "El Paso", heroType: 2, theme: "modern" }),
};

export const getCustomerConfig = async () => {
  const headerList = await headers();
  const customerId = headerList.get("x-customer-id");
  return customerConfigs?.[customerId ?? ""];
};
