export interface MenuItem {
  name: string;
  category: string;
  price: number;
  description: string;
  tags: string;
  image: string;
  id: number;
  tempId: string;
}

export interface CustomerConfig {
  fontUrl: string;
  customer_id: number;
  heroUrl: string;
  iconUrl: string;
  domain: string;
  theme: string;
  siteName: string;
  siteMetaTitle: string;
  logo: string;
  adress?: string;
  phone?: string;
  email?: string;
  menu: MenuItem[];
}
