'use client';

import { createContext, useContext, ReactNode, useState, useEffect } from 'react';

export type Goal = 'Sales' | 'Leads' | 'Traffic' | 'App Installs';
export type Strategy = 'Full-Funnel' | 'Conversion Booster' | 'Audience Expansion';

export interface CampaignSetup {
  goal?: Goal;
  strategy?: Strategy;
  dailyBudget?: number;
  audiences: string[];
  creatives: string[];
}

interface CampaignLauncherContextValue {
  data: CampaignSetup;
  update: (partial: Partial<CampaignSetup>) => void;
  reset: () => void;
  isEditing: boolean;
  campaignId?: string;
}

const CampaignLauncherContext = createContext<CampaignLauncherContextValue | null>(null);

export function CampaignLauncherProvider({ 
  children,
  initialData,
  campaignId
}: { 
  children: ReactNode;
  initialData?: Partial<CampaignSetup>;
  campaignId?: string;
}) {
  const [data, setData] = useState<CampaignSetup>(() => ({
    audiences: [],
    creatives: [],
    ...initialData
  }));

  // Load from localStorage on initial render
  useEffect(() => {
    const savedData = localStorage.getItem('campaignDraft');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setData(prev => ({
          ...prev,
          ...parsedData,
          // Ensure these are always arrays to prevent undefined errors
          audiences: parsedData.audiences || [],
          creatives: parsedData.creatives || []
        }));
      } catch (e) {
        console.error('Failed to parse campaign draft from localStorage', e);
      }
    }
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    if (Object.keys(data).length > 0) {
      localStorage.setItem('campaignDraft', JSON.stringify(data));
    }
  }, [data]);

  const update = (partial: Partial<CampaignSetup>) => {
    setData(prev => ({
      ...prev,
      ...partial,
      // Ensure arrays are properly handled when updating
      audiences: partial.audiences !== undefined ? partial.audiences : prev.audiences,
      creatives: partial.creatives !== undefined ? partial.creatives : prev.creatives,
    }));
  };

  const reset = () => {
    setData({
      audiences: [],
      creatives: [],
    });
    localStorage.removeItem('campaignDraft');
  };

  return (
    <CampaignLauncherContext.Provider 
      value={{ 
        data, 
        update, 
        reset,
        isEditing: !!campaignId,
        campaignId
      }}
    >
      {children}
    </CampaignLauncherContext.Provider>
  );
}

export function useCampaignLauncher() {
  const context = useContext(CampaignLauncherContext);
  if (!context) {
    throw new Error('useCampaignLauncher must be used within a CampaignLauncherProvider');
  }
  return context;
}
