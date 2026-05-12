import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface LinkedInTokenAlertProps {
  isExpired: boolean;
  daysRemaining: number | null;
  hasToken: boolean;
}

export function LinkedInTokenAlert({
  isExpired,
  daysRemaining,
  hasToken,
}: LinkedInTokenAlertProps) {
  if (!hasToken) {
    return (
      <Alert className="border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-200">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>LinkedIn Not Connected</AlertTitle>
        <AlertDescription>
          Connect your LinkedIn account to start publishing posts.
        </AlertDescription>
      </Alert>
    );
  }

  // Don't show anything for expired tokens - the hook will force logout
  return null;
}