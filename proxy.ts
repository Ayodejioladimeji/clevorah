import { NextResponse, type NextRequest } from "next/server";
import { readSessionToken, SESSION_COOKIE } from "./lib/token";

function secretPath() {
  const value = process.env.ADMIN_PATH || "/desk--/clevorah--/admin";
  const withSlash = value.startsWith("/") ? value : `/${value}`;
  return withSlash.endsWith("/") ? withSlash.slice(0, -1) : withSlash;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname === "/studio" || pathname.startsWith("/studio/")) {
    const missing = request.nextUrl.clone();
    missing.pathname = "/this-page-is-not-published";
    return NextResponse.rewrite(missing);
  }
  const secret = secretPath();
  if (pathname === secret || pathname.startsWith(`${secret}/`)) {
    const session = await readSessionToken(request.cookies.get(SESSION_COOKIE)?.value);
    const rest = pathname.slice(secret.length);
    if (!session && rest && rest !== "/") return NextResponse.redirect(new URL(secret, request.url));
    const url = request.nextUrl.clone();
    url.pathname = `/studio${rest === "/" ? "" : rest}`;
    const headers = new Headers(request.headers);
    headers.set("x-pathname", pathname);
    return NextResponse.rewrite(url, { request: { headers } });
  }
  const headers = new Headers(request.headers);
  headers.set("x-pathname", pathname);
  return NextResponse.next({ request: { headers } });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|.*\\..*).*)"],
};
