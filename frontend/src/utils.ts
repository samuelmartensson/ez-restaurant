export function setCookie(name: string, value: string, days: number) {
  let expires = "";
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

export const GTAG_CATEGORY = {
  MENU_CLICKS: "menuClicks",
  ORDER_NOW_CLICKS: "orderNowClicks",
  SOCIAL_LINKS: "socialLinks",
} as const;

const GtagCategories = {
  [GTAG_CATEGORY.SOCIAL_LINKS]: "Social links",
  [GTAG_CATEGORY.MENU_CLICKS]: "Menu clicks",
  [GTAG_CATEGORY.ORDER_NOW_CLICKS]: "Order now clicks",
};

export function gtagEvent(
  category: (
    categories: typeof GTAG_CATEGORY
  ) => (typeof GTAG_CATEGORY)[keyof typeof GTAG_CATEGORY],
  label: string
) {
  window.gtag("event", "click", {
    event_category: GtagCategories[category(GTAG_CATEGORY)],
    event_label: label,
  });
}
