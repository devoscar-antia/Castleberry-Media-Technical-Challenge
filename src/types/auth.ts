
import { User, Session } from '@supabase/supabase-js';
import { ToastActionElement } from '@/components/ui/toast';

export interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  error: string | null;
}

export interface LoginOptions {
  scopes?: string[];
}

export interface AuthContextType extends AuthState {
  loginWithLinkedIn: (options?: LoginOptions) => Promise<{success: boolean, message?: string, url?: string}>;
  logout: (suppressToast?: boolean) => Promise<{success: boolean, message?: string}>;
}

export interface LinkedInTokenResponse {
  access_token: string;
  expires_in: number;
  refresh_token?: string;
  refresh_token_expires_in?: number;
}

export interface LinkedInProfileResponse {
  id: string;
  localizedFirstName: string;
  localizedLastName: string;
  profilePicture?: {
    displayImage: string;
  };
  emailAddress?: string;
}

// Re-export the ToastActionElement type for use in authMethods
export type { ToastActionElement };
