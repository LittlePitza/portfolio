import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    // The deployment this build belongs to. Inlined into both the browser bundle and the
    // /api/version route, so an open tab can tell when a newer deployment has gone live.
    // Vercel provides both variables at build time; locally they are empty and the check is off.
    NEXT_PUBLIC_DEPLOYMENT_ID: process.env.NEXT_DEPLOYMENT_ID || process.env.VERCEL_DEPLOYMENT_ID || "",
  },
};

export default nextConfig;
