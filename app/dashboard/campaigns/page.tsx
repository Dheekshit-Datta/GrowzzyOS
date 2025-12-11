'use client';
import { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { mockCampaigns } from '@/lib/mockData';
import { Plus, Edit2, Pause, Play, Trash2, Eye } from 'lucide-react';
import { showToast } from '@/components/Toast';

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState(mockCampaigns);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<typeof mockCampaigns[0] | null>(null);
  const [editFormData, setEditFormData] = useState({ name: '', budget: 0, bidding: 'cpc' });
  const [editLoading, setEditLoading] = useState(false);

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
            onClick={() => window.location.href = '/dashboard/campaign-launcher'}
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
                            setShowModal(true);
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
        {showModal && selectedCampaign && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="p-8 max-w-2xl w-full mx-4">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold">{selectedCampaign.name}</h2>
                <button
                  onClick={() => setShowModal(false)}
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
                  onClick={() => setShowModal(false)}
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
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="p-8 max-w-md w-full mx-4">
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
      </div>
    </DashboardLayout>
  );
}
