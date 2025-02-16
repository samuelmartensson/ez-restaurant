/**
 * Generated by orval v7.3.0 🍺
 * Do not edit manually.
 * backend
 * OpenAPI spec version: 1.0
 */
import { authorizedFetch } from "../authorized-fetch";
export type PutSectionNewsIdAssetsBody = {
  Image?: Blob;
  removedAssets?: string[];
};

export type PutSectionNewsIdAssetsParams = {
  Key: string;
  Language: string;
};

export type PutSectionNewsIdParams = {
  Key: string;
  Language: string;
};

export type DeleteSectionNewsIdParams = {
  Key: string;
  Language: string;
};

export type GetSectionNewsId200 = { [key: string]: NewsArticleResponse };

export type GetSectionNewsIdParams = {
  Key: string;
  Language: string;
};

export type PostSectionNewsParams = {
  Key: string;
  Language: string;
};

export type GetSectionNewsParams = {
  Key: string;
  Language: string;
};

export type DeleteSectionGalleryParams = {
  id?: number;
  Key: string;
  Language: string;
};

export type PostSectionGalleryBody = {
  Images?: Blob[];
};

export type PostSectionGalleryParams = {
  Key: string;
  Language: string;
};

export type PostSectionAboutAssetsBody = {
  Image?: Blob;
  removedAssets?: string[];
};

export type PostSectionAboutAssetsParams = {
  Key: string;
  Language: string;
};

export type PostSectionAboutParams = {
  Key: string;
  Language: string;
};

export type GetSectionAbout200 = { [key: string]: AboutResponse };

export type GetSectionAboutParams = {
  Key: string;
  Language: string;
};

export type PostSectionHeroAssetsBody = {
  Image?: Blob;
  removedAssets?: string[];
};

export type PostSectionHeroAssetsParams = {
  Key: string;
  Language: string;
};

export type PostSectionHeroParams = {
  key: string;
};

export type GetSectionHero200 = { [key: string]: HeroResponse };

export type GetSectionHeroParams = {
  Key: string;
  Language: string;
};

export type PostPublicContactParams = {
  key: string;
};

export type GetPublicGetCustomerMenuParams = {
  Key: string;
  Language: string;
  cache?: boolean;
};

export type GetPublicGetCustomerConfigParams = {
  Key: string;
  Language: string;
  cache?: boolean;
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

export type GetCustomerAnalyticsParams = {
  key: string;
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
  FacebookUrl?: string;
  Font?: string;
  InstagramUrl?: string;
  Logo?: string;
  MapUrl?: string;
  Phone?: string;
  Theme?: string;
  ThemeColorConfig?: string;
  TiktokUrl?: string;
};

export type PostCustomerSiteConfigurationParams = {
  Key: string;
  Language: string;
};

export type DeleteCustomerConfigParams = {
  key: string;
};

export interface UploadHeroLocalizedFields {
  /** @nullable */
  siteMetaTitle?: string | null;
  /** @nullable */
  siteName?: string | null;
}

export type UploadHeroRequestLocalizedFields = {
  [key: string]: UploadHeroLocalizedFields;
};

export interface UploadHeroRequest {
  localizedFields?: UploadHeroRequestLocalizedFields;
  /** @nullable */
  orderUrl?: string | null;
}

export interface UploadAboutLocalizedFields {
  /** @nullable */
  description?: string | null;
}

export type UploadAboutRequestLocalizedFields = {
  [key: string]: UploadAboutLocalizedFields;
};

export interface UploadAboutRequest {
  localizedFields?: UploadAboutRequestLocalizedFields;
}

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
  news?: string;
  openHours?: string;
  openHoursCta?: string;
  openHoursToday?: string;
  orderNow?: string;
  readMore?: string;
  saturday?: string;
  sunday?: string;
  thursday?: string;
  tuesday?: string;
  wednesday?: string;
}

export interface SiteSectionHeroResponse {
  heroImage?: string;
  orderUrl?: string;
  siteMetaTitle?: string;
  siteName?: string;
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
  newsArticles?: NewsArticleResponse[];
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

export interface NewsArticleResponse {
  content?: string;
  date?: string;
  id?: number;
  /** @nullable */
  image?: string | null;
  published?: boolean;
  title?: string;
  updatedAt?: string;
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

export interface HeroResponse {
  heroImage?: string;
  orderUrl?: string;
  siteMetaTitle?: string;
  siteName?: string;
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
  facebookUrl?: string | null;
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
  /** @nullable */
  tiktokUrl?: string | null;
}

export interface CustomerResponse {
  cancelInfo?: CancelInfo;
  customerConfigs?: CustomerConfigResponse[];
  domain?: string;
  isFirstSignIn?: boolean;
  subscription?: SubscriptionState;
}

export interface CustomerConfigMetaResponse {
  currency?: string;
  defaultLanguage?: string;
  domain?: string;
  /** @nullable */
  image?: string | null;
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

export type AnalyticsResponsePreviousMenu = { [key: string]: string };

export type AnalyticsResponsePrevious = { [key: string]: string };

export type AnalyticsResponseCurrentMenu = { [key: string]: string };

export type AnalyticsResponseCurrent = { [key: string]: string };

export interface AnalyticsResponse {
  current?: AnalyticsResponseCurrent;
  currentMenu?: AnalyticsResponseCurrentMenu;
  previous?: AnalyticsResponsePrevious;
  previousMenu?: AnalyticsResponsePreviousMenu;
}

export interface AddOpeningHourRequest {
  closeTime?: string;
  id?: number;
  isClosed?: boolean;
  /** @nullable */
  label?: string | null;
  openTime?: string;
}

export interface AddNewsArticleLocalizedFields {
  content?: string;
  title?: string;
}

export type AddNewsArticleRequestLocalizedFields = {
  [key: string]: AddNewsArticleLocalizedFields;
};

export interface AddNewsArticleRequest {
  localizedFields?: AddNewsArticleRequestLocalizedFields;
  published?: boolean;
  removeImage?: boolean;
}

export interface AddCategoryRequest {
  /** @nullable */
  description?: string | null;
  id?: number;
  name?: string;
  /** @nullable */
  order?: number | null;
}

export interface AboutResponse {
  description?: string;
  image?: string;
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
  if (postCustomerSiteConfigurationBody.TiktokUrl !== undefined) {
    formData.append("TiktokUrl", postCustomerSiteConfigurationBody.TiktokUrl);
  }
  if (postCustomerSiteConfigurationBody.FacebookUrl !== undefined) {
    formData.append(
      "FacebookUrl",
      postCustomerSiteConfigurationBody.FacebookUrl,
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

export const getCustomerAnalytics = (params: GetCustomerAnalyticsParams) => {
  return authorizedFetch<AnalyticsResponse>({
    url: `/Customer/analytics`,
    method: "GET",
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

export const getSectionHero = (params: GetSectionHeroParams) => {
  return authorizedFetch<GetSectionHero200>({
    url: `/Section/hero`,
    method: "GET",
    params,
  });
};

export const postSectionHero = (
  uploadHeroRequest: UploadHeroRequest,
  params: PostSectionHeroParams,
) => {
  return authorizedFetch<void>({
    url: `/Section/hero`,
    method: "POST",
    headers: { "Content-Type": "application/json" },
    data: uploadHeroRequest,
    params,
  });
};

export const postSectionHeroAssets = (
  postSectionHeroAssetsBody: PostSectionHeroAssetsBody,
  params: PostSectionHeroAssetsParams,
) => {
  const formData = new FormData();
  if (postSectionHeroAssetsBody.Image !== undefined) {
    formData.append("Image", postSectionHeroAssetsBody.Image);
  }
  if (postSectionHeroAssetsBody.removedAssets !== undefined) {
    postSectionHeroAssetsBody.removedAssets.forEach((value) =>
      formData.append("removedAssets", value),
    );
  }

  return authorizedFetch<void>({
    url: `/Section/hero/assets`,
    method: "POST",
    headers: { "Content-Type": "multipart/form-data" },
    data: formData,
    params,
  });
};

export const getSectionAbout = (params: GetSectionAboutParams) => {
  return authorizedFetch<GetSectionAbout200>({
    url: `/Section/about`,
    method: "GET",
    params,
  });
};

export const postSectionAbout = (
  uploadAboutRequest: UploadAboutRequest,
  params: PostSectionAboutParams,
) => {
  return authorizedFetch<void>({
    url: `/Section/about`,
    method: "POST",
    headers: { "Content-Type": "application/json" },
    data: uploadAboutRequest,
    params,
  });
};

export const postSectionAboutAssets = (
  postSectionAboutAssetsBody: PostSectionAboutAssetsBody,
  params: PostSectionAboutAssetsParams,
) => {
  const formData = new FormData();
  if (postSectionAboutAssetsBody.Image !== undefined) {
    formData.append("Image", postSectionAboutAssetsBody.Image);
  }
  if (postSectionAboutAssetsBody.removedAssets !== undefined) {
    postSectionAboutAssetsBody.removedAssets.forEach((value) =>
      formData.append("removedAssets", value),
    );
  }

  return authorizedFetch<void>({
    url: `/Section/about/assets`,
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
  if (postSectionGalleryBody.Images !== undefined) {
    postSectionGalleryBody.Images.forEach((value) =>
      formData.append("Images", value),
    );
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

export const getSectionNews = (params: GetSectionNewsParams) => {
  return authorizedFetch<NewsArticleResponse[]>({
    url: `/Section/news`,
    method: "GET",
    params,
  });
};

export const postSectionNews = (
  addNewsArticleRequest: AddNewsArticleRequest,
  params: PostSectionNewsParams,
) => {
  return authorizedFetch<void>({
    url: `/Section/news`,
    method: "POST",
    headers: { "Content-Type": "application/json" },
    data: addNewsArticleRequest,
    params,
  });
};

export const getSectionNewsId = (
  id: number,
  params: GetSectionNewsIdParams,
) => {
  return authorizedFetch<GetSectionNewsId200>({
    url: `/Section/news/${id}`,
    method: "GET",
    params,
  });
};

export const deleteSectionNewsId = (
  id: number,
  params: DeleteSectionNewsIdParams,
) => {
  return authorizedFetch<void>({
    url: `/Section/news/${id}`,
    method: "DELETE",
    params,
  });
};

export const putSectionNewsId = (
  id: number,
  addNewsArticleRequest: AddNewsArticleRequest,
  params: PutSectionNewsIdParams,
) => {
  return authorizedFetch<void>({
    url: `/Section/news/${id}`,
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    data: addNewsArticleRequest,
    params,
  });
};

export const putSectionNewsIdAssets = (
  id: number,
  putSectionNewsIdAssetsBody: PutSectionNewsIdAssetsBody,
  params: PutSectionNewsIdAssetsParams,
) => {
  const formData = new FormData();
  if (putSectionNewsIdAssetsBody.Image !== undefined) {
    formData.append("Image", putSectionNewsIdAssetsBody.Image);
  }
  if (putSectionNewsIdAssetsBody.removedAssets !== undefined) {
    putSectionNewsIdAssetsBody.removedAssets.forEach((value) =>
      formData.append("removedAssets", value),
    );
  }

  return authorizedFetch<void>({
    url: `/Section/news/${id}/assets`,
    method: "PUT",
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
export type PostCustomerLanguagesResult = NonNullable<
  Awaited<ReturnType<typeof postCustomerLanguages>>
>;
export type PostCustomerDomainResult = NonNullable<
  Awaited<ReturnType<typeof postCustomerDomain>>
>;
export type DeleteCustomerDomainResult = NonNullable<
  Awaited<ReturnType<typeof deleteCustomerDomain>>
>;
export type GetCustomerAnalyticsResult = NonNullable<
  Awaited<ReturnType<typeof getCustomerAnalytics>>
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
export type GetSectionHeroResult = NonNullable<
  Awaited<ReturnType<typeof getSectionHero>>
>;
export type PostSectionHeroResult = NonNullable<
  Awaited<ReturnType<typeof postSectionHero>>
>;
export type PostSectionHeroAssetsResult = NonNullable<
  Awaited<ReturnType<typeof postSectionHeroAssets>>
>;
export type GetSectionAboutResult = NonNullable<
  Awaited<ReturnType<typeof getSectionAbout>>
>;
export type PostSectionAboutResult = NonNullable<
  Awaited<ReturnType<typeof postSectionAbout>>
>;
export type PostSectionAboutAssetsResult = NonNullable<
  Awaited<ReturnType<typeof postSectionAboutAssets>>
>;
export type PostSectionGalleryResult = NonNullable<
  Awaited<ReturnType<typeof postSectionGallery>>
>;
export type DeleteSectionGalleryResult = NonNullable<
  Awaited<ReturnType<typeof deleteSectionGallery>>
>;
export type GetSectionNewsResult = NonNullable<
  Awaited<ReturnType<typeof getSectionNews>>
>;
export type PostSectionNewsResult = NonNullable<
  Awaited<ReturnType<typeof postSectionNews>>
>;
export type GetSectionNewsIdResult = NonNullable<
  Awaited<ReturnType<typeof getSectionNewsId>>
>;
export type DeleteSectionNewsIdResult = NonNullable<
  Awaited<ReturnType<typeof deleteSectionNewsId>>
>;
export type PutSectionNewsIdResult = NonNullable<
  Awaited<ReturnType<typeof putSectionNewsId>>
>;
export type PutSectionNewsIdAssetsResult = NonNullable<
  Awaited<ReturnType<typeof putSectionNewsIdAssets>>
>;
export type PostWebhookResult = NonNullable<
  Awaited<ReturnType<typeof postWebhook>>
>;
