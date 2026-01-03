'use client';
import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SearchInput } from '@/components/ui/search-input';
import { FilterDropdown } from '@/components/ui/filter-dropdown';
import { toast } from '@/components/ui/use-toast';
import { TrendingUp, AlertCircle, BarChart3, PieChart as PieChartIcon } from 'lucide-react';

interface Campaign {
  id: string;
  name: string;
  platform: string;
  spend: number;
  revenue: number;
  roas: number;
  status: string;
  conversions?: number;
}

interface KPIs {
  totalSpend: number;
  totalRevenue: number;
  avgRoas: string;
  totalConversions: number;
}

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState('Last 30 days');
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [kpis, setKpis] = useState<KPIs>({
    totalSpend: 0,
    totalRevenue: 0,
    avgRoas: '0',
    totalConversions: 0
  });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<Record<string, any>>({});

  useEffect(() => {
    fetchAnalyticsData();
  }, [dateRange, searchQuery, filters]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/campaigns');
      if (response.ok) {
        const data = await response.json();
        const campaignData = data.campaigns || [];
        
        // Apply filters
        let filteredCampaigns = campaignData;
        
        if (searchQuery) {
          filteredCampaigns = filteredCampaigns.filter((campaign: Campaign) =>
            campaign.name.toLowerCase().includes(searchQuery.toLowerCase())
          );
        }
        
        if (filters.platform) {
          filteredCampaigns = filteredCampaigns.filter((campaign: Campaign) =>
            campaign.platform === filters.platform
          );
        }
        
        if (filters.status) {
          filteredCampaigns = filteredCampaigns.filter((campaign: Campaign) =>
            campaign.status === filters.status
          );
        }
        
        setCampaigns(filteredCampaigns);
        
        // Calculate KPIs
        const totalSpend = filteredCampaigns.reduce((sum: number, c: Campaign) => sum + (c.spend || 0), 0);
        const totalRevenue = filteredCampaigns.reduce((sum: number, c: Campaign) => sum + (c.revenue || 0), 0);
        const totalConversions = filteredCampaigns.reduce((sum: number, c: Campaign) => sum + (c.conversions || 0), 0);
        const avgRoas = totalSpend > 0 ? (totalRevenue / totalSpend).toFixed(2) : '0';
        
        setKpis({
          totalSpend,
          totalRevenue,
          avgRoas,
          totalConversions
        });
      }
    } catch (error) {
      console.error('Failed to fetch analytics data:', error);
      toast({ title: 'Failed to fetch analytics data', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleDateRangeChange = (newRange: string) => {
    setDateRange(newRange);
  };

  const filterOptions = [
    {
      key: 'platform',
      label: 'Platform',
      type: 'select' as const,
      options: [
        { label: 'All', value: '' },
        { label: 'Meta', value: 'meta' },
        { label: 'Google', value: 'google' },
        { label: 'LinkedIn', value: 'linkedin' },
        { label: 'Shopify', value: 'shopify' },
      ]
    },
    {
      key: 'status',
      label: 'Status',
      type: 'select' as const,
      options: [
        { label: 'All', value: '' },
        { label: 'Active', value: 'active' },
        { label: 'Paused', value: 'paused' },
        { label: 'Completed', value: 'completed' },
      ]
    }
  ];

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
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Analytics & Performance</h1>
            <p className="text-gray-600 mt-1">Unified view of all marketing channels</p>
          </div>
          <div className="flex gap-2">
            <select
              value={dateRange}
              onChange={(e) => handleDateRangeChange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option>Today</option>
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Custom</option>
            </select>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex gap-4">
          <SearchInput
            placeholder="Search campaigns..."
            onSearch={setSearchQuery}
            className="flex-1 max-w-sm"
          />
          <FilterDropdown
            filters={filterOptions}
            onFilterChange={setFilters}
          />
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-600 text-sm">Total Spend</p>
                <p className="text-3xl font-bold mt-2">₹{(kpis.totalSpend / 100000).toFixed(1)}L</p>
              </div>
              <BarChart3 className="h-8 w-8 text-blue-500" />
            </div>
            <p className="text-green-600 text-sm mt-4">+12% vs last period</p>
          </Card>

          <Card className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-600 text-sm">Revenue Generated</p>
                <p className="text-3xl font-bold mt-2">₹{(kpis.totalRevenue / 100000).toFixed(1)}L</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
            <p className="text-green-600 text-sm mt-4">+24% vs last period</p>
          </Card>

          <Card className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-600 text-sm">Blended ROAS</p>
                <p className="text-3xl font-bold mt-2">{kpis.avgRoas}x</p>
              </div>
              <PieChartIcon className="h-8 w-8 text-purple-500" />
            </div>
            <p className="text-green-600 text-sm mt-4">+18% vs last period</p>
          </Card>

          <Card className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-600 text-sm">Conversions</p>
                <p className="text-3xl font-bold mt-2">{kpis.totalConversions.toLocaleString()}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-orange-500" />
            </div>
            <p className="text-green-600 text-sm mt-4">+8% vs last period</p>
          </Card>
        </div>

        {/* Campaigns Table */}
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">Campaign Performance</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Campaign Name</th>
                  <th className="text-left py-3 px-4">Platform</th>
                  <th className="text-left py-3 px-4">Status</th>
                  <th className="text-left py-3 px-4">Spend</th>
                  <th className="text-left py-3 px-4">Revenue</th>
                  <th className="text-left py-3 px-4">ROAS</th>
                  <th className="text-left py-3 px-4">Conversions</th>
                </tr>
              </thead>
              <tbody>
                {campaigns.map((campaign) => (
                  <tr key={campaign.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3 font-semibold">{campaign.name}</td>
                    <td className="px-4 py-3 capitalize">{campaign.platform}</td>
                    <td className="px-4 py-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        campaign.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : campaign.status === 'paused'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-4 py-3">₹{(campaign.spend / 1000).toFixed(0)}K</td>
                    <td className="px-4 py-3">₹{(campaign.revenue / 1000).toFixed(0)}K</td>
                    <td className="px-4 py-3 font-bold text-green-600">{campaign.roas}x</td>
                    <td className="px-4 py-3">{campaign.conversions || 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {campaigns.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No campaigns found matching your criteria
              </div>
            )}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}