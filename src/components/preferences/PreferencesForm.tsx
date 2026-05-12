
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { UserPreferences } from "@/types/profile";
import { RegionSelect } from "./RegionSelect";
import { LanguageSelects } from "./LanguageSelects";
import { IndustryKeywordSelect } from "./IndustryKeywordSelect";

interface PreferencesFormProps {
  preferences: UserPreferences;
  onSubmit: (data: UserPreferences) => void;
  isSubmitting: boolean;
}

export function PreferencesForm({ preferences, onSubmit, isSubmitting }: PreferencesFormProps) {
  console.log("PreferencesForm rendering with preferences:", preferences);
  
  const defaultValues: UserPreferences = {
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
  
  console.log("PreferencesForm defaultValues:", defaultValues);

  const form = useForm<UserPreferences>({
    defaultValues
  });
  
  console.log("PreferencesForm form values:", form.getValues());

  useEffect(() => {
    console.log("PreferencesForm useEffect - resetting form with:", defaultValues);
    form.reset(defaultValues);
  }, [preferences, form]);

  const handleFormSubmit = (data: UserPreferences) => {
    // Ensure combined keywords = fixedKeywords + preferredKeywords
    const combined = [...new Set([...(data.fixedKeywords || []), ...(data.preferredKeywords || [])])].sort((a, b) => a.localeCompare(b));
    onSubmit({ ...data, keywords: combined });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
        <RegionSelect control={form.control} />
        <LanguageSelects control={form.control} />
        <IndustryKeywordSelect control={form.control} />
        <div className="pt-4 flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            Save
          </Button>
        </div>
      </form>
    </Form>
  );
}
