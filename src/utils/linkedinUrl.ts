/**
 * Helpers for detecting and parsing LinkedIn post URLs.
 *
 * A LinkedIn "post" URL can take several shapes:
 *   - https://www.linkedin.com/posts/<slug>-<digits>-<suffix>
 *   - https://www.linkedin.com/feed/update/urn:li:activity:<digits>/
 *   - https://www.linkedin.com/feed/update/urn:li:share:<digits>/
 *   - https://www.linkedin.com/embed/feed/update/urn:li:share:<digits>
 */

export function isLinkedInPostUrl(url: string | null | undefined): boolean {
  if (!url || typeof url !== "string") return false;
  try {
    const u = new URL(url);
    if (!/(^|\.)linkedin\.com$/i.test(u.hostname)) return false;
    const p = u.pathname;
    if (/\/posts\//i.test(p)) return true;
    if (/\/feed\/update\/urn:li:(activity|share|ugcPost):\d+/i.test(p)) return true;
    if (/\/embed\/feed\/update\/urn:li:(activity|share|ugcPost):\d+/i.test(p)) return true;
    return false;
  } catch {
    return false;
  }
}

/**
 * Extract a `urn:li:activity:<id>` from a LinkedIn post URL when possible.
 * Returns null if the URL doesn't carry an activity id (e.g. a vanity /posts/ slug
 * without a trailing numeric id pattern).
 */
export function extractActivityUrnFromUrl(
  url: string | null | undefined
): string | null {
  if (!url || typeof url !== "string") return null;

  // Explicit urn in path
  const explicit = url.match(/urn:li:(?:activity|share|ugcPost):(\d+)/i);
  if (explicit) {
    // Normalize to activity URN — that's what /posts/ slugs encode.
    return `urn:li:activity:${explicit[1]}`;
  }

  // /posts/<slug>-<digits>-<suffix>  — the digits are the activity id.
  const slug = url.match(/\/posts\/[^/?#]*?-(\d{10,})-[a-z0-9]+/i);
  if (slug) return `urn:li:activity:${slug[1]}`;

  return null;
}
