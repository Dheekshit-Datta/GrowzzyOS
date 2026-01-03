'use client';
import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Edit2, Pause, Play, Trash2, Eye } from 'lucide-react';
import { showToast } from '@/components/Toast';

type Campaign = {
  id: string;
  name: string;
  platform: string;
  spend: number;
  revenue: number;
  roas: number;
  conversions: number;
  status: 'active' | 'paused' | 'completed';
  created_at: string;
  ctr?: number;
  cpc?: number;
};

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [editFormData, setEditFormData] = useState({ name: '', budget: 0, bidding: 'cpc' });
  const [editLoading, setEditLoading] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [createForm, setCreateForm] = useState({
    name: '',
    platform: 'meta',
    objective: 'conversions',
    budget: '',
    startDate: '',
    endDate: '',
  });

  useEffect(() => {
    fetch('/api/campaigns')
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data) => setCampaigns(data.campaigns || []))
      .catch((e) => console.error('Failed to fetch campaigns', e))
      .finally(() => setLoading(false));
  }, []);

  const toggleCampaignStatus = (id: string) => {
    setCampaigns(
      campaigns.map((c) =>
        c.id === id
          ? { ...c, status: c.status === 'active' ? 'paused' : 'active' }
          : c
      )
    );
    const campaign = campaigns.find((c) => c.id === id);
    const newStatus = campaign?.status === 'active' ? 'paused' : 'active';
    showToast(
      `Campaign ${newStatus === 'active' ? 'resumed' : 'paused'} successfully`,
      'success'
    );
  };

  const deleteCampaign = (id: string) => {
    setCampaigns(campaigns.filter((c) => c.id !== id));
    showToast('Campaign deleted successfully', 'success');
  };

  const handleEditClick = () => {
    if (selectedCampaign) {
      setEditFormData({
        name: selectedCampaign.name,
        budget: selectedCampaign.spend,
        bidding: 'cpc',
      });
      setShowEditModal(true);
    }
  };

  const handleCreateCampaign = async () => {
    if (!createForm.name.trim()) {
      showToast('Campaign name is required', 'error');
      return;
    }
    if (!createForm.budget || Number(createForm.budget) <= 0) {
      showToast('Valid budget is required', 'error');
      return;
    }
    setCreateLoading(true);
    try {
      // TODO: real API call
      await new Promise(resolve => setTimeout(resolve, 800));
      setShowCreateModal(false);
      setCreateForm({
        name: '',
        platform: 'meta',
        objective: 'conversions',
        budget: '',
        startDate: '',
        endDate: '',
      });
      showToast('Campaign created successfully', 'success');
    } catch (error) {
      showToast('Failed to create campaign', 'error');
    } finally {
      setCreateLoading(false);
    }
  };

  const handleSaveEdit = async () => {
    if (!selectedCampaign) return;
    setEditLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      setCampaigns(
        campaigns.map((c) =>
          c.id === selectedCampaign.id
            ? { ...c, name: editFormData.name, spend: editFormData.budget }
            : c
        )
      );
      setSelectedCampaign({
        ...selectedCampaign,
        name: editFormData.name,
        spend: editFormData.budget,
      });
      showToast('Campaign updated successfully', 'success');
      setShowEditModal(false);
    } catch (error) {
      showToast('Failed to update campaign', 'error');
    } finally {
      setEditLoading(false);
    }
  };

  const activeCampaigns = campaigns.filter((c) => c.status === 'active').length;
  const totalSpend = campaigns.reduce((sum, c) => sum + c.spend, 0);
  const totalRevenue = campaigns.reduce((sum, c) => sum + c.revenue, 0);

  return (
    <DashboardLayout activeTab="campaigns">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Campaigns</h1>
            <p className="text-gray-600 mt-1">Manage and optimize your marketing campaigns</p>
          </div>
          <Button 
            className="bg-black hover:bg-gray-800 text-white flex items-center gap-2"
            onClick={() => setShowCreateModal(true)}
          >
            <Plus className="h-4 w-4" />
            New Campaign
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-6">
            <p className="text-gray-600 text-sm">Active Campaigns</p>
            <p className="text-3xl font-bold mt-2">{activeCampaigns}</p>
          </Card>
          <Card className="p-6">
            <p className="text-gray-600 text-sm">Total Spend</p>
            <p className="text-3xl font-bold mt-2">₹{(totalSpend / 100000).toFixed(1)}L</p>
          </Card>
          <Card className="p-6">
            <p className="text-gray-600 text-sm">Total Revenue</p>
            <p className="text-3xl font-bold mt-2">₹{(totalRevenue / 100000).toFixed(1)}L</p>
          </Card>
        </div>

        {/* Campaigns List */}
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">All Campaigns</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left">Campaign Name</th>
                  <th className="px-4 py-3 text-left">Platform</th>
                  <th className="px-4 py-3 text-right">Spend</th>
                  <th className="px-4 py-3 text-right">Revenue</th>
                  <th className="px-4 py-3 text-right">ROAS</th>
                  <th className="px-4 py-3 text-right">Conversions</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {campaigns.map((campaign) => (
                  <tr key={campaign.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3 font-semibold">{campaign.name}</td>
                    <td className="px-4 py-3 capitalize">{campaign.platform}</td>
                    <td className="px-4 py-3 text-right">₹{(campaign.spend / 1000).toFixed(0)}K</td>
                    <td className="px-4 py-3 text-right">₹{(campaign.revenue / 1000).toFixed(0)}K</td>
                    <td className="px-4 py-3 text-right font-bold text-green-600">{campaign.roas}x</td>
                    <td className="px-4 py-3 text-right">{campaign.conversions}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          campaign.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : campaign.status === 'paused'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setSelectedCampaign(campaign);
                            setShowDetailsModal(true);
                          }}
                          className="p-1 hover:bg-gray-200 rounded"
                          title="View"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => toggleCampaignStatus(campaign.id)}
                          className="p-1 hover:bg-gray-200 rounded"
                          title={campaign.status === 'active' ? 'Pause' : 'Resume'}
                        >
                          {campaign.status === 'active' ? (
                            <Pause className="h-4 w-4" />
                          ) : (
                            <Play className="h-4 w-4" />
                          )}
                        </button>
                        <button
                          onClick={() => deleteCampaign(campaign.id)}
                          className="p-1 hover:bg-red-200 rounded text-red-600"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Campaign Details Modal */}
        {showDetailsModal && selectedCampaign && (
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setShowDetailsModal(false)}>
            <Card className="p-8 max-w-2xl w-full mx-4" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold">{selectedCampaign.name}</h2>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <p className="text-gray-600 text-sm">Platform</p>
                  <p className="text-lg font-semibold capitalize">{selectedCampaign.platform}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Status</p>
                  <p className="text-lg font-semibold capitalize">{selectedCampaign.status}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Total Spend</p>
                  <p className="text-lg font-semibold">₹{(selectedCampaign.spend / 1000).toFixed(0)}K</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Revenue</p>
                  <p className="text-lg font-semibold">₹{(selectedCampaign.revenue / 1000).toFixed(0)}K</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">ROAS</p>
                  <p className="text-lg font-semibold text-green-600">{selectedCampaign.roas}x</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">CTR</p>
                  <p className="text-lg font-semibold">{selectedCampaign.ctr}%</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">CPC</p>
                  <p className="text-lg font-semibold">₹{selectedCampaign.cpc}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Conversions</p>
                  <p className="text-lg font-semibold">{selectedCampaign.conversions}</p>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={handleEditClick}
                  className="flex-1 bg-black hover:bg-gray-800 text-white flex items-center justify-center gap-2"
                >
                  <Edit2 className="h-4 w-4" />
                  Edit Campaign
                </Button>
                <Button
                  onClick={() => setShowDetailsModal(false)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900"
                >
                  Close
                </Button>
              </div>
            </Card>
          </div>
        )}

        {/* Edit Campaign Modal */}
        {showEditModal && selectedCampaign && (
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setShowEditModal(false)}>
            <Card className="p-8 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
              <h2 className="text-2xl font-bold mb-6">Edit Campaign</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Campaign Name</label>
                  <input
                    type="text"
                    value={editFormData.name}
                    onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Daily Budget (₹)</label>
                  <input
                    type="number"
                    value={editFormData.budget}
                    onChange={(e) => setEditFormData({ ...editFormData, budget: Number(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Bidding Strategy</label>
                  <select
                    value={editFormData.bidding}
                    onChange={(e) => setEditFormData({ ...editFormData, bidding: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  >
                    <option value="cpc">Cost Per Click (CPC)</option>
                    <option value="cpa">Cost Per Acquisition (CPA)</option>
                    <option value="roas">ROAS Target</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <Button
                  onClick={handleSaveEdit}
                  disabled={editLoading}
                  className="flex-1 bg-black hover:bg-gray-800 text-white"
                >
                  {editLoading ? 'Saving...' : 'Save & Apply'}
                </Button>
                <Button
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900"
                >
                  Cancel
                </Button>
              </div>
            </Card>
          </div>
        )}

        {/* Create Campaign Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold mb-4">Create New Campaign</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Campaign Name</label>
                  <input
                    type="text"
                    className="w-full border rounded px-3 py-2"
                    placeholder="My Campaign"
                    value={createForm.name}
                    onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Platform</label>
                  <select
                    className="w-full border rounded px-3 py-2"
                    value={createForm.platform}
                    onChange={(e) => setCreateForm({ ...createForm, platform: e.target.value })}
                  >
                    <option value="meta">Meta Ads</option>
                    <option value="google">Google Ads</option>
                    <option value="linkedin">LinkedIn</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Objective</label>
                  <select
                    className="w-full border rounded px-3 py-2"
                    value={createForm.objective}
                    onChange={(e) => setCreateForm({ ...createForm, objective: e.target.value })}
                  >
                    <option value="awareness">Brand Awareness</option>
                    <option value="traffic">Traffic</option>
                    <option value="engagement">Engagement</option>
                    <option value="leads">Leads</option>
                    <option value="conversions">Conversions</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Budget (₹)</label>
                  <input
                    type="number"
                    className="w-full border rounded px-3 py-2"
                    placeholder="5000"
                    value={createForm.budget}
                    onChange={(e) => setCreateForm({ ...createForm, budget: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Start Date</label>
                  <input
                    type="date"
                    className="w-full border rounded px-3 py-2"
                    value={createForm.startDate}
                    onChange={(e) => setCreateForm({ ...createForm, startDate: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">End Date (optional)</label>
                  <input
                    type="date"
                    className="w-full border rounded px-3 py-2"
                    value={createForm.endDate}
                    onChange={(e) => setCreateForm({ ...createForm, endDate: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <Button
                  onClick={handleCreateCampaign}
                  disabled={createLoading}
                  className="flex-1 bg-black hover:bg-gray-800 text-white"
                >
                  {createLoading ? 'Creating...' : 'Create Campaign'}
                </Button>
                <Button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
