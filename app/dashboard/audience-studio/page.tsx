"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

const audienceTabs = [
  "Lookalikes",
  "Interest",
  "Behavioral",
  "Retargeting",
  "Zero-party",
] as const;

type Tab = typeof audienceTabs[number];

export default function AudienceStudioPage() {
  const [activeTab, setActiveTab] = useState<Tab>("Lookalikes");

  return (
    <div className="flex h-full">
      {/* Left Panel */}
      <aside className="w-72 border-r p-4 space-y-6">
        {/* Tabs */}
        <div className="space-y-2">
          {audienceTabs.map((t) => (
            <button
              key={t}
              className={cn(
                "w-full text-left px-3 py-2 rounded-md hover:bg-gray-100",
                activeTab === t && "bg-blue-50 text-blue-600 font-medium"
              )}
              onClick={() => setActiveTab(t)}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Search + New Button */}
        <div className="flex items-center gap-2">
          <input
            placeholder="Search audiences..."
            className="flex-1 border rounded-md px-2 py-1 text-sm"
          />
          <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md">
            + New
          </button>
        </div>

        {/* Audience list placeholder */}
        <div className="overflow-y-auto h-[60vh] text-gray-500 text-sm flex items-center justify-center border rounded-md">
          {activeTab} audience list – Coming soon
        </div>
      </aside>

      {/* Main Panel */}
      <main className="flex-1 p-8 overflow-y-auto space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-semibold">{activeTab} Audience</h1>
          <span className="text-sm text-gray-500">Size: 2.3M • Last updated: —</span>
        </div>

        {/* AI Audience Wizard placeholder */}
        <section className="border rounded-lg p-6 text-gray-400">
          AI Audience Wizard – Coming soon
        </section>

        {/* Audience Inspector grid placeholder */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-40 border rounded-lg flex items-center justify-center text-gray-400"
            >
              Inspector Card {i + 1} – Coming soon
            </div>
          ))}
        </section>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md">
            Add to Campaign
          </button>
          <button className="px-4 py-2 border rounded-md">Save Audience Set</button>
          <button className="px-4 py-2 border rounded-md">Export</button>
          <button className="px-4 py-2 border text-red-600 rounded-md">Delete</button>
        </div>
      </main>

      {/* Right Panel placeholder */}
      <aside className="hidden lg:block w-80 border-l p-4 text-gray-400">
        Right detail panel – Coming soon
      </aside>
    </div>
  );
}
