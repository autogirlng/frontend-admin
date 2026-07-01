import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { AccessibleRoute } from "@/types/route-access";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  if (pathname === "/login") {
    if (token) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    return NextResponse.next();
  }

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Route access control — only enforced when the server has provided a route list
  const accessibleRoutes = (token.accessibleRoutes as AccessibleRoute[] | undefined) ?? [];

  if (accessibleRoutes.length > 0) {
    // /dashboard root is always the safe fallback; never block it
    if (pathname !== "/dashboard") {
      const isAllowed = accessibleRoutes.some(
        (route) =>
          pathname === route.href || pathname.startsWith(route.href + "/"),
      );

      if (!isAllowed) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/dashboard/:path*", "/login"],
};
