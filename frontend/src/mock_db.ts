import { headers } from "next/headers";
import { CUSTOMER_ID_HEADER } from "./middleware";
import { getURL } from "./utils";
import { CustomerConfigResponse, MenuResponse } from "./generated/endpoints";

export const getCustomerConfig = async () => {
  const headerList = await headers();
  const customerId = headerList.get(CUSTOMER_ID_HEADER);
  if (!customerId) return null;
  const configRequest = await fetch(getURL(customerId, "get-customer-config"));

  if (!configRequest.ok) return false;

  const configResponse = await configRequest.json();

  const menu = await fetch(getURL(customerId, "get-customer-menu")).then((r) =>
    r.json()
  );

  return { ...configResponse, menu } as CustomerConfigResponse & {
    menu: MenuResponse;
  };
};
