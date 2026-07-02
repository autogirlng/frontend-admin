import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { AccessibleRoute } from "@/types/route-access";
import {
  KNOWN_PAGE_HREFS,
  ROUTE_PREFIX_ALIASES,
} from "@/data/known-page-hrefs";

async function getAccessibleRoutes(
  accessToken: string,
): Promise<AccessibleRoute[] | null> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });
    if (!res.ok) return null;
    const body = await res.json();
    return body?.data?.accessibleRoutes ?? null;
  } catch {
    return null;
  }
}

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  if (pathname === "/login") {
    if (token) return NextResponse.redirect(new URL("/dashboard", req.url));
    return NextResponse.next();
  }

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const jwtRoutes =
    (token.accessibleRoutes as AccessibleRoute[] | undefined) ?? [];
  const freshRoutes = token.accessToken
    ? await getAccessibleRoutes(token.accessToken as string)
    : null;

  const accessibleRoutes: AccessibleRoute[] = freshRoutes ?? jwtRoutes;

  if (accessibleRoutes.length > 0 && pathname !== "/dashboard") {
    const allowedHrefs = new Set(accessibleRoutes.map((r) => r.href));

    const resolvedPathname = (() => {
      for (const [aliasPrefix, parentRoute] of Object.entries(
        ROUTE_PREFIX_ALIASES,
      )) {
        if (
          pathname === aliasPrefix ||
          pathname.startsWith(aliasPrefix + "/")
        ) {
          return parentRoute;
        }
      }
      return pathname;
    })();

    const isAllowed = (() => {
      if (allowedHrefs.has(resolvedPathname)) return true;

      let bestParent: string | null = null;
      for (const href of allowedHrefs) {
        if (href === "/dashboard") continue;
        if (
          resolvedPathname.startsWith(href + "/") &&
          (bestParent === null || href.length > bestParent.length)
        ) {
          bestParent = href;
        }
      }

      if (!bestParent) return false;

      return !KNOWN_PAGE_HREFS.has(pathname);
    })();

    if (!isAllowed) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/dashboard/:path*", "/login"],
};
