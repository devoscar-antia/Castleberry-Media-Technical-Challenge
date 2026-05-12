import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { authMethods } from "@/utils/authMethods";
import { supabase } from "@/integrations/supabase/client";
import { Shield, ShieldCheck, ShieldX, RefreshCcw } from 'lucide-react';
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from "@/components/ui/alert-dialog";

interface LinkedInConnectionStatusProps {
  userId: string;
  isConnected: boolean;
  connectionDate?: string;
  onConnectionChange?: (isConnected: boolean) => void;
}

export default function LinkedInConnectionStatus({ 
  userId,
  isConnected,
  connectionDate,
  onConnectionChange
}: LinkedInConnectionStatusProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [tokenStatus, setTokenStatus] = useState<{hasToken: boolean, expiresAt: string | null}>({
    hasToken: false,
    expiresAt: null
  });
  
  // Fetch the current token status on component mount
  useEffect(() => {
    const fetchTokenStatus = async () => {
      if (userId) {
        // RPC returns only { has_token, expires_at } — never the raw token.
        const { data, error } = await supabase
          .rpc('get_my_linkedin_token_status');

        if (error) {
          console.error('Error fetching LinkedIn token status:', error);
          return;
        }

        const row = Array.isArray(data) ? data[0] : data;
        setTokenStatus({
          hasToken: Boolean(row?.has_token),
          expiresAt: row?.expires_at ?? null
        });
      }
    };
    
    fetchTokenStatus();
  }, [userId, isConnected]);
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Unknown date';
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  const handleReconnect = async () => {
    const result = await authMethods.loginWithLinkedIn(
      () => {}, // setState is not needed here
      toast
    );
    if (result.success) {
      toast({
        title: "Reconnecting LinkedIn",
        description: "You'll be redirected to LinkedIn to reconnect your account.",
      });
    }
  };
  
  const handleRevoke = async () => {
    setIsLoading(true);
    
    try {
      const result = await authMethods.revokeLinkedInAccess(userId, toast);
      
      if (result.success) {
        setTokenStatus({
          hasToken: false,
          expiresAt: null
        });
        
        if (onConnectionChange) {
          onConnectionChange(false);
        }
      }
    } catch (error) {
      console.error("Error revoking access:", error);
    } finally {
      setIsLoading(false);
      setShowConfirmDialog(false);
    }
  };
  
  // Determine connection status based on actual token presence
  const actuallyConnected = tokenStatus.hasToken;
  
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {actuallyConnected 
              ? <ShieldCheck className="h-5 w-5 text-green-500" /> 
              : <ShieldX className="h-5 w-5 text-orange-500" />}
            LinkedIn Connection
          </CardTitle>
          <CardDescription>
            Manage your LinkedIn account connection
          </CardDescription>
        </CardHeader>
        <CardContent>
          {actuallyConnected ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Status:</span>
                <span className="font-medium text-green-600">Connected</span>
              </div>
              {tokenStatus.expiresAt && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Token expires:</span>
                  <span className="font-medium">{formatDate(tokenStatus.expiresAt)}</span>
                </div>
              )}
              {connectionDate && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Connected since:</span>
                  <span className="font-medium">{formatDate(connectionDate)}</span>
                </div>
              )}
              <div className="pt-2">
                <p className="text-sm text-muted-foreground">
                  Your LinkedIn account is connected and can be used for posting content.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Status:</span>
                <span className="font-medium text-orange-600">Disconnected</span>
              </div>
              <div className="pt-2">
                <p className="text-sm text-muted-foreground">
                  Connect your LinkedIn account to enable posting content directly from KOL.
                </p>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          {actuallyConnected ? (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleReconnect()}
                disabled={isLoading}
              >
                <RefreshCcw className="h-4 w-4 mr-2" />
                Reconnect
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setShowConfirmDialog(true)}
                disabled={isLoading}
              >
                <Shield className="h-4 w-4 mr-2" />
                Revoke Access
              </Button>
            </>
          ) : (
            <Button
              size="sm"
              onClick={() => handleReconnect()}
              disabled={isLoading}
            >
              <ShieldCheck className="h-4 w-4 mr-2" />
              Connect LinkedIn
            </Button>
          )}
        </CardFooter>
      </Card>
      
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Revoke LinkedIn Access?</AlertDialogTitle>
            <AlertDialogDescription>
              This will disconnect your LinkedIn account from KOL. You will need to reconnect 
              to post content to LinkedIn.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRevoke}
              disabled={isLoading}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isLoading ? "Revoking..." : "Yes, revoke access"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
