'use client';
import { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { mockCampaigns, calculateKPIs, getPlatformBreakdown, mockMetrics } from '@/lib/mockData';
import { TrendingUp, AlertCircle, BarChart3, PieChart as PieChartIcon } from 'lucide-react';

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState('Last 30 days');
  const kpis = calculateKPIs();
  const platformBreakdown = getPlatformBreakdown();

  return (
    <DashboardLayout activeTab="analytics">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Analytics & Performance</h1>
            <p className="text-gray-600 mt-1">Unified view of all marketing channels</p>
          </div>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm"
          >
            <option>Today</option>
            <option>Last 7 days</option>
            <option>Last 30 days</option>
            <option>Custom</option>
          </select>
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

        {/* Platform Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Platform Performance</h2>
            <div className="space-y-4">
              {platformBreakdown.map((platform) => (
                <div key={platform.platform} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-semibold">{platform.platform}</p>
                    <p className="text-sm text-gray-600">{platform.campaigns} campaigns</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">₹{(platform.spend / 1000).toFixed(0)}K</p>
                    <p className="text-sm text-green-600">{platform.roas}x ROAS</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Top Campaigns</h2>
            <div className="space-y-3">
              {mockCampaigns
                .sort((a, b) => b.revenue - a.revenue)
                .slice(0, 5)
                .map((campaign) => (
                  <div key={campaign.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-semibold text-sm">{campaign.name}</p>
                      <p className="text-xs text-gray-600">{campaign.platform}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-sm">₹{(campaign.revenue / 1000).toFixed(0)}K</p>
                      <p className="text-xs text-green-600">{campaign.roas}x</p>
                    </div>
                  </div>
                ))}
            </div>
          </Card>
        </div>

        {/* Campaign Details Table */}
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">Campaign Details</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left">Campaign</th>
                  <th className="px-4 py-2 text-left">Platform</th>
                  <th className="px-4 py-2 text-right">Spend</th>
                  <th className="px-4 py-2 text-right">Revenue</th>
                  <th className="px-4 py-2 text-right">ROAS</th>
                  <th className="px-4 py-2 text-right">CTR</th>
                  <th className="px-4 py-2 text-right">Conversions</th>
                  <th className="px-4 py-2 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {mockCampaigns.map((campaign) => (
                  <tr key={campaign.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3 font-semibold">{campaign.name}</td>
                    <td className="px-4 py-3 capitalize">{campaign.platform}</td>
                    <td className="px-4 py-3 text-right">₹{(campaign.spend / 1000).toFixed(0)}K</td>
                    <td className="px-4 py-3 text-right">₹{(campaign.revenue / 1000).toFixed(0)}K</td>
                    <td className="px-4 py-3 text-right font-bold text-green-600">{campaign.roas}x</td>
                    <td className="px-4 py-3 text-right">{campaign.ctr}%</td>
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Alerts */}
        <Card className="p-6 bg-red-50 border-red-200">
          <div className="flex gap-4">
            <AlertCircle className="h-6 w-6 text-red-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-red-900">Performance Alerts</h3>
              <ul className="mt-2 space-y-1 text-sm text-red-800">
                <li>• Shopify Flash Sale ROAS dropped to 2.0x (below 2.5x target)</li>
                <li>• Google Ads CTR at 2.8% (industry avg: 3.2%)</li>
                <li>• LinkedIn campaign CPC increased 15% week-over-week</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
