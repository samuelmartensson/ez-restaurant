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
    headers.set(CUSTOMER_ID_HEADER, "burrito.com");
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
