import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Allow a 4 MiB image plus multipart overhead through Server Actions.
    serverActions: { bodySizeLimit: "4.5mb" },
  },
  turbopack: { root: process.cwd() },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.public.blob.vercel-storage.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "cdn.simpleicons.org" },
    ],
  },
  transpilePackages: ["three"],
};

export default nextConfig;
