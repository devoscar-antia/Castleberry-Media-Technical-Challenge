import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const Terms = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleReturn = () => {
    // Check if we have preserved form data from onboarding
    const preservedFormData = location.state?.formData;
    
    if (preservedFormData) {
      // Navigate back to onboarding with preserved state
      navigate('/onboarding', { state: { formData: preservedFormData }, replace: true });
    } else {
      // Default behavior - go back
      navigate(-1);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-4xl">
        <CardContent className="p-6 pt-8">
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full"
                onClick={handleReturn}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-2xl font-bold">Terms of Service & Data Processing</h1>
            </div>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold">1. LinkedIn Authorization</h2>
              <p className="text-gray-600">
                When you connect your LinkedIn account, we request minimal permissions through OAuth:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li><strong>Basic Profile Information:</strong> We access your name, email, and profile picture to personalize your experience.</li>
                <li><strong>w_member_social Scope:</strong> This allows us to post content to your LinkedIn profile, but <strong>only after your explicit approval</strong> for each post.</li>
              </ul>
              <p className="text-gray-600">
                You can revoke these permissions at any time through your LinkedIn account settings or by disconnecting your LinkedIn account from our application.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold">2. Data Collection and Storage</h2>
              <p className="text-gray-600">
                We collect and store the following information:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li><strong>User Preferences:</strong> Including your location, language preferences, industries of interest, and keywords.</li>
                <li><strong>Trusted Media Sources:</strong> Your selection of trusted media sources for content recommendations.</li>
                <li><strong>Generated and Edited Content:</strong> Posts that our system generates and any edits you make to them.</li>
                <li><strong>Post Analytics:</strong> Statistics about your posts, including views, likes, comments, and other engagement metrics provided by LinkedIn's API.</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold">3. How We Use Your Data</h2>
              <p className="text-gray-600">
                Your data is used to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li>Personalize content recommendations based on your preferences.</li>
                <li>Generate LinkedIn posts tailored to your professional interests.</li>
                <li>Improve our content generation algorithms.</li>
                <li>Provide analytics and insights about your LinkedIn engagement.</li>
              </ul>
              <p className="text-gray-600">
                <strong>We will never:</strong>
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li>Access your LinkedIn connections or messages.</li>
                <li>Post content without your explicit review and approval.</li>
                <li>Sell your personal data to third parties.</li>
                <li>Use your data for purposes beyond what's described in these terms.</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold">4. Content Ownership</h2>
              <p className="text-gray-600">
                By using our service, you acknowledge that:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li>Content generated through our system is for your personal or professional use.</li>
                <li>All content posted to your LinkedIn profile represents your own views and not those of SES or our service.</li>
                <li>You are responsible for reviewing and approving all content before it's published.</li>
                <li>You maintain ownership of any content published to your LinkedIn profile.</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold">5. Data Security</h2>
              <p className="text-gray-600">
                We implement appropriate security measures to protect your personal data, including:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li>Storing data in encrypted databases.</li>
                <li>Using HTTPS for all data transmissions.</li>
                <li>Implementing access controls to limit who can access your data.</li>
                <li>Regular security audits and updates.</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold">6. Your Rights</h2>
              <p className="text-gray-600">
                You have the right to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li>Access the personal data we hold about you.</li>
                <li>Request correction or deletion of your data.</li>
                <li>Export your data in a structured format.</li>
                <li>Withdraw your consent at any time.</li>
                <li>Lodge a complaint with a supervisory authority.</li>
              </ul>
            </section>
            
            <section className="space-y-4 border-t pt-6">
              <p className="text-sm text-gray-500 italic">
                By using our service and connecting your LinkedIn account, you confirm that you have read, understood, and agree to these terms of service and data processing policies.
              </p>
            </section>
          </div>
        </CardContent>
        <CardFooter className="border-t p-6 flex justify-end">
          <Button onClick={handleReturn}>
            Return
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Terms;
