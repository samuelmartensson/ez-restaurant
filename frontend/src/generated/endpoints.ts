/**
 * Generated by orval v7.3.0 🍺
 * Do not edit manually.
 * backend
 * OpenAPI spec version: 1.0
 */
import { authorizedFetch } from "../authorized-fetch";
export type PostSectionAboutBody = {
  Description?: string;
  Image?: Blob;
  removedAssets?: string[];
};

export type PostSectionAboutParams = {
  key?: string;
};

export type PostSectionHeroBody = {
  Image?: Blob;
  OrderUrl?: string;
  removedAssets?: string[];
};

export type PostSectionHeroParams = {
  key?: string;
};

export type PostPublicContactParams = {
  key?: string;
};

export type GetPublicGetCustomerMenuParams = {
  key?: string;
};

export type GetPublicGetCustomerConfigParams = {
  key?: string;
};

export type PostOpeningHourParams = {
  key?: string;
};

export type GetOpeningHourParams = {
  key?: string;
};

export type PostMenuImportqoplamenuParams = {
  url?: string;
};

export type PostMenuCategoryOrderParams = {
  key?: string;
};

export type DeleteMenuCategoryParams = {
  id?: number;
  key?: string;
};

export type PostMenuCategoryParams = {
  key?: string;
};

export type PostMenuItemsBody = {
  files?: Blob[];
  menuItemsJson?: string;
};

export type PostMenuItemsParams = {
  key?: string;
};

export type DeleteCustomerDomainParams = {
  key?: string;
};

export type PostCustomerDomainParams = {
  key?: string;
  domainName?: string;
};

export type PostCustomerSiteConfigurationAssetsBody = {
  Font?: Blob;
  Logo?: Blob;
};

export type PostCustomerSiteConfigurationAssetsParams = {
  key?: string;
};

export type PostCustomerSiteConfigurationBody = {
  AboutUsDescription?: string;
  Adress?: string;
  Email?: string;
  Font?: string;
  InstagramUrl?: string;
  Logo?: string;
  Phone?: string;
  SiteMetaTitle?: string;
  SiteName?: string;
  Theme?: string;
};

export type PostCustomerSiteConfigurationParams = {
  key?: string;
};

export type DeleteCustomerConfigParams = {
  key?: string;
};

export type SubscriptionState =
  (typeof SubscriptionState)[keyof typeof SubscriptionState];

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const SubscriptionState = {
  NUMBER_0: 0,
  NUMBER_1: 1,
} as const;

export interface SiteSectionHeroResponse {
  heroImage?: string;
  orderUrl?: string;
}

export interface SiteSectionAboutResponse {
  description?: string;
  image?: string;
}

export interface SectionsResponse {
  about?: SiteSectionAboutResponse;
  hero?: SiteSectionHeroResponse;
}

export interface MenuItemResponse {
  categoryId: number;
  /** @minLength 1 */
  description: string;
  id: number;
  /** @nullable */
  image?: string | null;
  /** @minLength 1 */
  name: string;
  price: number;
  /** @nullable */
  tags?: string | null;
}

export interface MenuCategoryResponse {
  id: number;
  /** @minLength 1 */
  name: string;
  order: number;
}

export interface MenuResponse {
  categories: MenuCategoryResponse[];
  menuItems: MenuItemResponse[];
}

export interface CustomerConfigResponse {
  aboutUsDescription?: string;
  /** @nullable */
  adress?: string | null;
  /** @nullable */
  customDomain?: string | null;
  domain?: string;
  /** @nullable */
  email?: string | null;
  /** @nullable */
  font?: string | null;
  heroType?: number;
  /** @nullable */
  instagramUrl?: string | null;
  logo?: string;
  openingHours?: OpeningHourResponse[];
  /** @nullable */
  phone?: string | null;
  sections?: SectionsResponse;
  siteMetaTitle?: string;
  siteName?: string;
  theme?: string;
}

export interface CustomerResponse {
  cancelInfo?: CancelInfo;
  customerConfigs?: CustomerConfigResponse[];
  domain?: string;
  subscription?: SubscriptionState;
}

export type CustomDayOfWeek =
  (typeof CustomDayOfWeek)[keyof typeof CustomDayOfWeek];

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const CustomDayOfWeek = {
  NUMBER_0: 0,
  NUMBER_1: 1,
  NUMBER_2: 2,
  NUMBER_3: 3,
  NUMBER_4: 4,
  NUMBER_5: 5,
  NUMBER_6: 6,
  NUMBER_7: 7,
} as const;

export interface OpeningHourResponse {
  closeTime?: string;
  day?: CustomDayOfWeek;
  id?: number;
  isClosed?: boolean;
  /** @nullable */
  label?: string | null;
  openTime?: string;
}

export interface CreateConfigRequest {
  domain?: string;
}

export interface ContactRequest {
  description?: string;
  email?: string;
  name?: string;
}

export interface CancelInfo {
  isCanceled?: boolean;
  isExpired?: boolean;
  /** @nullable */
  periodEnd?: string | null;
}

export interface AddOpeningHourRequest {
  closeTime?: string;
  id?: number;
  isClosed?: boolean;
  /** @nullable */
  label?: string | null;
  openTime?: string;
}

export interface AddCategoryRequest {
  id?: number;
  name?: string;
  /** @nullable */
  order?: number | null;
}

export const getCustomerCustomer = () => {
  return authorizedFetch<CustomerResponse>({
    url: `/Customer/customer`,
    method: "GET",
  });
};

export const putCustomerConfig = (createConfigRequest: CreateConfigRequest) => {
  return authorizedFetch<void>({
    url: `/Customer/config`,
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    data: createConfigRequest,
  });
};

export const deleteCustomerConfig = (params?: DeleteCustomerConfigParams) => {
  return authorizedFetch<void>({
    url: `/Customer/config`,
    method: "DELETE",
    params,
  });
};

export const postCustomerSiteConfiguration = (
  postCustomerSiteConfigurationBody: PostCustomerSiteConfigurationBody,
  params?: PostCustomerSiteConfigurationParams,
) => {
  const formData = new FormData();
  if (postCustomerSiteConfigurationBody.SiteName !== undefined) {
    formData.append("SiteName", postCustomerSiteConfigurationBody.SiteName);
  }
  if (postCustomerSiteConfigurationBody.SiteMetaTitle !== undefined) {
    formData.append(
      "SiteMetaTitle",
      postCustomerSiteConfigurationBody.SiteMetaTitle,
    );
  }
  if (postCustomerSiteConfigurationBody.Theme !== undefined) {
    formData.append("Theme", postCustomerSiteConfigurationBody.Theme);
  }
  if (postCustomerSiteConfigurationBody.AboutUsDescription !== undefined) {
    formData.append(
      "AboutUsDescription",
      postCustomerSiteConfigurationBody.AboutUsDescription,
    );
  }
  if (postCustomerSiteConfigurationBody.Logo !== undefined) {
    formData.append("Logo", postCustomerSiteConfigurationBody.Logo);
  }
  if (postCustomerSiteConfigurationBody.Font !== undefined) {
    formData.append("Font", postCustomerSiteConfigurationBody.Font);
  }
  if (postCustomerSiteConfigurationBody.Adress !== undefined) {
    formData.append("Adress", postCustomerSiteConfigurationBody.Adress);
  }
  if (postCustomerSiteConfigurationBody.Phone !== undefined) {
    formData.append("Phone", postCustomerSiteConfigurationBody.Phone);
  }
  if (postCustomerSiteConfigurationBody.Email !== undefined) {
    formData.append("Email", postCustomerSiteConfigurationBody.Email);
  }
  if (postCustomerSiteConfigurationBody.InstagramUrl !== undefined) {
    formData.append(
      "InstagramUrl",
      postCustomerSiteConfigurationBody.InstagramUrl,
    );
  }

  return authorizedFetch<void>({
    url: `/Customer/site-configuration`,
    method: "POST",
    headers: { "Content-Type": "multipart/form-data" },
    data: formData,
    params,
  });
};

export const postCustomerSiteConfigurationAssets = (
  postCustomerSiteConfigurationAssetsBody: PostCustomerSiteConfigurationAssetsBody,
  params?: PostCustomerSiteConfigurationAssetsParams,
) => {
  const formData = new FormData();
  if (postCustomerSiteConfigurationAssetsBody.Logo !== undefined) {
    formData.append("Logo", postCustomerSiteConfigurationAssetsBody.Logo);
  }
  if (postCustomerSiteConfigurationAssetsBody.Font !== undefined) {
    formData.append("Font", postCustomerSiteConfigurationAssetsBody.Font);
  }

  return authorizedFetch<void>({
    url: `/Customer/site-configuration-assets`,
    method: "POST",
    headers: { "Content-Type": "multipart/form-data" },
    data: formData,
    params,
  });
};

export const postCustomerDomain = (params?: PostCustomerDomainParams) => {
  return authorizedFetch<void>({
    url: `/Customer/domain`,
    method: "POST",
    params,
  });
};

export const deleteCustomerDomain = (params?: DeleteCustomerDomainParams) => {
  return authorizedFetch<void>({
    url: `/Customer/domain`,
    method: "DELETE",
    params,
  });
};

export const postMenuItems = (
  postMenuItemsBody: PostMenuItemsBody,
  params?: PostMenuItemsParams,
) => {
  const formData = new FormData();
  if (postMenuItemsBody.menuItemsJson !== undefined) {
    formData.append("menuItemsJson", postMenuItemsBody.menuItemsJson);
  }
  if (postMenuItemsBody.files !== undefined) {
    postMenuItemsBody.files.forEach((value) => formData.append("files", value));
  }

  return authorizedFetch<void>({
    url: `/Menu/items`,
    method: "POST",
    headers: { "Content-Type": "multipart/form-data" },
    data: formData,
    params,
  });
};

export const postMenuCategory = (
  addCategoryRequest: AddCategoryRequest,
  params?: PostMenuCategoryParams,
) => {
  return authorizedFetch<void>({
    url: `/Menu/category`,
    method: "POST",
    headers: { "Content-Type": "application/json" },
    data: addCategoryRequest,
    params,
  });
};

export const deleteMenuCategory = (params?: DeleteMenuCategoryParams) => {
  return authorizedFetch<void>({
    url: `/Menu/category`,
    method: "DELETE",
    params,
  });
};

export const postMenuCategoryOrder = (
  addCategoryRequest: AddCategoryRequest[],
  params?: PostMenuCategoryOrderParams,
) => {
  return authorizedFetch<void>({
    url: `/Menu/category/order`,
    method: "POST",
    headers: { "Content-Type": "application/json" },
    data: addCategoryRequest,
    params,
  });
};

export const postMenuImportqoplamenu = (
  params?: PostMenuImportqoplamenuParams,
) => {
  return authorizedFetch<void>({
    url: `/Menu/importqoplamenu`,
    method: "POST",
    params,
  });
};

export const getOpeningHour = (params?: GetOpeningHourParams) => {
  return authorizedFetch<OpeningHourResponse[]>({
    url: `/OpeningHour`,
    method: "GET",
    params,
  });
};

export const postOpeningHour = (
  addOpeningHourRequest: AddOpeningHourRequest[],
  params?: PostOpeningHourParams,
) => {
  return authorizedFetch<void>({
    url: `/OpeningHour`,
    method: "POST",
    headers: { "Content-Type": "application/json" },
    data: addOpeningHourRequest,
    params,
  });
};

export const getPublicGetCustomerConfig = (
  params?: GetPublicGetCustomerConfigParams,
) => {
  return authorizedFetch<CustomerConfigResponse>({
    url: `/Public/get-customer-config`,
    method: "GET",
    params,
  });
};

export const getPublicGetCustomerMenu = (
  params?: GetPublicGetCustomerMenuParams,
) => {
  return authorizedFetch<MenuResponse>({
    url: `/Public/get-customer-menu`,
    method: "GET",
    params,
  });
};

export const postPublicContact = (
  contactRequest: ContactRequest,
  params?: PostPublicContactParams,
) => {
  return authorizedFetch<void>({
    url: `/Public/contact`,
    method: "POST",
    headers: { "Content-Type": "application/json" },
    data: contactRequest,
    params,
  });
};

export const postSectionHero = (
  postSectionHeroBody: PostSectionHeroBody,
  params?: PostSectionHeroParams,
) => {
  const formData = new FormData();
  if (postSectionHeroBody.Image !== undefined) {
    formData.append("Image", postSectionHeroBody.Image);
  }
  if (postSectionHeroBody.removedAssets !== undefined) {
    postSectionHeroBody.removedAssets.forEach((value) =>
      formData.append("removedAssets", value),
    );
  }
  if (postSectionHeroBody.OrderUrl !== undefined) {
    formData.append("OrderUrl", postSectionHeroBody.OrderUrl);
  }

  return authorizedFetch<void>({
    url: `/Section/hero`,
    method: "POST",
    headers: { "Content-Type": "multipart/form-data" },
    data: formData,
    params,
  });
};

export const postSectionAbout = (
  postSectionAboutBody: PostSectionAboutBody,
  params?: PostSectionAboutParams,
) => {
  const formData = new FormData();
  if (postSectionAboutBody.Image !== undefined) {
    formData.append("Image", postSectionAboutBody.Image);
  }
  if (postSectionAboutBody.removedAssets !== undefined) {
    postSectionAboutBody.removedAssets.forEach((value) =>
      formData.append("removedAssets", value),
    );
  }
  if (postSectionAboutBody.Description !== undefined) {
    formData.append("Description", postSectionAboutBody.Description);
  }

  return authorizedFetch<void>({
    url: `/Section/about`,
    method: "POST",
    headers: { "Content-Type": "multipart/form-data" },
    data: formData,
    params,
  });
};

export const postWebhook = () => {
  return authorizedFetch<void>({ url: `/webhook`, method: "POST" });
};

export type GetCustomerCustomerResult = NonNullable<
  Awaited<ReturnType<typeof getCustomerCustomer>>
>;
export type PutCustomerConfigResult = NonNullable<
  Awaited<ReturnType<typeof putCustomerConfig>>
>;
export type DeleteCustomerConfigResult = NonNullable<
  Awaited<ReturnType<typeof deleteCustomerConfig>>
>;
export type PostCustomerSiteConfigurationResult = NonNullable<
  Awaited<ReturnType<typeof postCustomerSiteConfiguration>>
>;
export type PostCustomerSiteConfigurationAssetsResult = NonNullable<
  Awaited<ReturnType<typeof postCustomerSiteConfigurationAssets>>
>;
export type PostCustomerDomainResult = NonNullable<
  Awaited<ReturnType<typeof postCustomerDomain>>
>;
export type DeleteCustomerDomainResult = NonNullable<
  Awaited<ReturnType<typeof deleteCustomerDomain>>
>;
export type PostMenuItemsResult = NonNullable<
  Awaited<ReturnType<typeof postMenuItems>>
>;
export type PostMenuCategoryResult = NonNullable<
  Awaited<ReturnType<typeof postMenuCategory>>
>;
export type DeleteMenuCategoryResult = NonNullable<
  Awaited<ReturnType<typeof deleteMenuCategory>>
>;
export type PostMenuCategoryOrderResult = NonNullable<
  Awaited<ReturnType<typeof postMenuCategoryOrder>>
>;
export type PostMenuImportqoplamenuResult = NonNullable<
  Awaited<ReturnType<typeof postMenuImportqoplamenu>>
>;
export type GetOpeningHourResult = NonNullable<
  Awaited<ReturnType<typeof getOpeningHour>>
>;
export type PostOpeningHourResult = NonNullable<
  Awaited<ReturnType<typeof postOpeningHour>>
>;
export type GetPublicGetCustomerConfigResult = NonNullable<
  Awaited<ReturnType<typeof getPublicGetCustomerConfig>>
>;
export type GetPublicGetCustomerMenuResult = NonNullable<
  Awaited<ReturnType<typeof getPublicGetCustomerMenu>>
>;
export type PostPublicContactResult = NonNullable<
  Awaited<ReturnType<typeof postPublicContact>>
>;
export type PostSectionHeroResult = NonNullable<
  Awaited<ReturnType<typeof postSectionHero>>
>;
export type PostSectionAboutResult = NonNullable<
  Awaited<ReturnType<typeof postSectionAbout>>
>;
export type PostWebhookResult = NonNullable<
  Awaited<ReturnType<typeof postWebhook>>
>;
