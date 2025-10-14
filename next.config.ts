import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "c.saavncdn.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "www.jiosaavn.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "wsrv.nl",
        port: "",
      },
      {
        protocol: "https",
        hostname: "pli.saavncdn.com",
        port: "",
      },
    ],
  },
};

export default nextConfig;
