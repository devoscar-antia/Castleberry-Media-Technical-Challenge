
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { MultiSelect } from "@/components/ui/multi-select";
import { REGIONS } from "@/config/preferences";
import type { Control } from "react-hook-form";
import type { UserPreferences } from "@/types/profile";

interface RegionSelectProps {
  control: Control<UserPreferences>;
}

export function RegionSelect({ control }: RegionSelectProps) {
  
  return (
    <FormField
      control={control}
      name="region"
      render={({ field }) => {
        // Ensure field.value is always an array
        const safeValue = Array.isArray(field.value) ? field.value : [];
        
        return (
          <FormItem>
            <FormLabel>Regions</FormLabel>
            <FormControl>
              <MultiSelect
                options={REGIONS}
                selected={safeValue}
                onChange={(value) => {
                  field.onChange(value);
                }}
                placeholder="Select your regions…"
              />
            </FormControl>
          </FormItem>
        );
      }}
    />
  );
}
