
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { PreferencesForm } from "./PreferencesForm";
import { UserPreferences } from "@/types/profile";

interface PreferencesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  preferences: UserPreferences;
  onUpdate: (preferences: UserPreferences) => void;
}

export function PreferencesDialog({ 
  open, 
  onOpenChange, 
  preferences, 
  onUpdate 
}: PreferencesDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [internalPreferences, setInternalPreferences] = useState<UserPreferences>({
    region: [],
    preferredLanguage: "None",
    secondLanguage: "None",
    industries: [],
    keywords: [],
    fixedKeywords: [],
    preferredKeywords: [],
    trustedMedia: [],
    trustedSourceIds: [],
  });

  useEffect(() => {
    if (!preferences) return;
    
    const safePreferences: UserPreferences = {
      region: Array.isArray(preferences.region) ? [...preferences.region] : [],
      preferredLanguage: preferences.preferredLanguage || "None",
      secondLanguage: preferences.secondLanguage || "None",
      industries: Array.isArray(preferences.industries) ? [...preferences.industries] : [],
      keywords: Array.isArray(preferences.keywords) ? [...preferences.keywords] : [],
      fixedKeywords: Array.isArray(preferences.fixedKeywords) ? [...preferences.fixedKeywords] : [],
      preferredKeywords: Array.isArray(preferences.preferredKeywords) ? [...preferences.preferredKeywords] : [],
      trustedMedia: Array.isArray(preferences.trustedMedia) ? [...preferences.trustedMedia] : [],
      trustedSourceIds: Array.isArray(preferences.trustedSourceIds) ? [...preferences.trustedSourceIds] : [],
    };
    
    setInternalPreferences(safePreferences);
  }, [preferences]);

  const handleSubmit = async (newPreferences: UserPreferences) => {
    setIsSubmitting(true);
    try {
      const validatedPreferences: UserPreferences = {
        region: Array.isArray(newPreferences.region) ? [...newPreferences.region] : [],
        preferredLanguage: newPreferences.preferredLanguage || "None",
        secondLanguage: newPreferences.secondLanguage || "None",
        industries: Array.isArray(newPreferences.industries) ? [...newPreferences.industries] : [],
        keywords: Array.isArray(newPreferences.keywords) ? [...newPreferences.keywords] : [],
        fixedKeywords: Array.isArray(newPreferences.fixedKeywords) ? [...newPreferences.fixedKeywords] : [],
        preferredKeywords: Array.isArray(newPreferences.preferredKeywords) ? [...newPreferences.preferredKeywords] : [],
        trustedMedia: Array.isArray(newPreferences.trustedMedia) ? [...newPreferences.trustedMedia] : [],
        trustedSourceIds: Array.isArray(newPreferences.trustedSourceIds) ? [...newPreferences.trustedSourceIds] : [],
      };
      
      await onUpdate(validatedPreferences);
      onOpenChange(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Preferences</DialogTitle>
          <DialogDescription>
            Update your profile preferences. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="pr-1">
          <PreferencesForm 
            preferences={internalPreferences}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
