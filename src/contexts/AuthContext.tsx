
import React, { createContext, useContext } from 'react';
import { useAuthState } from '@/hooks/useAuthState';
import { AuthContextType } from '@/types/auth';
import { useToast } from '@/hooks/use-toast';
import { authMethods } from '@/utils/authMethods';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  isLoading: true,
  error: null,
  loginWithLinkedIn: async (options?) => ({ success: false }),
  logout: async (suppressToast?) => ({ success: false })
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { state, setState } = useAuthState();
  const { toast } = useToast();
  const navigate = useNavigate();

  const loginWithLinkedIn = async (options?) => {
    // Create a loading state setter that updates the isLoading property
    const setIsLoading = (loading: boolean) => setState(prev => ({ ...prev, isLoading: loading }));
    return await authMethods.loginWithLinkedIn(setIsLoading, toast, options);
  };

  const logout = async (suppressToast?: boolean) => {
    const result = await authMethods.logout(setState, toast, suppressToast);
    if (result.success) {
      navigate('/login');
    }
    return result;
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        loginWithLinkedIn,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
