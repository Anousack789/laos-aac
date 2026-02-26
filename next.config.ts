import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  experimental: {
    workerThreads: false,
    cpus: 1,
  },
  images: {
    remotePatterns:
      process.env.NODE_ENV === "production"
        ? [
            {
              protocol: "https",
              hostname: "example.com",
            },
          ]
        : [
            {
              protocol: "http",
              hostname: "localhost",
            },
          ],
  },
};

export default nextConfig;
