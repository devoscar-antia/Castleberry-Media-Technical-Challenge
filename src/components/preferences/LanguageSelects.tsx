
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LANGUAGES } from "@/config/preferences";
import { Control } from "react-hook-form";
import { UserPreferences } from "@/types/profile";

interface LanguageSelectsProps {
  control: Control<UserPreferences>;
}

export function LanguageSelects({ control }: LanguageSelectsProps) {
  return (
    <>
      <FormField
        control={control}
        name="preferredLanguage"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Primary Language</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
              </FormControl>
              <SelectContent className="max-h-60 overflow-auto">
                {LANGUAGES.map((lang) => (
                  <SelectItem key={lang} value={lang}>
                    {lang}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="secondLanguage"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Secondary Language</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {LANGUAGES.map((lang) => (
                  <SelectItem key={lang} value={lang}>
                    {lang}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormItem>
        )}
      />
    </>
  );
}
