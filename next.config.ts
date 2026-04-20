import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Note: For Docker deployment, set NEXT_OUTPUT=standalone env var or use:
  // output: "standalone",
  // For local development and standard deployment, omit output config
  images: {
    unoptimized: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
};

export default nextConfig;
