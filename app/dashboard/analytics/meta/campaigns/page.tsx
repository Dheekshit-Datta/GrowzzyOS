'use client';
import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Pause, Play, Edit2, Eye } from 'lucide-react';

interface Campaign {
  id: string;
  name: string;
  status: string;
  spend: number;
  conversions: number;
  revenue: number;
  roas: string;
  ctr: number;
  cpc: number;
  created_at: string;
}

export default function MetaCampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('last30days');

  useEffect(() => {
    fetchCampaigns();
  }, [dateRange]);

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/analytics/meta/campaigns?dateRange=${dateRange}`);
      
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setCampaigns(result.data.campaigns);
          setSummary(result.data.summary);
        }
      } else {
        console.error('Failed to fetch campaigns');
      }
    } catch (error) {
      console.error('Error fetching campaigns:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleCampaignStatus = (id: string) => {
    setCampaigns(campaigns.map(c => 
      c.id === id 
        ? { ...c, status: c.status === 'active' ? 'paused' : 'active' }
        : c
    ));
  };

  if (loading) {
    return (
      <DashboardLayout activeTab="analytics">
        <div className="space-y-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1,2,3,4].map(i => (
              <div key={i} className="p-6 bg-white rounded-lg shadow animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout activeTab="analytics">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Meta Campaigns</h1>
            <p className="text-gray-600 mt-1">Manage and analyze your Meta ad campaigns</p>
          </div>
          <div className="flex gap-2">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-3 py-2 border rounded-lg text-sm"
            >
              <option value="last7days">Last 7 Days</option>
              <option value="last30days">Last 30 Days</option>
              <option value="last90days">Last 90 Days</option>
            </select>
            <Button className="bg-black hover:bg-gray-800 text-white flex items-center gap-2">
              <Plus className="h-4 w-4" />
              New Campaign
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-600 text-sm">Active Campaigns</p>
                <p className="text-2xl font-bold">{summary?.activeCampaigns || 0}</p>
                <p className="text-green-600 text-xs">{summary?.trends?.activeCampaignsChange || ''}</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-600 text-sm">Total Spend</p>
                <p className="text-2xl font-bold">₹{(summary?.totalSpend || 0).toLocaleString()}</p>
                <p className="text-red-600 text-xs">{summary?.trends?.spendChange || ''}</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-600 text-sm">Conversions</p>
                <p className="text-2xl font-bold">{summary?.totalConversions || 0}</p>
                <p className="text-green-600 text-xs">{summary?.trends?.conversionsChange || ''}</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-600 text-sm">ROAS</p>
                <p className="text-2xl font-bold">{summary?.avgROAS || 0}x</p>
                <p className="text-green-600 text-xs">{summary?.trends?.roasChange || ''}</p>
              </div>
            </div>
          </Card>
        </div>

        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Campaign Performance</h2>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Search campaigns..."
                className="px-3 py-2 border rounded-lg text-sm"
              />
              <select className="px-3 py-2 border rounded-lg text-sm">
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="paused">Paused</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Campaign Name</th>
                  <th className="text-left py-3 px-4">Status</th>
                  <th className="text-left py-3 px-4">Spend</th>
                  <th className="text-left py-3 px-4">Conversions</th>
                  <th className="text-left py-3 px-4">Revenue</th>
                  <th className="text-left py-3 px-4">ROAS</th>
                  <th className="text-left py-3 px-4">CTR</th>
                  <th className="text-left py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {campaigns.map((campaign) => (
                  <tr key={campaign.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">{campaign.name}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded text-xs ${
                        campaign.status === 'active' 
                          ? 'bg-green-100 text-green-800'
                          : campaign.status === 'paused'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-3 px-4">₹{campaign.spend.toLocaleString()}</td>
                    <td className="py-3 px-4">{campaign.conversions}</td>
                    <td className="py-3 px-4">₹{campaign.revenue.toLocaleString()}</td>
                    <td className="py-3 px-4 font-bold text-green-600">{campaign.roas}x</td>
                    <td className="py-3 px-4">{campaign.ctr}%</td>
                    <td className="py-3 px-4">
                      <div className="flex gap-1">
                        <button className="p-1 hover:bg-gray-200 rounded" title="View">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="p-1 hover:bg-gray-200 rounded" title="Edit">
                          <Edit2 className="h-4 w-4" />
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
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {campaigns.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No campaigns found for the selected period
              </div>
            )}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
