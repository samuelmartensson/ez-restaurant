import { cookies, headers } from "next/headers";
import {
  CustomerConfigMetaResponse,
  CustomerConfigResponse,
  getPublicAbout,
  getPublicGetCustomerConfig,
  getPublicGetCustomerConfigMeta,
  getPublicGetCustomerMenu,
  getPublicGetCustomerTranslations,
  MenuResponse,
  SiteSectionAboutResponse,
  SiteTranslationsResponse,
} from "./generated/endpoints";
import { CUSTOMER_ID_HEADER } from "./middleware";

export type SiteConfig = CustomerConfigResponse & {
  ok: boolean;
  selectedLanguage: string;
};

export type SiteMenu = {
  menu: MenuResponse;
  meta: CustomerConfigMetaResponse;
  translations: SiteTranslationsResponse;
  ok: boolean;
};

const resolveParams = async () => {
  const headerList = await headers();
  const cookieList = await cookies();
  const customerId = headerList.get(CUSTOMER_ID_HEADER);
  if (!customerId) return [null, null];

  let selectedLanguage = cookieList.get("lang")?.value ?? "-";
  const configResponse = await getPublicGetCustomerConfigMeta({
    Key: customerId,
    Language: selectedLanguage,
  });
  if (!configResponse.languages?.includes(selectedLanguage)) {
    selectedLanguage = configResponse.defaultLanguage ?? "English";
  }
  const params = {
    Key: customerId,
    Language: selectedLanguage,
  };

  return [configResponse, params] as const;
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
    selectedLanguage = configResponse.defaultLanguage ?? "English";
    configResponse = await getPublicGetCustomerConfig({
      Key: customerId,
      Language: selectedLanguage,
    });
  }

  return {
    ...configResponse,
    selectedLanguage,
    ok: true,
  } as SiteConfig;
};

export const getCustomerMenu = async () => {
  const [meta, params] = await resolveParams();

  if (!params) {
    return {
      ok: false,
    } as SiteMenu;
  }

  const menu = await getPublicGetCustomerMenu(params);
  const translations = getPublicGetCustomerTranslations(params);

  return {
    menu,
    meta,
    translations,
    ok: !!menu,
  } as SiteMenu;
};

interface About {
  about: SiteSectionAboutResponse;
  meta: CustomerConfigMetaResponse;
  ok: boolean;
}
export const getAbout = async () => {
  const [meta, params] = await resolveParams();

  if (!params) {
    return {
      ok: false,
    } as About;
  }

  const data = await getPublicAbout(params);
  return {
    about: data,
    meta,
    ok: !!data,
  } as About;
};
