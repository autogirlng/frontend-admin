// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "res.cloudinary.com",
        pathname: "/do8zvgqpg/image/upload/**", // For standard images
      },
      {
        protocol: "http",
        hostname: "res.cloudinary.com",
        pathname: "/do8zvgqpg/raw/upload/**", // To also allow raw uploads
      },
    ],
  },
};

export default nextConfig;
