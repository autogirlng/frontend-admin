/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "res.cloudinary.com",
      },
    ],
  },
  webpack: (config: { optimization: { minimize: boolean; }; }, { }: any) => {
    config.optimization.minimize = false; // This will help us see clearer error messages
    return config;
  },
  experimental: {
    // Enable more detailed error reporting
    webpackBuildWorker: false,
  }
};

module.exports = nextConfig; 