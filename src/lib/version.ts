/** The deployment this copy of the site was built for. Empty in local development. */
const BUILD = process.env.NEXT_PUBLIC_DEPLOYMENT_ID || "";

/** Don't ask the server more than once in this window, however many events fire. */
const MIN_GAP_MS = 15_000;

let stale = false;
let lastCheck = 0;
let inflight: Promise<boolean> | null = null;

/** True once a newer deployment has been seen. It never goes back to false in this document. */
export function isStale() {
  return stale;
}

/**
 * Ask the live site which deployment it is serving. Resolves true when this page is
 * out of date. Network errors resolve false: an offline visitor keeps what they have.
 */
export function checkForUpdate(force = false): Promise<boolean> {
  if (!BUILD) return Promise.resolve(false);
  if (stale) return Promise.resolve(true);
  if (inflight) return inflight;
  const now = Date.now();
  if (!force && now - lastCheck < MIN_GAP_MS) return Promise.resolve(false);
  lastCheck = now;
  inflight = fetch(`/api/version?t=${now}`, { cache: "no-store" })
    .then((res) => (res.ok ? (res.json() as Promise<{ id?: string | null }>) : null))
    .then((data) => {
      if (data?.id && data.id !== BUILD) stale = true;
      return stale;
    })
    .catch(() => false)
    .finally(() => {
      inflight = null;
    });
  return inflight;
}
