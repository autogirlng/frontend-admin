// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "", // Leave empty if no specific port is used
        pathname: "/do57qlfgn/image/upload/**", // ** allows any path after /image/upload/
      },
    ],
  },
};

module.exports = nextConfig;
