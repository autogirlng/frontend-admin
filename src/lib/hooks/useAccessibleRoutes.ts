"use client";

import { useSession } from "next-auth/react";
import { useGetMyProfile } from "./profile/useProfile";
import { AccessibleRoute } from "@/types/route-access";

export function useAccessibleRoutes(): AccessibleRoute[] {
  const { data: session } = useSession();
  const { data: profile } = useGetMyProfile();

  return profile?.accessibleRoutes ?? session?.user?.accessibleRoutes ?? [];
}
