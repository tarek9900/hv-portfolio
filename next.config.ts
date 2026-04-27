import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/index.html",
        destination: "/",
        permanent: false
      },
      {
        source: "/portfolio.html",
        destination: "/portfolio",
        permanent: false
      }
    ];
  },
  images: {
    remotePatterns: []
  }
};

export default nextConfig;
