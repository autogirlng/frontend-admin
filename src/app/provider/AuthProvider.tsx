"use client";

import { useAuth } from "@/hooks/use_auth";
import { ReactNode } from "react";

interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  useAuth();

  return <>{children}</>;
};

export default AuthProvider;
