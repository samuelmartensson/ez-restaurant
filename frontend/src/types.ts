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
  theme: string;
  customer_id: number;
  heroUrl: string;
  domain: string;
  menu: MenuItem[];
}
