import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // Since we're using Biome instead
  },
  transpilePackages: ["@bleu-builders/tech-challenge-ui"],
};

export default nextConfig;
