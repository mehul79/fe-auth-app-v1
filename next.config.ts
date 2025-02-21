import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://be-auth-app-v1.onrender.com/api/:path*",
      },
    ];
  },
  /* config options here */
};

export default nextConfig;
