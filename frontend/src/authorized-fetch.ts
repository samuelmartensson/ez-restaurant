const baseURL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

export const authorizedFetch = async <T>({
  url,
  method,
  params,
  data,
  signal,
}: {
  url: string;
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  headers?: HeadersInit;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  params?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any;
  signal?: AbortSignal;
}): Promise<T> => {
  const urlParameters = new URLSearchParams();

  // Convert arrays in query param to repeated query parameters (FastAPI default behaviour)
  for (const key in params) {
    if (Array.isArray(params[key])) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      params[key].forEach((value: any) => {
        urlParameters.append(key, value);
      });
    } else {
      urlParameters.append(key, params[key]);
    }
  }

  const finalURL = `${baseURL}${url}?${urlParameters.toString()}`;

  const response = await fetch(finalURL, {
    method,
    signal,
    ...(data ? { body: JSON.stringify(data) } : {}),
  });

  if (response.status >= 400) {
    throw await response.json();
  }

  return response.json();
};

export default authorizedFetch;
