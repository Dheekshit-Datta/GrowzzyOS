'use client';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';

export default function LinkedInCampaignsPage() {
  return (
    <DashboardLayout activeTab="analytics">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">LinkedIn Campaigns</h1>
            <p className="text-gray-600 mt-1">Manage and analyze your LinkedIn ad campaigns</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-6 bg-white rounded-lg shadow">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-600 text-sm">Active Campaigns</p>
                <p className="text-2xl font-bold">5</p>
                <p className="text-green-600 text-xs">+1 this week</p>
              </div>
            </div>
          </div>
          
          <div className="p-6 bg-white rounded-lg shadow">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-600 text-sm">Total Spend</p>
                <p className="text-2xl font-bold">₹18,920</p>
                <p className="text-red-600 text-xs">+15% vs last month</p>
              </div>
            </div>
          </div>
          
          <div className="p-6 bg-white rounded-lg shadow">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-600 text-sm">Leads</p>
                <p className="text-2xl font-bold">234</p>
                <p className="text-green-600 text-xs">+28% vs last month</p>
              </div>
            </div>
          </div>
          
          <div className="p-6 bg-white rounded-lg shadow">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-600 text-sm">CPL</p>
                <p className="text-2xl font-bold">₹80.90</p>
                <p className="text-green-600 text-xs">-₹12 vs last month</p>
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
                    <th className="text-left py-2">Leads</th>
                    <th className="text-left py-2">CPL</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-3">B2B Lead Generation</td>
                    <td className="py-3"><span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">Active</span></td>
                    <td className="py-3">₹8,450</td>
                    <td className="py-3">89</td>
                    <td className="py-3">₹94.90</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3">Content Marketing</td>
                    <td className="py-3"><span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">Active</span></td>
                    <td className="py-3">₹6,230</td>
                    <td className="py-3">78</td>
                    <td className="py-3">₹79.90</td>
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
