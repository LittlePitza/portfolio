import type { NextConfig } from "next";
import { locales } from "./src/i18n/config";

const nextConfig: NextConfig = {
  env: {
    // The deployment this build belongs to. Inlined into both the browser bundle and the
    // /api/version route, so an open tab can tell when a newer deployment has gone live.
    // Vercel provides both variables at build time; locally they are empty and the check is off.
    NEXT_PUBLIC_DEPLOYMENT_ID: process.env.NEXT_DEPLOYMENT_ID || process.env.VERCEL_DEPLOYMENT_ID || "",
    // The build stamp (src/lib/build.ts): the deployed commit and the moment this build ran.
    // Without a commit, as locally, the stamp reads "build local".
    BUILD_COMMIT: process.env.VERCEL_GIT_COMMIT_SHA || "",
    BUILD_DATE: new Date().toISOString(),
  },
  async redirects() {
    return [
      // The index moved from /playground to /work (docs/02-diseno-v2.md, section 6.5).
      { source: `/:locale(${locales.join("|")})/playground`, destination: "/:locale/work", permanent: true },
    ];
  },
};

export default nextConfig;
