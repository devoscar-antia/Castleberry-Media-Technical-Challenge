
// src/components/DeepLinkListener.tsx
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { App } from '@capacitor/app'
import { Capacitor } from '@capacitor/core'
import { Browser } from '@capacitor/browser'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'

export function DeepLinkListener() {
  const navigate = useNavigate()
  const { toast } = useToast()

  useEffect(() => {
    // Only on mobile native platforms
    if (!Capacitor.isNativePlatform()) {
      console.log('Not on native platform, skipping deep link listener');
      return;
    }

    const handler = async (event: { url: string }) => {
      try {
        if (!event.url.includes('login-callback')) {
          return
        }

        // Close the in-app browser when callback is received
        try {
          await Browser.close();
        } catch {
          // Browser was not open or already closed — safe to ignore
        }

        // Parse URL to extract tokens and params (do not log raw URL — it contains tokens)
        const url = new URL(event.url)

        let accessToken: string | null = null;
        let refreshToken: string | null = null;
        let providerToken: string | null = null;

        // Try hash first (typical for OAuth)
        if (url.hash) {
          const hashParams = new URLSearchParams(url.hash.substring(1))
          accessToken = hashParams.get('access_token')
          refreshToken = hashParams.get('refresh_token')
          providerToken = hashParams.get('provider_token')
        }

        // Try search params as fallback
        if (!accessToken) {
          accessToken = url.searchParams.get('access_token')
          refreshToken = url.searchParams.get('refresh_token')
          providerToken = url.searchParams.get('provider_token')
        }
        
        if (!accessToken) {
          toast({
            variant: "destructive",
            title: "Authentication Error",
            description: "No access token found in callback URL",
          })
          navigate('/login', { replace: true })
          return
        }

        // Use the setSession method with the tokens from the URL
        const { error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken || ''
        })

        if (error) {
          toast({
            variant: "destructive",
            title: "Authentication Error",
            description: error.message || "Failed to complete authentication",
          })
          navigate('/login', { replace: true })
          return
        }
        
        // Get the session again to ensure we have the latest data
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError || !session) {
          toast({
            variant: "destructive",
            title: "Authentication Error",
            description: "Failed to retrieve session after login",
          })
          navigate('/login', { replace: true })
          return
        }

        // Check for LinkedIn provider token in the session or URL
        const linkedinToken = session.provider_token || providerToken;

        if (linkedinToken) {
          const userData = session.user;
          const userMetadata = userData.user_metadata;

          // Get display name and avatar from metadata
          const displayName = userMetadata?.full_name ||
                              userMetadata?.name ||
                              userData.email?.split('@')[0] ||
                              'User';

          const avatarUrl = userMetadata?.avatar_url ||
                            userMetadata?.picture ||
                            null;

          // LinkedIn access tokens last 60 days. The `expires_in` returned in the
          // OAuth callback URL is Supabase's JWT TTL (~1 hour), NOT LinkedIn's
          // token lifetime — using it would mark the LinkedIn connection as
          // expired within the same day. Always store LinkedIn's 60-day expiry.
          const now = new Date();
          const linkedinTokenExpirySeconds = 60 * 24 * 60 * 60;
          const expirationDate = new Date(now.getTime() + linkedinTokenExpirySeconds * 1000);

          // Note: linkedin_access_token intentionally NOT stored in user_metadata
          // (client-readable). Token lives only in the profiles row, written via
          // the SECURITY DEFINER RPC below. We keep non-sensitive expiry metadata only.
          try {
            await supabase.auth.updateUser({
              data: {
                linkedin_token_created_at: now.toISOString(),
                linkedin_token_expires_in: linkedinTokenExpirySeconds,
                linkedin_token_scopes: 'w_member_social openid profile email',
              }
            });
          } catch {
            // Non-critical: metadata update failure should not block login
          }
          
          // Store LinkedIn token via SECURITY DEFINER RPC (only sanctioned write path).
          try {
            const { error: tokenRpcError } = await supabase.rpc('set_linkedin_token', {
              p_token: linkedinToken,
              p_expires_at: expirationDate.toISOString(),
            });
            if (tokenRpcError) {
              toast({
                variant: "destructive",
                title: "LinkedIn connection warning",
                description: "Login successful, but there was an issue saving your LinkedIn connection.",
              });
            } else {
              // Update non-sensitive profile fields separately
              await supabase
                .from('profiles')
                .update({
                  updated_at: now.toISOString(),
                  display_name: displayName,
                  avatar_url: avatarUrl,
                })
                .eq('id', userData.id);

              toast({
                title: "LinkedIn connected",
                description: "Your LinkedIn account has been successfully connected.",
              });
            }
          } catch {
            toast({
              variant: "destructive",
              title: "LinkedIn connection warning",
              description: "Login successful, but there was an issue saving your LinkedIn connection.",
            });
          }
        } else {
          // No new provider token — keep existing profile token, just refresh display fields if available.
          const userMetadata = session.user.user_metadata;
          const displayName = userMetadata?.full_name ||
                              userMetadata?.name ||
                              session.user.email?.split('@')[0] ||
                              'User';
          const avatarUrl = userMetadata?.avatar_url ||
                            userMetadata?.picture ||
                            null;

          try {
            await supabase
              .from('profiles')
              .update({
                updated_at: new Date().toISOString(),
                display_name: displayName,
                avatar_url: avatarUrl,
              })
              .eq('id', session.user.id);
          } catch {
            // Non-critical
          }

          toast({
            title: "Login Successful",
            description: "You have been successfully logged in.",
          });
        }

        // Navigate to auth callback to complete the flow (for user profile checks)
        navigate('/auth/callback', { replace: true })
      } catch {
        toast({
          variant: "destructive",
          title: "Authentication Error",
          description: "Failed to process authentication. Please try again.",
        })
        navigate('/login', { replace: true })
      }
    }

    // Subscribe to the app URL open event
    console.log('Setting up deep link listener for native platform')
    const listenerHandle = App.addListener('appUrlOpen', handler)

    return () => {
      // Clean up only this listener (do not nuke unrelated App listeners like 'resume')
      Promise.resolve(listenerHandle).then((h) => h.remove()).catch(() => {})
    }
  }, [navigate, toast])

  return null
}
