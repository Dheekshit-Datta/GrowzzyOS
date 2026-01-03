'use client';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';

export default function LinkedInLeadsPage() {
  return (
    <DashboardLayout activeTab="analytics">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">LinkedIn Lead Generation</h1>
            <p className="text-gray-600 mt-1">Track and manage your LinkedIn lead generation campaigns</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-6 bg-white rounded-lg shadow">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-600 text-sm">Total Leads</p>
                <p className="text-2xl font-bold">892</p>
                <p className="text-green-600 text-xs">+156 this month</p>
              </div>
            </div>
          </div>
          
          <div className="p-6 bg-white rounded-lg shadow">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-600 text-sm">Qualified Leads</p>
                <p className="text-2xl font-bold">234</p>
                <p className="text-green-600 text-xs">+45 this month</p>
              </div>
            </div>
          </div>
          
          <div className="p-6 bg-white rounded-lg shadow">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-600 text-sm">Conversion Rate</p>
                <p className="text-2xl font-bold">26.2%</p>
                <p className="text-green-600 text-xs">+3.1% vs last month</p>
              </div>
            </div>
          </div>
          
          <div className="p-6 bg-white rounded-lg shadow">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-600 text-sm">Avg. CPL</p>
                <p className="text-2xl font-bold">₹85.40</p>
                <p className="text-green-600 text-xs">-₹8.20 vs last month</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-4">Recent Leads</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Name</th>
                    <th className="text-left py-2">Company</th>
                    <th className="text-left py-2">Title</th>
                    <th className="text-left py-2">Campaign</th>
                    <th className="text-left py-2">Date</th>
                    <th className="text-left py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-3">Rahul Sharma</td>
                    <td className="py-3">Tech Solutions Inc</td>
                    <td className="py-3">Marketing Manager</td>
                    <td className="py-3">B2B Lead Generation</td>
                    <td className="py-3">Dec 28, 2024</td>
                    <td className="py-3"><span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">Qualified</span></td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3">Priya Patel</td>
                    <td className="py-3">Digital Agency</td>
                    <td className="py-3">CEO</td>
                    <td className="py-3">Content Marketing</td>
                    <td className="py-3">Dec 27, 2024</td>
                    <td className="py-3"><span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs">Contacted</span></td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3">Amit Kumar</td>
                    <td className="py-3">Startup Hub</td>
                    <td className="py-3">Product Manager</td>
                    <td className="py-3">B2B Lead Generation</td>
                    <td className="py-3">Dec 26, 2024</td>
                    <td className="py-3"><span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">New</span></td>
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
