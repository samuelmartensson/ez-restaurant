import { headers } from "next/headers";
import { CustomerConfigResponse, MenuResponse } from "./generated/endpoints";
import { CUSTOMER_ID_HEADER } from "./middleware";
import { getURL } from "./utils";

type SiteConfig = CustomerConfigResponse & {
  menu: MenuResponse;
  ok: boolean;
};

export const getCustomerConfig = async () => {
  const headerList = await headers();
  const customerId = headerList.get(CUSTOMER_ID_HEADER);
  if (!customerId) return null;
  const configRequest = await fetch(getURL(customerId, "get-customer-config"));

  if (!configRequest.ok)
    return {
      ok: false,
    } as SiteConfig;

  const configResponse = await configRequest.json();

  const menu = await fetch(getURL(customerId, "get-customer-menu")).then((r) =>
    r.json()
  );

  return { ...configResponse, menu, ok: true } as SiteConfig;
};
