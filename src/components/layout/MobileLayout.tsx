
import React from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, Home, Search, User, FileText } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { TopNavigation } from "@/components/TopNavigation";
import { useAuth } from "@/contexts/AuthContext";

interface MobileLayoutProps {
  children: React.ReactNode;
}

export const MobileLayout: React.FC<MobileLayoutProps> = ({ children }) => {
  const isMobile = useIsMobile();
  const { session } = useAuth();
  const location = useLocation();
  
  // Don't show navigation on login page, onboarding page, or terms page
  const isLoginPage = location.pathname === '/login' || 
                      location.pathname === '/auth/callback' || 
                      location.pathname === '/';
  
  // Add check for onboarding and terms paths
  const isOnboardingPage = location.pathname === '/onboarding';
  const isTermsPage = location.pathname === '/terms' || location.pathname === '/account-deletion';
  
  if (isLoginPage || isOnboardingPage || isTermsPage) {
    return <>{children}</>;
  }

  // Function to check if a route is active
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <div className="flex flex-col min-h-screen max-w-xl mx-auto">
      {/* Only show TopNavigation on desktop/web, not on mobile */}
      {session && !isMobile && <TopNavigation />}
      
      {/* Add safe area padding for mobile status bar */}
      <main className={`flex-1 w-full overflow-x-hidden ${isMobile ? 'pt-safe pb-20' : ''} ${session && isMobile ? 'pt-4' : ''}`}>
        {children}
      </main>

      {/* Mobile bottom navigation - only on mobile */}
      {session && isMobile && (
        <footer className="fixed bottom-0 left-0 right-0 h-20 pt-3 border-t bg-background/95 backdrop-blur-sm flex items-center justify-around max-w-xl mx-auto safe-area-bottom shadow-lg">
          <Link 
            to="/dashboard" 
            className={`flex flex-col items-center justify-center px-3 py-1 min-w-0 rounded-md ${isActive('/dashboard') ? 'bg-accent text-accent-foreground' : ''}`}
          >
            <Home className={`h-6 w-6 ${isActive('/dashboard') ? 'text-accent-foreground' : 'text-ses-dark-blue dark:text-white'} mb-1`} />
            <span className="text-xs text-center">Home</span>
          </Link>
          <Link 
            to="/topics" 
            className={`flex flex-col items-center justify-center px-3 py-1 min-w-0 rounded-md ${isActive('/topics') ? 'bg-accent text-accent-foreground' : ''}`}
          >
            <Search className={`h-6 w-6 ${isActive('/topics') ? 'text-accent-foreground' : 'text-ses-dark-blue dark:text-white'} mb-1`} />
            <span className="text-xs text-center">Topics</span>
          </Link>
          <Link 
            to="/generated" 
            className={`flex flex-col items-center justify-center px-3 py-1 min-w-0 rounded-md ${isActive('/generated') ? 'bg-accent text-accent-foreground' : ''}`}
          >
            <FileText className={`h-6 w-6 ${isActive('/generated') ? 'text-accent-foreground' : 'text-ses-dark-blue dark:text-white'} mb-1`} />
            <span className="text-xs text-center">Posts</span>
          </Link>
          <Link 
            to="/profile" 
            className={`flex flex-col items-center justify-center px-3 py-1 min-w-0 rounded-md ${isActive('/profile') ? 'bg-accent text-accent-foreground' : ''}`}
          >
            <User className={`h-6 w-6 ${isActive('/profile') ? 'text-accent-foreground' : 'text-ses-dark-blue dark:text-white'} mb-1`} />
            <span className="text-xs text-center">Profile</span>
          </Link>
        </footer>
      )}
    </div>
  );
};
