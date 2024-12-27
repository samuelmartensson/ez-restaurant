import { headers } from "next/headers";
import {
  CustomerConfigResponse,
  getPublicGetCustomerConfig,
  getPublicGetCustomerMenu,
  MenuResponse,
} from "./generated/endpoints";
import { CUSTOMER_ID_HEADER } from "./middleware";

type SiteConfig = CustomerConfigResponse & {
  menu: MenuResponse;
  ok: boolean;
};

export const getCustomerConfig = async () => {
  const headerList = await headers();
  const customerId = headerList.get(CUSTOMER_ID_HEADER);
  if (!customerId) return null;

  const configResponse = await getPublicGetCustomerConfig({ key: customerId });
  if (!configResponse.domain)
    return {
      ok: false,
    } as SiteConfig;

  const menu = await getPublicGetCustomerMenu({ key: customerId });
  return { ...configResponse, menu, ok: true } as SiteConfig;
};
