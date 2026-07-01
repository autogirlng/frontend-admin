"use client";

import { useSession } from "next-auth/react";
import { useGetMyProfile } from "./profile/useProfile";
import { AccessibleRoute } from "@/types/route-access";

/**
 * Returns the list of routes the current user can access.
 * Returns null while the session is still loading — consumers should treat
 * null as "unknown / loading" and not render gated content until resolved.
 * Returns [] when authenticated with no restrictions (show everything).
 */
export function useAccessibleRoutes(): AccessibleRoute[] | null {
  const { data: session, status } = useSession();
  const { data: profile } = useGetMyProfile();

  if (status === "loading") return null;

  return profile?.accessibleRoutes ?? session?.user?.accessibleRoutes ?? [];
}
