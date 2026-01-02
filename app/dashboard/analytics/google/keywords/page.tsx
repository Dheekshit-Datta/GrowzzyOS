'use client';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';

export default function GoogleKeywordsPage() {
  return (
    <DashboardLayout activeTab="analytics">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Google Keywords</h1>
            <p className="text-gray-600 mt-1">Analyze keyword performance and search trends</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-6 bg-white rounded-lg shadow">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-600 text-sm">Total Keywords</p>
                <p className="text-2xl font-bold">156</p>
                <p className="text-green-600 text-xs">+12 this week</p>
              </div>
            </div>
          </div>
          
          <div className="p-6 bg-white rounded-lg shadow">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-600 text-sm">Impressions</p>
                <p className="text-2xl font-bold">89.2K</p>
                <p className="text-green-600 text-xs">+18% vs last month</p>
              </div>
            </div>
          </div>
          
          <div className="p-6 bg-white rounded-lg shadow">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-600 text-sm">Clicks</p>
                <p className="text-2xl font-bold">2,341</p>
                <p className="text-green-600 text-xs">+24% vs last month</p>
              </div>
            </div>
          </div>
          
          <div className="p-6 bg-white rounded-lg shadow">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-600 text-sm">Avg. CPC</p>
                <p className="text-2xl font-bold">₹12.50</p>
                <p className="text-red-600 text-xs">+₹1.20 vs last month</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-4">Top Performing Keywords</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Keyword</th>
                    <th className="text-left py-2">Match Type</th>
                    <th className="text-left py-2">Impressions</th>
                    <th className="text-left py-2">Clicks</th>
                    <th className="text-left py-2">CTR</th>
                    <th className="text-left py-2">CPC</th>
                    <th className="text-left py-2">Conversions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-3 font-medium">digital marketing agency</td>
                    <td className="py-3"><span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">Exact</span></td>
                    <td className="py-3">12,450</td>
                    <td className="py-3">234</td>
                    <td className="py-3">1.88%</td>
                    <td className="py-3">₹18.50</td>
                    <td className="py-3">23</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 font-medium">social media marketing</td>
                    <td className="py-3"><span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">Phrase</span></td>
                    <td className="py-3">8,320</td>
                    <td className="py-3">156</td>
                    <td className="py-3">1.87%</td>
                    <td className="py-3">₹15.20</td>
                    <td className="py-3">18</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 font-medium">SEO services</td>
                    <td className="py-3"><span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs">Broad</span></td>
                    <td className="py-3">6,780</td>
                    <td className="py-3">98</td>
                    <td className="py-3">1.45%</td>
                    <td className="py-3">₹22.30</td>
                    <td className="py-3">12</td>
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
