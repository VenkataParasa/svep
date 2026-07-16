import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    "/**": ["./prisma/dev.db"]
  },
  output: process.env.VERCEL ? undefined : "standalone",
  /* config options here */
};

export default nextConfig;
