import { cookies, headers } from "next/headers";
import {
  CustomerConfigResponse,
  getPublicGetCustomerConfig,
  getPublicGetCustomerMenu,
  MenuResponse,
} from "./generated/endpoints";
import { CUSTOMER_ID_HEADER } from "./middleware";

export type SiteConfig = CustomerConfigResponse & {
  menu: MenuResponse;
  ok: boolean;
  selectedLanguage: string;
};

export const getCustomerConfig = async () => {
  const headerList = await headers();
  const cookieList = await cookies();

  const customerId = headerList.get(CUSTOMER_ID_HEADER);
  if (!customerId) return null;

  let selectedLanguage = cookieList.get("lang")?.value ?? "-";
  let configResponse = await getPublicGetCustomerConfig({
    Key: customerId,
    Language: selectedLanguage,
  });
  if (!configResponse.domain)
    return {
      ok: false,
    } as SiteConfig;

  if (!configResponse.languages?.includes(selectedLanguage)) {
    selectedLanguage = configResponse.languages?.[0] ?? "English";
    configResponse = await getPublicGetCustomerConfig({
      Key: customerId,
      Language: selectedLanguage,
    });
  }

  const menu = await getPublicGetCustomerMenu({ key: customerId });
  return {
    ...configResponse,
    selectedLanguage,
    menu,
    ok: true,
  } as SiteConfig;
};
