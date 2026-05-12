/**
 * VersionGate — mounted once at the root of the app.
 *
 * Calls the version-check edge function on mount and on app-resume.
 *  - status === 'update_required' → blocking full-screen modal (no dismiss)
 *  - status === 'update_available' → dismissible top banner (24h)
 *  - status === 'ok' → renders nothing
 *
 * Native-only. On web → renders nothing.
 */

import { useEffect, useState, useCallback } from 'react'
import { ArrowUpCircle, X, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  checkVersion,
  openStore,
  isBannerDismissed,
  dismissBanner,
  type VersionCheckResult,
} from '@/services/versionCheck'
import { isCapacitorNative } from '@/utils/mobileUtils'
import { APP_VERSION } from '@/config/version'

export function VersionGate() {
  const [result, setResult] = useState<VersionCheckResult | null>(null)
  const [bannerHidden, setBannerHidden] = useState(false)

  const refresh = useCallback(async (force = false) => {
    const r = await checkVersion(force)
    setResult(r)
    if (r.status === 'update_available' && r.latest_version) {
      setBannerHidden(isBannerDismissed(r.latest_version))
    }
  }, [])

  useEffect(() => {
    if (!isCapacitorNative()) return
    refresh(false)

    let cleanup: (() => void) | undefined
    ;(async () => {
      try {
        const { App } = await import('@capacitor/app')
        const handle = await App.addListener('appStateChange', ({ isActive }) => {
          if (isActive) refresh(false)
        })
        cleanup = () => handle.remove()
      } catch (err) {
        console.warn('[VersionGate] app listener setup failed', err)
      }
    })()

    return () => {
      cleanup?.()
    }
  }, [refresh])

  if (!result || result.status === 'ok') return null

  // ===== Blocking modal =====
  if (result.status === 'update_required') {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/95 backdrop-blur-sm p-6">
        <div className="w-full max-w-md rounded-2xl border bg-card text-card-foreground shadow-2xl p-8 text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <ArrowUpCircle className="h-9 w-9 text-primary" />
          </div>
          <h2 className="text-2xl font-semibold tracking-tight">Update Required</h2>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            {result.update_message ||
              'This version of KOL is no longer supported. Please update to continue.'}
          </p>
          <div className="mt-6 rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground">
            <div className="flex justify-between">
              <span>Your version</span>
              <span className="font-mono">{APP_VERSION}</span>
            </div>
            {result.min_version && (
              <div className="mt-1 flex justify-between">
                <span>Required</span>
                <span className="font-mono">{result.min_version}+</span>
              </div>
            )}
          </div>
          <Button
            className="mt-6 w-full"
            size="lg"
            onClick={() => openStore(result.store_url || '')}
          >
            <Download className="mr-2 h-4 w-4" />
            Open App Store
          </Button>
        </div>
      </div>
    )
  }

  // ===== Soft banner =====
  if (result.status === 'update_available' && !bannerHidden) {
    return (
      <div className="sticky top-0 z-50 w-full bg-primary text-primary-foreground shadow-sm">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-2.5 text-sm">
          <ArrowUpCircle className="h-4 w-4 shrink-0" />
          <span className="flex-1 truncate">
            {result.update_message || 'A new version is available.'}
          </span>
          <button
            onClick={() => openStore(result.store_url || '')}
            className="shrink-0 rounded-md bg-primary-foreground/15 px-3 py-1 text-xs font-medium hover:bg-primary-foreground/25 transition-colors"
          >
            Update
          </button>
          <button
            onClick={() => {
              if (result.latest_version) dismissBanner(result.latest_version)
              setBannerHidden(true)
            }}
            className="shrink-0 rounded-md p-1 hover:bg-primary-foreground/15 transition-colors"
            aria-label="Dismiss"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    )
  }

  return null
}
