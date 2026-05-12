import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AuthState } from "@/types/auth";

const initialState: AuthState = {
  user: null,
  session: null,
  isLoading: true,
  error: null,
};

export function useAuthState() {
  const [state, setState] = useState<AuthState>(initialState);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setState((prev) => ({
        ...prev,
        session,
        user: session?.user ?? null,
        isLoading: false,
      }));
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setState((prev) => ({
        ...prev,
        session,
        user: session?.user ?? null,
        isLoading: false,
      }));
    });

    return () => subscription.unsubscribe();
  }, []);

  return { state, setState };
}
