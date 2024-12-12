import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const customerId = request.nextUrl.searchParams.get("customer") ?? "";
  const headers = new Headers(request.headers);
  headers.set("x-customer-id", customerId);

  return NextResponse.next({ headers });
}
