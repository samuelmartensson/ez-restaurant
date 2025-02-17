import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export const CUSTOMER_ID_HEADER = "x-customer-id";

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const headers = new Headers(request.headers);
  const url = new URL(request.url);
  const hostname = url.hostname;
  const parts = hostname.split(".");

  if (hostname === "localhost") {
    const key =
      url.searchParams.get("key") ?? process.env.TEST_CUSTOMER ?? "test";
    headers.set(CUSTOMER_ID_HEADER, key);

    return NextResponse.next({ headers });
  }
  const domain = parts.length > 2 ? parts[1] : null;

  if (domain !== "ezrest") {
    headers.set(CUSTOMER_ID_HEADER, hostname);
    return NextResponse.next({ headers });
  }

  let customerId = "";

  if (parts.length > 2) {
    customerId = parts[0];
  } else {
    customerId = hostname;
  }

  headers.set(CUSTOMER_ID_HEADER, customerId);
  return NextResponse.next({ headers });
}
