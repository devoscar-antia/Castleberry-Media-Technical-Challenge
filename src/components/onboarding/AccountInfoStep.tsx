
import React from "react";
import { CheckCircle2, Linkedin } from "lucide-react";

interface AccountInfoStepProps {
  formData: {
    location: string[];
    preferredLanguage: string;
    secondLanguage: string;
  };
  onChange: (field: string, value: string | string[]) => void;
  errors: Record<string, string>;
}

const AccountInfoStep: React.FC<AccountInfoStepProps> = ({ 
  formData, 
  onChange, 
  errors 
}) => {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-muted-foreground text-sm leading-relaxed">
          We'll use a few details to tailor your content feed, suggest relevant sources, and help you get the most out of the platform.
        </p>
      </div>

      {/* LinkedIn success card */}
      <div className="flex items-center gap-3 rounded-xl bg-primary/5 border border-primary/15 px-4 py-3">
        <div className="flex-shrink-0">
          <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
            <CheckCircle2 className="w-4 h-4 text-primary" />
          </div>
        </div>
        <p className="text-sm font-medium text-foreground">
          LinkedIn connected successfully
        </p>
      </div>

      {/* What happens next */}
      <div className="space-y-3 pt-2">
        <p className="text-sm font-medium text-foreground">What you'll set up next:</p>
        <div className="grid gap-2.5">
          {[
            { step: "1", text: "A short voice briefing to learn about your role and preferences" },
            { step: "2", text: "Choose your region and language preferences" },
            { step: "3", text: "Select your industries and topics of interest" },
            { step: "4", text: "Review and confirm your setup" },
          ].map((item) => (
            <div key={item.step} className="flex items-center gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-muted/60 text-muted-foreground text-xs font-semibold flex items-center justify-center">
                {item.step}
              </span>
              <span className="text-sm text-muted-foreground">{item.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AccountInfoStep;
