import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { AccessibleRoute } from "@/types/route-access";

async function getAccessibleRoutes(
  accessToken: string,
): Promise<AccessibleRoute[] | null> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/me`, {
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
    const isAllowed = accessibleRoutes.some(
      (route) =>
        pathname === route.href || pathname.startsWith(route.href + "/"),
    );
    if (!isAllowed) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/dashboard/:path*", "/login"],
};
