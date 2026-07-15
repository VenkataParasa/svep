import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    "/**": ["./prisma/dev.db"]
  },
  output: "standalone",
  /* config options here */
};

export default nextConfig;
