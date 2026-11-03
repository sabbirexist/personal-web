import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: { unoptimized: true },
  allowedDevOrigins: ["127.0.0.1", "localhost"],
  devIndicators: false,
};

export default nextConfig;
