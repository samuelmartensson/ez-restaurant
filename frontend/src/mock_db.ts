import { headers } from "next/headers";
import { CUSTOMER_ID_HEADER } from "./middleware";
import { CustomerConfig } from "./types";

const getURL = (key: string, endpoint: string) => {
  const base = "http://localhost:5232/customer/";
  return `${base}${endpoint}?key=${key}`;
};

export const getCustomerConfig = async () => {
  const headerList = await headers();
  const customerId = headerList.get(CUSTOMER_ID_HEADER);
  if (!customerId) return null;
  const config = await fetch(getURL(customerId, "get-customer-config")).then(
    (r) => r.json()
  );
  const assets = await fetch(getURL(customerId, "get-customer-assets")).then(
    (r) => r.json()
  );
  const menu = await fetch(getURL(customerId, "get-customer-menu")).then((r) =>
    r.json()
  );

  return { ...config, ...assets, menu } as CustomerConfig;
};
