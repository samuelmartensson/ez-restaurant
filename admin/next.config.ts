import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        hostname: "ez-rest.s3.eu-north-1.amazonaws.com",
        protocol: "https",
      },
    ],
  },
};

export default nextConfig;
