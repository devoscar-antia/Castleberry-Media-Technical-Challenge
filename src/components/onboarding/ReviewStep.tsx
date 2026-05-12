
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { User, Mail, MapPin, Globe, Building2, Hash, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface ConsentRecord {
  type: 'content_ownership' | 'data_processing';
  version: string;
  acceptedAt: string;
}

interface ReviewStepProps {
  formData: {
    location: string[];
    otherLocation: string;
    preferredLanguage: string;
    otherPreferredLanguage: string;
    secondLanguage: string;
    otherSecondLanguage: string;
    industries: string[];
    otherIndustry: string;
    ECIndustries: string[];
    keywords: string[];
    contentOwnershipConsent?: boolean; 
    dataProcessingConsent?: boolean;
    selectedMedia?: string[];
    consents: ConsentRecord[];
  };
}

const ReviewStep: React.FC<ReviewStepProps> = ({ formData }) => {
  const [userData, setUserData] = React.useState<{
    name: string;
    email: string | undefined;
  }>({ name: '', email: undefined });

  React.useEffect(() => {
    const fetchUserData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { user } = session;
        const metadata = user.user_metadata;
        
        setUserData({
          name: metadata.full_name || metadata.name || user.email?.split('@')[0] || 'User',
          email: user.email
        });
      }
    };

    fetchUserData();
  }, []);

  // Format location display to include "Other" specification if present
  const displayLocation = () => {
    let locationDisplay = formData.location.filter(loc => loc !== "Other").join(", ");
    
    if (formData.location.includes("Other") && formData.otherLocation) {
      locationDisplay = locationDisplay 
        ? `${locationDisplay}, ${formData.otherLocation}`
        : formData.otherLocation;
    }
    
    return locationDisplay || "None specified";
  };

  // Format language display to include "Other" specification if present
  const displayPreferredLanguage = () => {
    if (formData.preferredLanguage === "Other" && formData.otherPreferredLanguage) {
      return formData.otherPreferredLanguage;
    }
    return formData.preferredLanguage || "None specified";
  };

  const displaySecondLanguage = () => {
    if (formData.secondLanguage === "Other" && formData.otherSecondLanguage) {
      return formData.otherSecondLanguage;
    }
    if (formData.secondLanguage === "none") {
      return "None";
    }
    return formData.secondLanguage || "None";
  };

  const displayIndustries = () => {
    const hasEC = Array.isArray(formData.ECIndustries) && formData.ECIndustries.length > 0;
  
    // start with all selected industries except the "Other" placeholder
    let base = formData.industries.filter(ind => ind !== "Other");
    
    // if you have any ECIndustries, drop "Enterprise & Cloud" from the base list
    if (hasEC) {
      base = base.filter(ind => ind !== "Enterprise & Cloud");
    }
  
    // merge in ECIndustries (if any)
    const merged = [
      ...base,
      ...(formData.ECIndustries || [])
    ];
  
    // build the comma-separated string
    let industriesDisplay = merged.join(", ");
  
    // finally, append any custom "Other" entry
    if (formData.industries.includes("Other") && formData.otherIndustry) {
      industriesDisplay = industriesDisplay
        ? `${industriesDisplay}, ${formData.otherIndustry}`
        : formData.otherIndustry;
    }
    
    return industriesDisplay || "None specified";
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <p className="text-gray-600">
          Please review your information before submitting.
        </p>
      </div>

      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="flex items-start space-x-3">
            <User className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <h3 className="font-medium">Account Details</h3>
              <p className="text-sm text-gray-600 mt-1">{userData.name}</p>
              <div className="flex items-center mt-1">
                <Mail className="h-4 w-4 text-gray-500 mr-1" />
                <p className="text-sm text-gray-600">{userData.email}</p>
              </div>
              <p className="text-xs text-gray-400 mt-2">Linked with LinkedIn Account</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="flex items-start space-x-3">
            <MapPin className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <h3 className="font-medium">Location</h3>
              <p className="text-sm text-gray-600 mt-1">{displayLocation()}</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <Globe className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <h3 className="font-medium">Languages</h3>
              <p className="text-sm text-gray-600 mt-1">
                <span className="font-medium">Preferred:</span> {displayPreferredLanguage()}
              </p>
              {formData.secondLanguage && formData.secondLanguage !== "none" && (
                <p className="text-sm text-gray-600 mt-1">
                  <span className="font-medium">Second:</span> {displaySecondLanguage()}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="flex items-start space-x-3">
            <Building2 className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <h3 className="font-medium">Industries</h3>
              <p className="text-sm text-gray-600 mt-1">{displayIndustries()}</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <Hash className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <h3 className="font-medium">Keywords</h3>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.keywords.map((keyword, index) => (
                  <span
                    key={index}
                    className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="flex items-start space-x-3">
            <Check className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <h3 className="font-medium">Consent and Disclaimers</h3>
              {formData.consents.map((consent, index) => (
                <p key={index} className="text-sm text-gray-600 mt-1">
                  <span className="font-medium">✓</span> {' '}
                  {consent.type === 'content_ownership' ? 
                    'I confirm that all content is my own and does not represent SES' : 
                    'I consent to the processing of my personal data'
                  }
                  <span className="text-xs text-gray-400 ml-2">
                    (version {consent.version})
                  </span>
                </p>
              ))}
              {formData.consents.length === 0 && (
                <p className="text-sm text-amber-600">No consents provided</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReviewStep;
