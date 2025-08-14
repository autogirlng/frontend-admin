import React from "react";
import Image from "next/image";
import { ImageAssets } from "@/utils/ImageAssets";

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="flex w-full shadow-lg overflow-hidden bg-white">
      {/* Left Side - Image Section */}
      <div className="hidden md:flex md:w-1/2 h-screen relative">
        <Image
          src="/images/auth-bg.jpeg"
          alt="Car"
          layout="fill"
          objectFit="cover"
          priority
        />
        <div className="absolute inset-0 bg-transparent flex items-start p-6">
          <Image
            src={ImageAssets.logo}
            alt="Muvement Logo"
            width={200}
            height={45}
          />
        </div>
      </div>

      {/* Right Side - Dynamic Content */}
      <div className="w-full sm:w-1/2 h-screen flex flex-col justify-center items-center">
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
