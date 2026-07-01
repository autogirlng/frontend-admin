import "next-auth";
import { JWT } from "next-auth/jwt";
import { AccessibleRoute } from "@/types/route-access";

declare module "next-auth" {
  interface User {
    id: string;
    accessToken: string;
    refreshToken: string;
    accessibleRoutes: AccessibleRoute[];
  }
  interface Session {
    user: User;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    accessToken: string;
    refreshToken: string;
    accessibleRoutes: AccessibleRoute[];
  }
}
