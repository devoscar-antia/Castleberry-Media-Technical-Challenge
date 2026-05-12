import React, { Suspense, useEffect, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { AuthGuard } from "@/components/AuthGuard";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { isCapacitorNative } from '@/utils/mobileUtils';
import { setNavigateFunction } from '@/utils/navigationHandler';
import { APP_VERSION } from '@/config/version';
import { initReminders, checkMondayReminder } from "./notifications";

// Eagerly load light pages used right after auth so the very first navigation feels instant.
import Login from "./pages/Login";
import Index from "./pages/Index";
import AuthCallback from "./pages/AuthCallback";
import Dashboard from "./pages/Dashboard";

// Heavier / less-critical pages load on-demand → smaller initial JS bundle.
const TopicSelection = lazy(() => import("./pages/TopicSelection"));
const GeneratedPosts = lazy(() => import("./pages/GeneratedPosts"));
const Profile = lazy(() => import("./pages/Profile"));
const Onboarding = lazy(() => import("./pages/Onboarding"));
const Terms = lazy(() => import("./pages/Terms"));
const AccountDeletion = lazy(() => import("./pages/AccountDeletion"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Import debug utilities in development
if (import.meta.env.DEV) {
  import('./utils/notificationDebug');
}

// React Query client with sensible cross-navigation defaults.
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 24 * 60 * 60 * 1000, // 24h — keep data warm for next session
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// Persist the query cache so re-opening the app shows data instantly while
// background refetches happen. Versioned by APP_VERSION → cache wipes on deploy.
const persister = typeof window !== 'undefined'
  ? createSyncStoragePersister({
      storage: window.localStorage,
      key: 'kol-query-cache',
      throttleTime: 1000,
    })
  : undefined;

// Lightweight fallback for lazy routes — keeps layout stable, no layout shift.
const RouteFallback = () => (
  <div className="flex items-center justify-center min-h-[40vh]" aria-hidden="true">
    <div className="h-8 w-8 rounded-full border-2 border-muted border-t-primary animate-spin" />
  </div>
);

// Component to register navigation function for use outside React
const NavigationSetter = () => {
  const navigate = useNavigate();
  useEffect(() => {
    setNavigateFunction(navigate);
  }, [navigate]);
  return null;
};

const App = () => {
  useEffect(() => {
    if (isCapacitorNative()) {
      const handleAppState = async () => {
        try {
          const { App } = await import('@capacitor/app');
          console.log('Capacitor ready, initializing notifications...');
          await initReminders();

          App.addListener('appStateChange', ({ isActive }) => {
            if (isActive) {
              console.log('App became active, checking Monday reminder');
              checkMondayReminder();
            }
          });

          App.addListener('resume', () => {
            console.log('App resumed, checking Monday reminder');
            checkMondayReminder();
          });
        } catch (error) {
          console.error('Error setting up app lifecycle listeners:', error);
        }
      };

      handleAppState();
    }
    // initReminders is a no-op on web; only run it on native (handled above)
  }, []);

  return (
    <React.StrictMode>
      <PersistQueryClientProvider
        client={queryClient}
        persistOptions={{
          persister: persister!,
          maxAge: 24 * 60 * 60 * 1000,
          buster: APP_VERSION, // Wipes cache when app version changes
        }}
      >
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <NavigationSetter />
            <AuthProvider>
              <AuthGuard>
                <MobileLayout>
                  <Suspense fallback={<RouteFallback />}>
                    <Routes>
                      <Route path="/" element={<Index />} />
                      <Route path="/login" element={<Login />} />
                      <Route path="/auth/callback" element={<AuthCallback />} />
                      <Route path="/onboarding" element={<Onboarding />} />
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/topics" element={<TopicSelection />} />
                      <Route path="/generated" element={<GeneratedPosts />} />
                      <Route path="/profile" element={<Profile />} />
                      <Route path="/terms" element={<Terms />} />
                      <Route path="/account-deletion" element={<AccountDeletion />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </Suspense>
                </MobileLayout>
              </AuthGuard>
            </AuthProvider>
          </BrowserRouter>
        </TooltipProvider>
      </PersistQueryClientProvider>
    </React.StrictMode>
  );
};

export default App;
