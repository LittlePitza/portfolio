export const dynamic = "force-dynamic";

/**
 * Which deployment is live right now. Never cached. Requests from the page do not
 * carry a deployment header, so Vercel's skew protection does not pin them to the
 * deployment an old tab was loaded from: the answer is always the current one.
 */
export function GET() {
  return Response.json({ id: process.env.NEXT_PUBLIC_DEPLOYMENT_ID || null }, { headers: { "Cache-Control": "no-store, max-age=0" } });
}
