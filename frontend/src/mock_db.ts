import { headers } from "next/headers";
import { CUSTOMER_ID_HEADER } from "./middleware";

interface CustomerConfig {
  name: string;
  theme: "rustic" | "modern";
  heroType: 1 | 2;
}

const createConfig = (data: CustomerConfig) => ({ ...data });

const customerConfigs: Record<string, CustomerConfig> = {
  testdomain: createConfig({ name: "MinButik", heroType: 1, theme: "rustic" }),
  elpaso: createConfig({ name: "El Paso", heroType: 2, theme: "modern" }),
  test: createConfig({ name: "Test Customer", heroType: 2, theme: "modern" }),
};

export const getCustomerConfig = async () => {
  const headerList = await headers();
  const customerId = headerList.get(CUSTOMER_ID_HEADER);
  return customerConfigs?.[customerId ?? ""];
};
