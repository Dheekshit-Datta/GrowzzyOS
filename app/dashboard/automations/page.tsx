'use client';
import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { Plus, Edit2, Pause, Play, Trash2, Eye, Clock } from 'lucide-react';

interface Automation {
  id: string;
  name: string;
  trigger: string;
  condition: string;
  action: string;
  status: 'active' | 'paused' | 'completed';
  lastRun: string | null;
  nextRun: string;
  createdAt: string;
}

export default function AutomationsPage() {
  const [automations, setAutomations] = useState<Automation[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedAuto, setSelectedAuto] = useState<Automation | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    trigger: '',
    condition: '',
    action: '',
    status: 'active' as 'active' | 'paused' | 'completed'
  });

  // Fetch automations from API
  useEffect(() => {
    fetchAutomations();
  }, []);

  const fetchAutomations = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/automations');
      if (response.ok) {
        const data = await response.json();
        setAutomations(data.automations || []);
      }
    } catch (error) {
      toast({ title: 'Failed to fetch automations', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (id: string) => {
    try {
      const automation = automations.find(a => a.id === id);
      const newStatus = automation?.status === 'active' ? 'paused' : 'active';
      
      const response = await fetch('/api/automations', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, status: newStatus }),
      });

      if (response.ok) {
        setAutomations(
          automations.map((a) =>
            a.id === id ? { ...a, status: newStatus } : a
          )
        );
        toast({ title: `Automation ${newStatus} successfully` });
      } else {
        toast({ title: 'Failed to update automation', variant: 'destructive' });
      }
    } catch (error) {
      toast({ title: 'Failed to update automation', variant: 'destructive' });
    }
  };

  const deleteAutomation = async (id: string) => {
    try {
      const response = await fetch(`/api/automations?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setAutomations(automations.filter((a) => a.id !== id));
        toast({ title: 'Automation deleted successfully' });
      } else {
        toast({ title: 'Failed to delete automation', variant: 'destructive' });
      }
    } catch (error) {
      toast({ title: 'Failed to delete automation', variant: 'destructive' });
    }
  };

  const handleCreateNew = () => {
    setFormData({
      name: '',
      trigger: '',
      condition: '',
      action: '',
      status: 'active'
    });
    setEditMode(false);
    setShowCreateModal(true);
  };

  const handleEdit = () => {
    if (selectedAuto) {
      setFormData({
        name: selectedAuto.name,
        trigger: selectedAuto.trigger,
        condition: selectedAuto.condition,
        action: selectedAuto.action,
        status: selectedAuto.status
      });
      setEditMode(true);
      setShowModal(false);
      setShowCreateModal(true);
    }
  };

  const handleSave = async () => {
    if (!formData.name || !formData.trigger || !formData.condition || !formData.action) {
      toast({ title: 'Please fill all fields', variant: 'destructive' });
      return;
    }

    try {
      if (editMode && selectedAuto) {
        // Update existing automation
        const response = await fetch('/api/automations', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            id: selectedAuto.id, 
            ...formData 
          }),
        });

        if (response.ok) {
          setAutomations(automations.map(a => 
            a.id === selectedAuto.id ? { ...a, ...formData } : a
          ));
          setShowCreateModal(false);
          toast({ title: 'Automation updated successfully' });
        } else {
          toast({ title: 'Failed to update automation', variant: 'destructive' });
        }
      } else {
        // Create new automation
        const response = await fetch('/api/automations', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          const newAutomation = await response.json();
          setAutomations([...automations, newAutomation]);
          setShowCreateModal(false);
          toast({ title: 'Automation created successfully' });
        } else {
          toast({ title: 'Failed to create automation', variant: 'destructive' });
        }
      }
    } catch (error) {
      toast({ title: 'Failed to save automation', variant: 'destructive' });
    }
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
          <Button onClick={handleCreateNew} className="bg-black hover:bg-gray-800 text-white flex items-center gap-2">
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
                    {auto.lastRun ? new Date(auto.lastRun).toLocaleDateString() : 'Never'}
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
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setShowModal(false)}>
            <Card className="p-8 max-w-2xl w-full mx-4" onClick={(e) => e.stopPropagation()}>
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
                      {selectedAuto.nextRun ? new Date(selectedAuto.nextRun).toLocaleString() : 'Not scheduled'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button onClick={handleEdit} className="flex-1 bg-black hover:bg-gray-800 text-white">
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

        {/* Create/Edit Automation Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setShowCreateModal(false)}>
            <Card className="p-8 max-w-2xl w-full mx-4" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold">{editMode ? 'Edit Automation' : 'Create New Automation'}</h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-semibold mb-2">Automation Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Daily Performance Report"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Trigger</label>
                  <select
                    value={formData.trigger}
                    onChange={(e) => setFormData({ ...formData, trigger: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm"
                  >
                    <option value="">Select trigger</option>
                    <option value="Daily at 9:00 AM">Daily at 9:00 AM</option>
                    <option value="Weekly on Monday">Weekly on Monday</option>
                    <option value="Monthly on 1st">Monthly on 1st</option>
                    <option value="When ROAS drops below 2.0">When ROAS drops below 2.0</option>
                    <option value="When campaign ends">When campaign ends</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Condition</label>
                  <input
                    type="text"
                    value={formData.condition}
                    onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                    placeholder="e.g., Campaign spend > ₹10,000"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Action</label>
                  <select
                    value={formData.action}
                    onChange={(e) => setFormData({ ...formData, action: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm"
                  >
                    <option value="">Select action</option>
                    <option value="Send email notification">Send email notification</option>
                    <option value="Pause campaign">Pause campaign</option>
                    <option value="Increase budget by 20%">Increase budget by 20%</option>
                    <option value="Generate performance report">Generate performance report</option>
                    <option value="Create new ad variant">Create new ad variant</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'paused' | 'completed' })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm"
                  >
                    <option value="active">Active</option>
                    <option value="paused">Paused</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3">
                <Button onClick={handleSave} className="flex-1 bg-black hover:bg-gray-800 text-white">
                  {editMode ? 'Update Automation' : 'Create Automation'}
                </Button>
                <Button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900"
                >
                  Cancel
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
