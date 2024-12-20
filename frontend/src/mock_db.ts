import { headers } from "next/headers";
import { CUSTOMER_ID_HEADER } from "./middleware";
import { CustomerConfig } from "./types";
import { getURL } from "./utils";

export const getCustomerConfig = async () => {
  const headerList = await headers();
  const customerId = headerList.get(CUSTOMER_ID_HEADER);
  if (!customerId) return null;
  const configResponse = await fetch(
    getURL(customerId, "get-customer-config")
  ).then((r) => r.json());

  const menu = await fetch(getURL(customerId, "get-customer-menu")).then((r) =>
    r.json()
  );

  return { ...configResponse, menu } as CustomerConfig;
};
