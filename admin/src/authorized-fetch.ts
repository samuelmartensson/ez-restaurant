const baseURL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

function getCookieValue(cookieName: string) {
  const cookies = document.cookie.split("; ");
  for (const cookie of cookies) {
    const [name, value] = cookie.split("=");
    if (name === cookieName) {
      return value;
    }
  }
  return null; // Return null if the cookie is not found
}

export const authorizedFetch = async <T>({
  url,
  method,
  params,
  data,
  headers,
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
  const token = getCookieValue("__session");

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
  const isFormData =
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (headers as any)?.["Content-Type"] === "multipart/form-data";

  const response = await fetch(finalURL, {
    method,
    headers: {
      ...(!isFormData ? headers : {}),
      Authorization: `Bearer ${token}`,
    },
    signal,
    ...(data ? { body: isFormData ? data : JSON.stringify(data) } : {}),
  });

  if (!response.headers.get("Content-Type")?.includes("application/json")) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return response.blob() as any;
  }

  if (response.status >= 400) {
    throw await response.json();
  }

  return response.json();
};

export default authorizedFetch;
