import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
    ],
  },
};

export default nextConfig;
