"use client";

import { useState, createContext, useContext, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { AudienceStep } from "./_components/AudienceStep";
import { CreativeStep } from "./_components/CreativeStep";
import { ReviewStep } from "./_components/ReviewStep";

/* -------------------------------------------------------------------------- */
/*                             State Management                               */
/* -------------------------------------------------------------------------- */

type Goal = "Sales" | "Leads" | "Traffic" | "App Installs";

type Strategy = "Full-Funnel" | "Conversion Booster" | "Audience Expansion";

interface CampaignSetup {
  goal?: Goal;
  strategy?: Strategy;
  dailyBudget?: number;
  audiences: string[]; // ids or names
  creatives: string[]; // ids
}

interface CampaignLauncherContextValue {
  data: CampaignSetup;
  update: (partial: Partial<CampaignSetup>) => void;
}

const CampaignLauncherContext = createContext<CampaignLauncherContextValue | null>(
  null
);

function useCampaignLauncher() {
  const ctx = useContext(CampaignLauncherContext);
  if (!ctx) throw new Error("useCampaignLauncher must be used within provider");
  return ctx;
}

function CampaignLauncherProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<CampaignSetup>({
    audiences: [],
    creatives: [],
  });

  const update = (partial: Partial<CampaignSetup>) =>
    setData((p) => ({ ...p, ...partial }));

  return (
    <CampaignLauncherContext.Provider value={{ data, update }}>
      {children}
    </CampaignLauncherContext.Provider>
  );
}

/* -------------------------------------------------------------------------- */
/*                                   Steps                                    */
/* -------------------------------------------------------------------------- */

const steps = [
  "Goal Selection",
  "AI Strategy Templates",
  "Budget Allocation",
  "Audience Recommendations",
  "Creative Selection",
  "Review & Launch"
] as const;

type StepKey = typeof steps[number];

function Sidebar({ currentStep }: { currentStep: number }) {
  return (
    <aside className="w-56 border-r pr-4">
      <ol className="space-y-4 pt-8">
        {steps.map((label, idx) => (
          <li
            key={label}
            className={cn(
              "text-sm font-medium",
              idx === currentStep ? "text-blue-600" : "text-gray-600"
            )}
          >
            {label}
          </li>
        ))}
      </ol>
    </aside>
  );
}

function GoalStep() {
  const { data, update } = useCampaignLauncher();
  const goals: Goal[] = ["Sales", "Leads", "Traffic", "App Installs"];
  return (
    <div className="grid grid-cols-2 gap-4">
      {goals.map((g) => (
        <button
          key={g}
          className={cn(
            "border rounded-lg p-4 hover:border-blue-500",
            data.goal === g && "border-blue-600 bg-blue-50"
          )}
          onClick={() => update({ goal: g })}
        >
          <span className="font-semibold">{g}</span>
        </button>
      ))}
    </div>
  );
}

function StrategyStep() {
  const { data, update } = useCampaignLauncher();
  const strategies: Strategy[] = [
    "Full-Funnel",
    "Conversion Booster",
    "Audience Expansion",
  ];
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {strategies.map((s) => (
        <button
          key={s}
          className={cn(
            "border rounded-lg p-4 hover:border-blue-500",
            data.strategy === s && "border-blue-600 bg-blue-50"
          )}
          onClick={() => update({ strategy: s })}
        >
          <span className="font-semibold">{s}</span>
        </button>
      ))}
    </div>
  );
}

function BudgetStep() {
  const { data, update } = useCampaignLauncher();
  return (
    <div className="space-y-4 max-w-sm">
      <label className="block text-sm font-medium">Daily Budget ($)</label>
      <input
        type="number"
        min={100}
        max={10000}
        value={data.dailyBudget ?? ""}
        onChange={(e) => update({ dailyBudget: parseFloat(e.target.value) })}
        className="w-full border rounded-md p-2"
      />
    </div>
  );
}

function Placeholder({ label }: { label: StepKey }) {
  return (
    <div className="h-64 flex items-center justify-center text-gray-400 border rounded-lg">
      {label} – Coming soon
    </div>
  );
}

function StepContent({ step }: { step: number }) {
  switch (step) {
    case 0:
      return <GoalStep />;
    case 1:
      return <StrategyStep />;
    case 2:
      return <BudgetStep />;
    case 3:
      return <AudienceStep />;
    case 4:
      return <CreativeStep />;
    case 5:
      return <ReviewStep />;
    default:
      return null;
  }
}

/* -------------------------------------------------------------------------- */
/*                               Main Component                               */
/* -------------------------------------------------------------------------- */

// Create a new component that uses the provider
function CampaignLauncherContent() {
  const [currentStep, setCurrentStep] = useState(0);
  const isFirst = currentStep === 0;
  const isLast = currentStep === steps.length - 1;
  const { data } = useCampaignLauncher();
  
  // Simple validation per step
  const nextDisabled = (() => {
    switch (currentStep) {
      case 0: return !data.goal; // Goal selection required
      case 1: return !data.strategy; // Strategy selection required
      case 2: return !data.dailyBudget || data.dailyBudget <= 0; // Valid budget required
      case 3: return data.audiences.length === 0; // At least one audience required
      case 4: return data.creatives.length === 0; // At least one creative required
      case 5: return false; // Review step doesn't need validation
      default: return false;
    }
  })();

  return (
    <div className="flex h-full">
      <Sidebar currentStep={currentStep} />
      <main className="flex-1 p-8 overflow-y-auto">
        <h1 className="text-xl font-semibold mb-6">{steps[currentStep]}</h1>
        <StepContent step={currentStep} />
      </main>
      
      {/* Bottom CTA Bar */}
      <div className="fixed bottom-0 inset-x-0 border-t bg-white p-4 flex justify-between items-center">
        <button
          className="px-4 py-2 border rounded-md disabled:opacity-50"
          onClick={() => setCurrentStep((s) => Math.max(s - 1, 0))}
          disabled={isFirst}
        >
          ← Back
        </button>

        <div className="space-x-2">
          {currentStep < steps.length - 1 && (
            <>
              <button
                className="px-4 py-2 border rounded-md hover:bg-gray-50 transition-colors"
                onClick={() => {
                  // Show a summary of the current setup
                  alert(JSON.stringify(data, null, 2));
                }}
              >
                Review Setup
              </button>
              <button
                onClick={() => {
                  if (!nextDisabled) {
                    setCurrentStep((s) => Math.min(s + 1, steps.length - 1));
                  }
                }}
                className={`px-4 py-2 rounded-md text-white ${
                  nextDisabled
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                } transition-colors`}
                disabled={nextDisabled}
              >
                Next →
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CampaignLauncherPage() {

  return (
    <CampaignLauncherProvider>
      <CampaignLauncherContent />
    </CampaignLauncherProvider>
  );
}
