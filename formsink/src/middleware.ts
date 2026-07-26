import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";

// Guards /dashboard. Runs on the Edge runtime, so it only verifies the
// session cookie's signature — no database access here.
export async function middleware(request: NextRequest) {
  const token = request.cookies.get("session")?.value;

  let valid = false;
  if (token && process.env.AUTH_SECRET) {
    try {
      await jwtVerify(token, new TextEncoder().encode(process.env.AUTH_SECRET));
      valid = true;
    } catch {
      valid = false;
    }
  }

  if (!valid) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
