"use client";

import { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';

// Types
export type Goal = 'Sales' | 'Leads' | 'Traffic' | 'App Installs';
export type Strategy = 'Full-Funnel' | 'Conversion Booster' | 'Audience Expansion';

export interface CampaignSetup {
  goal?: Goal;
  strategy?: Strategy;
  dailyBudget?: number;
  audiences: string[];
  creatives: string[];
  campaignName?: string;
  startDate?: Date;
  endDate?: Date;
}

interface CampaignLauncherContextType {
  data: CampaignSetup;
  update: (partial: Partial<CampaignSetup>) => void;
  reset: () => void;
  currentStep: number;
  nextStep: () => void;
  prevStep: () => void;
  validateStep: (step: number) => boolean;
  submitCampaign: () => Promise<boolean>;
  isSubmitting: boolean;
  errors: Record<string, string>;
  addAudience: (audienceId: string) => void;
  removeAudience: (audienceId: string) => void;
  addCreative: (creativeId: string) => void;
  removeCreative: (creativeId: string) => void;
}

const CampaignLauncherContext = createContext<CampaignLauncherContextType | null>(null);

// Local storage key
const STORAGE_KEY = 'campaignDraft';

// Validation rules
const validateCampaign = (data: CampaignSetup): Record<string, string> => {
  const errors: Record<string, string> = {};
  
  if (!data.goal) {
    errors.goal = 'Please select a campaign goal';
  }
  
  if (!data.strategy) {
    errors.strategy = 'Please select a strategy';
  }
  
  if (!data.dailyBudget || data.dailyBudget <= 0) {
    errors.dailyBudget = 'Please set a valid daily budget';
  }
  
  if (data.audiences.length === 0) {
    errors.audiences = 'Please select at least one audience';
  }
  
  if (data.creatives.length === 0) {
    errors.creatives = 'Please select at least one creative';
  }
  
  return errors;
};

export function CampaignLauncherProvider({ children }: { children: ReactNode }) {
  // Initialize state from localStorage or use default
  const [data, setData] = useState<CampaignSetup>(() => {
    if (typeof window === 'undefined') {
      return { audiences: [], creatives: [] };
    }
    
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : { audiences: [], creatives: [] };
    } catch (error) {
      console.error('Failed to parse saved campaign data', error);
      return { audiences: [], creatives: [] };
    }
  });

  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Save to localStorage when data changes
  useEffect(() => {
    if (isSubmitting) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save campaign data', error);
    }
  }, [data, isSubmitting]);

  // Update function with dirty state tracking
  const update = useCallback((partial: Partial<CampaignSetup>) => {
    setData(prev => {
      // Check if any actual value changed
      const hasChanges = Object.entries(partial).some(
        ([key, value]) => JSON.stringify(prev[key as keyof CampaignSetup]) !== JSON.stringify(value)
      );
      
      if (hasChanges) {
        return { ...prev, ...partial };
      }
      return prev;
    });
  }, []);

  // Reset to initial state
  const reset = useCallback(() => {
    setData({ audiences: [], creatives: [] });
    setErrors({});
    setCurrentStep(0);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  // Step navigation
  const nextStep = useCallback(() => {
    setCurrentStep(prev => Math.min(prev + 1, 5)); // 5 steps total
  }, []);

  const prevStep = useCallback(() => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  }, []);

  // Audience management
  const addAudience = useCallback((audienceId: string) => {
    update({
      audiences: [...new Set([...data.audiences, audienceId])]
    });
  }, [data.audiences, update]);

  const removeAudience = useCallback((audienceId: string) => {
    update({
      audiences: data.audiences.filter(id => id !== audienceId)
    });
  }, [data.audiences, update]);

  // Creative management
  const addCreative = useCallback((creativeId: string) => {
    update({
      creatives: [...new Set([...data.creatives, creativeId])]
    });
  }, [data.creatives, update]);

  const removeCreative = useCallback((creativeId: string) => {
    update({
      creatives: data.creatives.filter(id => id !== creativeId)
    });
  }, [data.creatives, update]);

  // Form validation
  const validateStep = useCallback((step: number): boolean => {
    const validationErrors: Record<string, string> = {};
    
    switch (step) {
      case 0: // Goal step
        if (!data.goal) validationErrors.goal = 'Please select a campaign goal';
        break;
      case 1: // Strategy step
        if (!data.strategy) validationErrors.strategy = 'Please select a strategy';
        break;
      case 2: // Budget step
        if (!data.dailyBudget || data.dailyBudget <= 0) {
          validationErrors.dailyBudget = 'Please set a valid daily budget';
        }
        break;
      case 3: // Audience step
        if (data.audiences.length === 0) {
          validationErrors.audiences = 'Please select at least one audience';
        }
        break;
      case 4: // Creative step
        if (data.creatives.length === 0) {
          validationErrors.creatives = 'Please select at least one creative';
        }
        break;
    }

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  }, [data]);

  // Submit campaign
  const submitCampaign = useCallback(async (): Promise<boolean> => {
    if (!validateStep(currentStep)) return false;
    
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, you would call your API here:
      // const response = await fetch('/api/campaigns', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(data),
      // });
      
      // if (!response.ok) {
      //   throw new Error('Failed to create campaign');
      // }

      // Clear the draft from localStorage on successful submission
      localStorage.removeItem(STORAGE_KEY);
      return true;
    } catch (error) {
      console.error('Failed to submit campaign:', error);
      setErrors(prev => ({
        ...prev,
        submit: 'Failed to submit campaign. Please try again.'
      }));
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [data, currentStep, validateStep]);

  const value = {
    data,
    update,
    reset,
    currentStep,
    nextStep,
    prevStep,
    validateStep,
    submitCampaign,
    isSubmitting,
    errors,
    addAudience,
    removeAudience,
    addCreative,
    removeCreative,
  };

  return (
    <CampaignLauncherContext.Provider value={value}>
      {children}
    </CampaignLauncherContext.Provider>
  );
}

export function useCampaignLauncher() {
  const context = useContext(CampaignLauncherContext);
  if (!context) {
    throw new Error(
      'useCampaignLauncher must be used within a CampaignLauncherProvider'
    );
  }
  return context;
}

// Helper functions
export function getGoalDisplayName(goal: Goal): string {
  const goalNames: Record<Goal, string> = {
    'Sales': 'Sales',
    'Leads': 'Leads',
    'Traffic': 'Website Traffic',
    'App Installs': 'App Installs'
  };
  return goalNames[goal] || goal;
}

export function getStrategyDisplayName(strategy: Strategy): string {
  const strategyNames: Record<Strategy, string> = {
    'Full-Funnel': 'Full Funnel',
    'Conversion Booster': 'Conversion Booster',
    'Audience Expansion': 'Audience Expansion'
  };
  return strategyNames[strategy] || strategy;
}
