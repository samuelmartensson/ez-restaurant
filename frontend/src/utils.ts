const base = process.env.NEXT_PUBLIC_BACKEND_API_URL;
export const getURL = (key: string, endpoint: string) => {
  const url = `${base}/customer/`;
  return `${url}${endpoint}?key=${key}`;
};
