import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, hasLocale, locales } from "@/i18n/config";

function pickLocale(request: NextRequest): string {
  const cookie = request.cookies.get("locale")?.value;
  if (cookie && hasLocale(cookie)) return cookie;
  const header = request.headers.get("accept-language") ?? "";
  const preferred = header
    .split(",")
    .map((part) => part.split(";")[0]?.trim().slice(0, 2).toLowerCase())
    .find((code) => code && hasLocale(code));
  return preferred ?? defaultLocale;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasPrefix = locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );
  if (hasPrefix) return;

  const url = request.nextUrl.clone();
  url.pathname = `/${pickLocale(request)}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  // Skip Next internals, the API, the CV files, the generated Apple icon (served without an
  // extension) and anything with an extension. In a plain string a single backslash before
  // the dot is dropped, which would exclude every path, so it is doubled.
  matcher: ["/((?!_next/|api/|cv/|apple-icon|.*\\..*).*)"],
};
