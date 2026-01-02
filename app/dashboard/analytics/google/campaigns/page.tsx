'use client';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';

export default function GoogleCampaignsPage() {
  return (
    <DashboardLayout activeTab="analytics">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Google Campaigns</h1>
            <p className="text-gray-600 mt-1">Manage and analyze your Google ad campaigns</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-6 bg-white rounded-lg shadow">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-600 text-sm">Active Campaigns</p>
                <p className="text-2xl font-bold">8</p>
                <p className="text-green-600 text-xs">+2 this week</p>
              </div>
            </div>
          </div>
          
          <div className="p-6 bg-white rounded-lg shadow">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-600 text-sm">Total Spend</p>
                <p className="text-2xl font-bold">₹32,150</p>
                <p className="text-red-600 text-xs">+8% vs last month</p>
              </div>
            </div>
          </div>
          
          <div className="p-6 bg-white rounded-lg shadow">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-600 text-sm">Conversions</p>
                <p className="text-2xl font-bold">456</p>
                <p className="text-green-600 text-xs">+12% vs last month</p>
              </div>
            </div>
          </div>
          
          <div className="p-6 bg-white rounded-lg shadow">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-600 text-sm">ROAS</p>
                <p className="text-2xl font-bold">2.8x</p>
                <p className="text-green-600 text-xs">+0.2 vs last month</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-4">Campaign Performance</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Campaign Name</th>
                    <th className="text-left py-2">Status</th>
                    <th className="text-left py-2">Spend</th>
                    <th className="text-left py-2">Conversions</th>
                    <th className="text-left py-2">ROAS</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-3">Search Ads - Brand</td>
                    <td className="py-3"><span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">Active</span></td>
                    <td className="py-3">₹15,230</td>
                    <td className="py-3">189</td>
                    <td className="py-3">3.2x</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3">Display Ads - Retargeting</td>
                    <td className="py-3"><span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">Active</span></td>
                    <td className="py-3">₹8,920</td>
                    <td className="py-3">98</td>
                    <td className="py-3">2.1x</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
