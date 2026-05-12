/**
 * Version-check service.
 * Calls the `version-check` edge function on launch / resume to decide whether
 * to show the soft update banner or the blocking update modal.
 *
 * Web users → always 'ok' (no nag in the browser).
 */

import { APP_VERSION } from '@/config/version'
import { isCapacitorNative } from '@/utils/mobileUtils'

export type VersionStatus = 'ok' | 'update_available' | 'update_required'

export interface VersionCheckResult {
  status: VersionStatus
  min_version?: string
  latest_version?: string
  update_message?: string
  store_url?: string
  current_version?: string
}

const CACHE_KEY = 'kol-version-check-v1'
const CACHE_TTL_MS = 30 * 60 * 1000 // 30 minutes
const SUPABASE_URL = 'http://127.0.0.1:54321'

interface CachedEntry {
  fetchedAt: number
  forVersion: string
  result: VersionCheckResult
}

function readCache(): VersionCheckResult | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as CachedEntry
    if (parsed.forVersion !== APP_VERSION) return null
    if (Date.now() - parsed.fetchedAt > CACHE_TTL_MS) return null
    return parsed.result
  } catch {
    return null
  }
}

function writeCache(result: VersionCheckResult): void {
  try {
    const entry: CachedEntry = { fetchedAt: Date.now(), forVersion: APP_VERSION, result }
    localStorage.setItem(CACHE_KEY, JSON.stringify(entry))
  } catch {
    // ignore storage errors
  }
}

async function getPlatform(): Promise<'ios' | 'android' | 'web'> {
  if (!isCapacitorNative()) return 'web'
  try {
    const { Capacitor } = await import('@capacitor/core')
    const p = Capacitor.getPlatform()
    if (p === 'ios') return 'ios'
    if (p === 'android') return 'android'
    return 'web'
  } catch {
    return 'web'
  }
}

export async function checkVersion(force = false): Promise<VersionCheckResult> {
  const platform = await getPlatform()
  if (platform === 'web') return { status: 'ok' }

  if (!force) {
    const cached = readCache()
    if (cached) return cached
  }

  try {
    const url = `${SUPABASE_URL}/functions/v1/version-check?platform=${platform}&version=${encodeURIComponent(APP_VERSION)}`
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10_000)
    let res: Response
    try {
      res = await fetch(url, { method: 'GET', signal: controller.signal })
    } finally {
      clearTimeout(timeoutId)
    }
    if (!res.ok) return { status: 'ok' }
    const data = (await res.json()) as VersionCheckResult
    writeCache(data)
    return data
  } catch (err) {
    console.warn('[versionCheck] failed', err)
    return { status: 'ok' }
  }
}

/**
 * Open the App Store / Play Store at the configured URL.
 * Uses Capacitor Browser when available, falls back to window.open.
 */
export async function openStore(storeUrl: string): Promise<void> {
  if (!storeUrl) return
  if (isCapacitorNative()) {
    try {
      const { Browser } = await import('@capacitor/browser')
      await Browser.open({ url: storeUrl })
      return
    } catch (err) {
      console.warn('[versionCheck] Browser.open failed, falling back', err)
    }
  }
  window.open(storeUrl, '_blank')
}

// --- Banner-dismiss tracking (per latest_version, 24h TTL) ---

const DISMISS_KEY = 'kol-version-banner-dismissed-v1'

interface DismissEntry {
  version: string
  dismissedAt: number
}

export function isBannerDismissed(latestVersion: string): boolean {
  try {
    const raw = localStorage.getItem(DISMISS_KEY)
    if (!raw) return false
    const parsed = JSON.parse(raw) as DismissEntry
    if (parsed.version !== latestVersion) return false
    return Date.now() - parsed.dismissedAt < 24 * 60 * 60 * 1000
  } catch {
    return false
  }
}

export function dismissBanner(latestVersion: string): void {
  try {
    const entry: DismissEntry = { version: latestVersion, dismissedAt: Date.now() }
    localStorage.setItem(DISMISS_KEY, JSON.stringify(entry))
  } catch {
    // ignore
  }
}
