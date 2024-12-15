export const getURL = (key: string, endpoint: string) => {
  const base = "http://localhost:5232/customer/";
  return `${base}${endpoint}?key=${key}`;
};
