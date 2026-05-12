import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { authMethods } from '@/utils/authMethods';
import { useAuth } from '@/contexts/AuthContext';

interface TokenStatus {
  isValid: boolean;
  isExpired: boolean;
  daysRemaining: number | null;
  hasToken: boolean;
  isLoading: boolean;
}

export const useLinkedInTokenValidation = (userId?: string, recentLogin?: boolean) => {
  const { toast } = useToast();
  const { logout } = useAuth();
  const logoutInProgressRef = useRef(false);
  const loginGracePeriodRef = useRef<number | null>(null);
  const logoutTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [tokenStatus, setTokenStatus] = useState<TokenStatus>({
    isValid: false,
    isExpired: false,
    daysRemaining: null,
    hasToken: false,
    isLoading: true,
  });

  // Set grace period when recentLogin is true
  useEffect(() => {
    if (recentLogin) {
      loginGracePeriodRef.current = Date.now() + 15000; // 15 seconds grace period
    }
  }, [recentLogin]);

  const validateToken = useCallback(async () => {
    if (!userId) return;

    setTokenStatus(prev => ({ ...prev, isLoading: true }));

    try {
      // Use RPC: never expose the raw OAuth token to the client.
      const { data: statusRows, error } = await supabase
        .rpc('get_my_linkedin_token_status');

      const status = Array.isArray(statusRows) ? statusRows[0] : statusRows;

      if (error || !status) {
        setTokenStatus({
          isValid: false,
          isExpired: false,
          daysRemaining: null,
          hasToken: false,
          isLoading: false,
        });
        return;
      }

      const hasToken = Boolean(status.has_token);

      if (!hasToken) {
        setTokenStatus({
          isValid: false,
          isExpired: false,
          daysRemaining: null,
          hasToken: false,
          isLoading: false,
        });
        return;
      }

      // Calculate token status
      let isExpired = false;
      let daysRemaining: number | null = null;

      if (status.expires_at) {
        const expirationTime = new Date(status.expires_at).getTime();
        const now = Date.now();
        daysRemaining = Math.round((expirationTime - now) / (1000 * 60 * 60 * 24));
        
        isExpired = daysRemaining < 0;
      }

      const isValid = hasToken && !isExpired;

      setTokenStatus({
        isValid,
        isExpired,
        daysRemaining,
        hasToken,
        isLoading: false,
      });

      // Force logout if token is expired, but respect grace period after login
      const isInGracePeriod = loginGracePeriodRef.current && Date.now() < loginGracePeriodRef.current;
      
      if (isExpired && !logoutInProgressRef.current && !isInGracePeriod) {
        logoutInProgressRef.current = true;
        
        toast({
          variant: "destructive",
          title: "LinkedIn Token Expired",
          description: "Your session has expired. You will be logged out to refresh your LinkedIn connection.",
        });
        
        // Force logout after a short delay; track the timer so we can clear
        // it on unmount and avoid firing logout after the component is gone.
        logoutTimerRef.current = setTimeout(async () => {
          await logout(true);
          logoutInProgressRef.current = false;
          logoutTimerRef.current = null;
        }, 2000);
        
        return;
      }

    } catch (error) {
      console.error('Error validating LinkedIn token:', error);
      setTokenStatus({
        isValid: false,
        isExpired: false,
        daysRemaining: null,
        hasToken: false,
        isLoading: false,
      });
    }
  }, [userId, toast, logout]);

  // Validate token on mount and when userId changes
  useEffect(() => {
    validateToken();
    return () => {
      // Cancel any pending logout timer to avoid firing after unmount
      if (logoutTimerRef.current) {
        clearTimeout(logoutTimerRef.current);
        logoutTimerRef.current = null;
      }
    };
  }, [validateToken]);

  return {
    tokenStatus,
    validateToken,
  };
};