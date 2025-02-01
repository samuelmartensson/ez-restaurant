/**
 * Generated by orval v7.3.0 🍺
 * Do not edit manually.
 * backend
 * OpenAPI spec version: 1.0
 */
import { authorizedFetch } from "../authorized-fetch";
export type DeleteSectionGalleryParams = {
  id?: number;
  Key: string;
  Language: string;
};

export type PostSectionGalleryBody = {
  Image?: Blob;
};

export type PostSectionGalleryParams = {
  Key: string;
  Language: string;
};

export type PostSectionAboutBody = {
  Description?: string;
  Image?: Blob;
  removedAssets?: string[];
};

export type PostSectionAboutParams = {
  Key: string;
  Language: string;
};

export type PostSectionHeroBody = {
  Image?: Blob;
  OrderUrl?: string;
  removedAssets?: string[];
};

export type PostSectionHeroParams = {
  key: string;
};

export type PostPublicContactParams = {
  key: string;
};

export type GetPublicGetCustomerMenuParams = {
  Key: string;
  Language: string;
};

export type GetPublicGetCustomerConfigParams = {
  Key: string;
  Language: string;
};

export type GetPublicGetCustomerTranslationsParams = {
  Key: string;
  Language: string;
};

export type GetPublicAboutParams = {
  Key: string;
  Language: string;
};

export type GetPublicGetCustomerConfigMetaParams = {
  Key: string;
  Language: string;
};

export type PostOpeningHourParams = {
  Key: string;
  Language: string;
};

export type GetOpeningHourParams = {
  Key: string;
  Language: string;
};

export type PostMenuImportqoplamenuParams = {
  url?: string;
};

export type PostMenuCategoryOrderParams = {
  key: string;
};

export type DeleteMenuCategoryParams = {
  id?: number;
  key: string;
};

export type PostMenuCategoryParams = {
  Key: string;
  Language: string;
};

export type PostMenuItemsBody = {
  files?: Blob[];
  menuItemsJson?: string;
};

export type PostMenuItemsParams = {
  Key: string;
  Language: string;
};

export type DeleteCustomerDomainParams = {
  key: string;
};

export type PostCustomerDomainParams = {
  key: string;
  domainName?: string;
};

export type PostCustomerLanguagesBody = {
  DefaultLanguage?: string;
  Languages?: string[];
};

export type PostCustomerLanguagesParams = {
  Key: string;
  Language: string;
};

export type PostCustomerSiteConfigurationAssetsBody = {
  Font?: Blob;
  Logo?: Blob;
};

export type PostCustomerSiteConfigurationAssetsParams = {
  Key: string;
  Language: string;
};

export type PostCustomerSiteConfigurationBody = {
  Adress?: string;
  ContactFormVisible?: boolean;
  Currency?: string;
  Email?: string;
  Font?: string;
  InstagramUrl?: string;
  Logo?: string;
  MapUrl?: string;
  Phone?: string;
  SiteMetaTitle?: string;
  SiteName?: string;
  Theme?: string;
  ThemeColorConfig?: string;
};

export type PostCustomerSiteConfigurationParams = {
  Key: string;
  Language: string;
};

export type DeleteCustomerConfigParams = {
  key: string;
};

export type SubscriptionState =
  (typeof SubscriptionState)[keyof typeof SubscriptionState];

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const SubscriptionState = {
  NUMBER_0: 0,
  NUMBER_1: 1,
} as const;

export interface SiteTranslationsResponse {
  aboutTitle?: string;
  allRightsReserved?: string;
  closed?: string;
  contactUs?: string;
  friday?: string;
  gallery?: string;
  menu?: string;
  monday?: string;
  openHours?: string;
  orderNow?: string;
  saturday?: string;
  sunday?: string;
  thursday?: string;
  tuesday?: string;
  wednesday?: string;
}

export interface SiteSectionHeroResponse {
  heroImage?: string;
  orderUrl?: string;
}

export interface SiteSectionGalleryResponse {
  id?: number;
  image?: string;
}

export interface SiteSectionAboutResponse {
  aboutTitle?: string;
  description?: string;
  image?: string;
}

export interface SectionsResponse {
  about?: SiteSectionAboutResponse;
  gallery?: SiteSectionGalleryResponse[];
  hero?: SiteSectionHeroResponse;
}

export interface SectionVisibilityResponse {
  contactFormVisible?: boolean;
}

export interface OpeningHourResponse {
  closeTime?: string;
  day?: CustomDayOfWeek;
  id?: number;
  isClosed?: boolean;
  /** @nullable */
  label?: string | null;
  openTime?: string;
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
  order: number;
  price: number;
  /** @nullable */
  tags?: string | null;
}

export interface MenuCategoryResponse {
  /** @minLength 1 */
  description: string;
  id: number;
  /** @minLength 1 */
  name: string;
  order: number;
}

export interface MenuResponse {
  categories: MenuCategoryResponse[];
  menuItems: MenuItemResponse[];
}

export interface CustomerResponse {
  cancelInfo?: CancelInfo;
  customerConfigs?: CustomerConfigResponse[];
  domain?: string;
  isFirstSignIn?: boolean;
  subscription?: SubscriptionState;
}

export interface CustomerConfigTranslations {
  siteTranslations?: SiteTranslationsResponse;
}

export interface CustomerConfigResponse {
  /** @nullable */
  adress?: string | null;
  availableLanguages?: string[];
  currency?: string;
  /** @nullable */
  customDomain?: string | null;
  defaultLanguage?: string;
  domain?: string;
  /** @nullable */
  email?: string | null;
  /** @nullable */
  font?: string | null;
  heroType?: number;
  /** @nullable */
  instagramUrl?: string | null;
  languages?: string[];
  logo?: string;
  /** @nullable */
  mapUrl?: string | null;
  openingHours?: OpeningHourResponse[];
  /** @nullable */
  phone?: string | null;
  sections?: SectionsResponse;
  sectionVisibility?: SectionVisibilityResponse;
  siteMetaTitle?: string;
  siteName?: string;
  siteTranslations?: SiteTranslationsResponse;
  theme?: string;
  /** @nullable */
  themeColorConfig?: string | null;
}

export interface CustomerConfigMetaResponse {
  currency?: string;
  defaultLanguage?: string;
  domain?: string;
  languages?: string[];
  siteName?: string;
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
  /** @nullable */
  description?: string | null;
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

export const deleteCustomerConfig = (params: DeleteCustomerConfigParams) => {
  return authorizedFetch<void>({
    url: `/Customer/config`,
    method: "DELETE",
    params,
  });
};

export const postCustomerSiteConfiguration = (
  postCustomerSiteConfigurationBody: PostCustomerSiteConfigurationBody,
  params: PostCustomerSiteConfigurationParams,
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
  if (postCustomerSiteConfigurationBody.Currency !== undefined) {
    formData.append("Currency", postCustomerSiteConfigurationBody.Currency);
  }
  if (postCustomerSiteConfigurationBody.ContactFormVisible !== undefined) {
    formData.append(
      "ContactFormVisible",
      postCustomerSiteConfigurationBody.ContactFormVisible.toString(),
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
  if (postCustomerSiteConfigurationBody.MapUrl !== undefined) {
    formData.append("MapUrl", postCustomerSiteConfigurationBody.MapUrl);
  }
  if (postCustomerSiteConfigurationBody.ThemeColorConfig !== undefined) {
    formData.append(
      "ThemeColorConfig",
      postCustomerSiteConfigurationBody.ThemeColorConfig,
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
  params: PostCustomerSiteConfigurationAssetsParams,
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

export const postCustomerLanguages = (
  postCustomerLanguagesBody: PostCustomerLanguagesBody,
  params: PostCustomerLanguagesParams,
) => {
  const formData = new FormData();
  if (postCustomerLanguagesBody.Languages !== undefined) {
    postCustomerLanguagesBody.Languages.forEach((value) =>
      formData.append("Languages", value),
    );
  }
  if (postCustomerLanguagesBody.DefaultLanguage !== undefined) {
    formData.append(
      "DefaultLanguage",
      postCustomerLanguagesBody.DefaultLanguage,
    );
  }

  return authorizedFetch<void>({
    url: `/Customer/languages`,
    method: "POST",
    headers: { "Content-Type": "multipart/form-data" },
    data: formData,
    params,
  });
};

export const postCustomerDomain = (params: PostCustomerDomainParams) => {
  return authorizedFetch<void>({
    url: `/Customer/domain`,
    method: "POST",
    params,
  });
};

export const deleteCustomerDomain = (params: DeleteCustomerDomainParams) => {
  return authorizedFetch<void>({
    url: `/Customer/domain`,
    method: "DELETE",
    params,
  });
};

export const postMenuItems = (
  postMenuItemsBody: PostMenuItemsBody,
  params: PostMenuItemsParams,
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
  params: PostMenuCategoryParams,
) => {
  return authorizedFetch<void>({
    url: `/Menu/category`,
    method: "POST",
    headers: { "Content-Type": "application/json" },
    data: addCategoryRequest,
    params,
  });
};

export const deleteMenuCategory = (params: DeleteMenuCategoryParams) => {
  return authorizedFetch<void>({
    url: `/Menu/category`,
    method: "DELETE",
    params,
  });
};

export const postMenuCategoryOrder = (
  addCategoryRequest: AddCategoryRequest[],
  params: PostMenuCategoryOrderParams,
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

export const getOpeningHour = (params: GetOpeningHourParams) => {
  return authorizedFetch<OpeningHourResponse[]>({
    url: `/OpeningHour`,
    method: "GET",
    params,
  });
};

export const postOpeningHour = (
  addOpeningHourRequest: AddOpeningHourRequest[],
  params: PostOpeningHourParams,
) => {
  return authorizedFetch<void>({
    url: `/OpeningHour`,
    method: "POST",
    headers: { "Content-Type": "application/json" },
    data: addOpeningHourRequest,
    params,
  });
};

export const getPublicGetCustomerConfigMeta = (
  params: GetPublicGetCustomerConfigMetaParams,
) => {
  return authorizedFetch<CustomerConfigMetaResponse>({
    url: `/Public/get-customer-config-meta`,
    method: "GET",
    params,
  });
};

export const getPublicAbout = (params: GetPublicAboutParams) => {
  return authorizedFetch<SiteSectionAboutResponse>({
    url: `/Public/about`,
    method: "GET",
    params,
  });
};

export const getPublicGetCustomerTranslations = (
  params: GetPublicGetCustomerTranslationsParams,
) => {
  return authorizedFetch<CustomerConfigTranslations>({
    url: `/Public/get-customer-translations`,
    method: "GET",
    params,
  });
};

export const getPublicGetCustomerConfig = (
  params: GetPublicGetCustomerConfigParams,
) => {
  return authorizedFetch<CustomerConfigResponse>({
    url: `/Public/get-customer-config`,
    method: "GET",
    params,
  });
};

export const getPublicGetCustomerMenu = (
  params: GetPublicGetCustomerMenuParams,
) => {
  return authorizedFetch<MenuResponse>({
    url: `/Public/get-customer-menu`,
    method: "GET",
    params,
  });
};

export const postPublicContact = (
  contactRequest: ContactRequest,
  params: PostPublicContactParams,
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
  params: PostSectionHeroParams,
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
  params: PostSectionAboutParams,
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

export const postSectionGallery = (
  postSectionGalleryBody: PostSectionGalleryBody,
  params: PostSectionGalleryParams,
) => {
  const formData = new FormData();
  if (postSectionGalleryBody.Image !== undefined) {
    formData.append("Image", postSectionGalleryBody.Image);
  }

  return authorizedFetch<void>({
    url: `/Section/gallery`,
    method: "POST",
    headers: { "Content-Type": "multipart/form-data" },
    data: formData,
    params,
  });
};

export const deleteSectionGallery = (params: DeleteSectionGalleryParams) => {
  return authorizedFetch<void>({
    url: `/Section/gallery`,
    method: "DELETE",
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
export type PostCustomerLanguagesResult = NonNullable<
  Awaited<ReturnType<typeof postCustomerLanguages>>
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
export type GetPublicGetCustomerConfigMetaResult = NonNullable<
  Awaited<ReturnType<typeof getPublicGetCustomerConfigMeta>>
>;
export type GetPublicAboutResult = NonNullable<
  Awaited<ReturnType<typeof getPublicAbout>>
>;
export type GetPublicGetCustomerTranslationsResult = NonNullable<
  Awaited<ReturnType<typeof getPublicGetCustomerTranslations>>
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
export type PostSectionGalleryResult = NonNullable<
  Awaited<ReturnType<typeof postSectionGallery>>
>;
export type DeleteSectionGalleryResult = NonNullable<
  Awaited<ReturnType<typeof deleteSectionGallery>>
>;
export type PostWebhookResult = NonNullable<
  Awaited<ReturnType<typeof postWebhook>>
>;
