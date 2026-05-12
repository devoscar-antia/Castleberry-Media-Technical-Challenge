
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface UserPreferences {
  region?: string[];
  preferredLanguage?: string;
  secondLanguage?: string;
  industries?: string[];
  keywords?: string[];
  trustedMedia?: string[];
}

interface OnboardingContextType {
  currentStep: number;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  preferences: UserPreferences;
  updatePreferences: (newPreferences: Partial<UserPreferences>) => void;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export const OnboardingProvider = ({ children }: { children: ReactNode }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [preferences, setPreferences] = useState<UserPreferences>({
    region: [],
    preferredLanguage: '',
    secondLanguage: 'none',
    industries: [],
    keywords: [],
    trustedMedia: []
  });

  const updatePreferences = (newPreferences: Partial<UserPreferences>) => {
    setPreferences(prev => ({ ...prev, ...newPreferences }));
  };

  const goToNextStep = () => {
    setCurrentStep(prev => Math.min(prev + 1, 4)); // Limit to max step (4)
  };

  const goToPreviousStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0)); // Limit to min step (0)
  };

  return (
    <OnboardingContext.Provider 
      value={{ 
        currentStep, 
        setCurrentStep, 
        preferences, 
        updatePreferences,
        goToNextStep,
        goToPreviousStep
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
};

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
};
