/**
 * Lightweight route module prefetcher.
 *
 * When the user hovers a nav button, we kick off the dynamic import for the
 * target page so that by the time they actually click, the chunk is already
 * downloaded. No-op on touch devices (hover never fires) — touch users still
 * get the lazy load on click, which is fine because chunks are small.
 */

type Prefetcher = () => Promise<unknown>;

const prefetched = new Set<string>();

const ROUTE_PREFETCHERS: Record<string, Prefetcher> = {
  '/dashboard': () => import('@/pages/Dashboard'),
  '/topics': () => import('@/pages/TopicSelection'),
  '/generated': () => import('@/pages/GeneratedPosts'),
  '/profile': () => import('@/pages/Profile'),
  '/onboarding': () => import('@/pages/Onboarding'),
  '/terms': () => import('@/pages/Terms'),
};

export const prefetchRoute = (path: string) => {
  if (prefetched.has(path)) return;
  const fn = ROUTE_PREFETCHERS[path];
  if (!fn) return;
  prefetched.add(path);
  // Fire-and-forget; swallow errors (offline, chunk eviction, etc.) — the
  // normal lazy-load on click will surface a real error if needed.
  fn().catch(() => prefetched.delete(path));
};
