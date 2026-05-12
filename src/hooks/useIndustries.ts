
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useIndustries() {
  const [industries, setIndustries] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchIndustries() {
      try {
        setLoading(true);
        
        // Fetch unique industries from sources where type is "trusted"
        const { data, error } = await supabase
          .from('sources')
          .select('industries')
          .eq('type', 'trusted');
        
        if (error) throw error;
        
        // Extract all industries from the results and flatten the array
        const allIndustries = data
          .flatMap(source => source.industries || [])
          .filter(Boolean); // Remove null/undefined values
        
        // Get unique industries (excluding "Global") and sort them alphabetically
        const uniqueIndustries = [...new Set(allIndustries)]
          .filter(industry => industry.toLowerCase() !== 'global')
          .sort((a, b) => a.localeCompare(b));
        
        setIndustries(uniqueIndustries);
      } catch (err) {
        console.error("Error fetching industries:", err);
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setLoading(false);
      }
    }

    fetchIndustries();
  }, []);

  return { industries, loading, error };
}
