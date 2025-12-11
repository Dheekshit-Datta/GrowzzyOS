'use client';
import { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { mockAutomations } from '@/lib/mockData';
import { Plus, Edit2, Pause, Play, Trash2, Eye, Clock } from 'lucide-react';

export default function AutomationsPage() {
  const [automations, setAutomations] = useState(mockAutomations);
  const [showModal, setShowModal] = useState(false);
  const [selectedAuto, setSelectedAuto] = useState<typeof mockAutomations[0] | null>(null);

  const toggleStatus = (id: string) => {
    setAutomations(
      automations.map((a) =>
        a.id === id
          ? { ...a, status: a.status === 'active' ? 'paused' : 'active' }
          : a
      )
    );
  };

  const deleteAutomation = (id: string) => {
    setAutomations(automations.filter((a) => a.id !== id));
  };

  const activeCount = automations.filter((a) => a.status === 'active').length;

  return (
    <DashboardLayout activeTab="automations">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Automations & Workflow Builder</h1>
            <p className="text-gray-600 mt-1">Create workflows to automate repetitive marketing tasks</p>
          </div>
          <Button className="bg-black hover:bg-gray-800 text-white flex items-center gap-2">
            <Plus className="h-4 w-4" />
            New Automation
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-6">
            <p className="text-gray-600 text-sm">Total Automations</p>
            <p className="text-3xl font-bold mt-2">{automations.length}</p>
          </Card>
          <Card className="p-6">
            <p className="text-gray-600 text-sm">Active</p>
            <p className="text-3xl font-bold mt-2">{activeCount}</p>
          </Card>
          <Card className="p-6">
            <p className="text-gray-600 text-sm">Time Saved (hrs/week)</p>
            <p className="text-3xl font-bold mt-2">~{activeCount * 2}</p>
          </Card>
        </div>

        {/* Automations List */}
        <div className="space-y-4">
          {automations.map((auto) => (
            <Card key={auto.id} className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-bold">{auto.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{auto.trigger}</p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    auto.status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {auto.status.charAt(0).toUpperCase() + auto.status.slice(1)}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-xs text-gray-600">Condition</p>
                  <p className="text-sm font-semibold mt-1">{auto.condition}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-xs text-gray-600">Action</p>
                  <p className="text-sm font-semibold mt-1">{auto.action}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <div className="flex items-center gap-1 text-xs text-gray-600">
                    <Clock className="h-3 w-3" />
                    Last Run
                  </div>
                  <p className="text-sm font-semibold mt-1">
                    {new Date(auto.lastRun).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setSelectedAuto(auto);
                    setShowModal(true);
                  }}
                  className="flex-1 p-2 bg-black hover:bg-gray-800 text-white text-sm rounded flex items-center justify-center gap-2"
                >
                  <Eye className="h-4 w-4" />
                  View Details
                </button>
                <button
                  onClick={() => toggleStatus(auto.id)}
                  className="p-2 hover:bg-gray-200 rounded"
                  title={auto.status === 'active' ? 'Pause' : 'Resume'}
                >
                  {auto.status === 'active' ? (
                    <Pause className="h-4 w-4" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                </button>
                <button
                  onClick={() => deleteAutomation(auto.id)}
                  className="p-2 hover:bg-red-100 rounded text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </Card>
          ))}
        </div>

        {/* Details Modal */}
        {showModal && selectedAuto && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="p-8 max-w-2xl w-full mx-4">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold">{selectedAuto.name}</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <p className="text-gray-600 text-sm">Trigger</p>
                  <p className="text-lg font-semibold">{selectedAuto.trigger}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Condition</p>
                  <p className="text-lg font-semibold">{selectedAuto.condition}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Action</p>
                  <p className="text-lg font-semibold">{selectedAuto.action}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-600 text-sm">Status</p>
                    <p className="text-lg font-semibold capitalize">{selectedAuto.status}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Next Run</p>
                    <p className="text-lg font-semibold">
                      {new Date(selectedAuto.nextRun).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button className="flex-1 bg-black hover:bg-gray-800 text-white">
                  Edit Automation
                </Button>
                <Button
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900"
                >
                  Close
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
