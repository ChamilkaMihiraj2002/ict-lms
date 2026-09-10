import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep isolated test servers separate from an existing development session.
  distDir: process.env.NEXT_BUILD_DIR || '.next',
};

export default nextConfig;
