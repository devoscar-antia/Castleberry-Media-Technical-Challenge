
import React from "react";
import { UserPreferences } from "@/types/profile";
import { ScrollArea } from "@/components/ui/scroll-area";

interface PreferencesDisplayProps {
  preferences: UserPreferences;
}

const PreferencesDisplay = ({ preferences }: PreferencesDisplayProps) => {
  const topics = Array.isArray(preferences.preferredKeywords) ? preferences.preferredKeywords : [];

  return (
    <div className="w-full">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold mb-2">Preferences</h3>
        <div className="grid gap-3">
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-1">Region</h4>
            <p className="text-sm">{Array.isArray(preferences.region) ? preferences.region.join(", ") : "None selected"}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-1">Languages</h4>
            <p className="text-sm">
              {preferences.preferredLanguage !== "None" ? preferences.preferredLanguage : "No primary language"} 
              {preferences.secondLanguage !== "None" && ` / ${preferences.secondLanguage}`}
            </p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-1">Industries</h4>
            <p className="text-sm">{Array.isArray(preferences.industries) ? preferences.industries.join(", ") : "None selected"}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-1">Topics</h4>
            {topics.length > 0 ? (
              <div className="max-h-[100px] overflow-hidden rounded-md border">
                <ScrollArea className="h-[100px] w-full">
                  <div className="flex flex-wrap gap-2 p-3">
                    {topics.map((keyword, index) => (
                      <span
                        key={index}
                        className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">None added</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreferencesDisplay;
