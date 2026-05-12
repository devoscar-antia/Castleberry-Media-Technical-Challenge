import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShieldX, Mail } from "lucide-react";

interface AccessDeniedProps {
  onLogout: () => void;
}

const AccessDenied: React.FC<AccessDeniedProps> = ({ onLogout }) => {
  const contactEmail = "david.romero@castleberrymedia.co";

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-ses-cyan-blue to-ses-magenta/40 dark:from-ses-purple dark:to-ses-green/40 p-4">
      <Card className="w-full max-w-md border-light-grey/30 dark:border-dark-grey/50 shadow-lg bg-white/90 dark:bg-soft-black/90 backdrop-blur-sm">
        <CardContent className="flex flex-col items-center space-y-6 p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
            <ShieldX className="w-8 h-8 text-destructive" />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground">
              Account Not Activated
            </h2>
            <p className="text-sm text-muted-foreground">
              Your email is not authorized to access this application. Please contact Castleberry Media to activate your account.
            </p>
          </div>

          <a
            href={`mailto:${contactEmail}?subject=KOL%20Account%20Activation%20Request&body=Hello%2C%0A%0AI%20would%20like%20to%20request%20activation%20of%20my%20KOL%20account.%0A%0AThank%20you.`}
            className="w-full"
          >
            <Button variant="default" className="w-full flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Contact Castleberry
            </Button>
          </a>

          <p className="text-xs text-muted-foreground">
            Or email directly:{" "}
            <a
              href={`mailto:${contactEmail}`}
              className="text-primary hover:underline"
            >
              {contactEmail}
            </a>
          </p>

          <Button
            variant="ghost"
            size="sm"
            onClick={onLogout}
            className="text-muted-foreground"
          >
            Sign out and try another account
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccessDenied;
