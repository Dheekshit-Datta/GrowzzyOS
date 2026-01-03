'use client';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';

export default function ShopifyOrdersPage() {
  return (
    <DashboardLayout activeTab="analytics">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Shopify Orders</h1>
            <p className="text-gray-600 mt-1">Track and manage your Shopify orders</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-6 bg-white rounded-lg shadow">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-600 text-sm">Total Orders</p>
                <p className="text-2xl font-bold">892</p>
                <p className="text-green-600 text-xs">+156 this week</p>
              </div>
            </div>
          </div>
          
          <div className="p-6 bg-white rounded-lg shadow">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-600 text-sm">Total Revenue</p>
                <p className="text-2xl font-bold">₹4,680,234</p>
                <p className="text-green-600 text-xs">+23% vs last month</p>
              </div>
            </div>
          </div>
          
          <div className="p-6 bg-white rounded-lg shadow">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-600 text-sm">Avg. Order Value</p>
                <p className="text-2xl font-bold">₹5,247</p>
                <p className="text-green-600 text-xs">+8% vs last month</p>
              </div>
            </div>
          </div>
          
          <div className="p-6 bg-white rounded-lg shadow">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-600 text-sm">Fulfillment Rate</p>
                <p className="text-2xl font-bold">94.2%</p>
                <p className="text-green-600 text-xs">+2.1% vs last month</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-4">Recent Orders</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Order ID</th>
                    <th className="text-left py-2">Customer</th>
                    <th className="text-left py-2">Date</th>
                    <th className="text-left py-2">Total</th>
                    <th className="text-left py-2">Status</th>
                    <th className="text-left py-2">Fulfillment</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-3 font-medium">#10234</td>
                    <td className="py-3">Rahul Sharma</td>
                    <td className="py-3">Dec 28, 2024</td>
                    <td className="py-3">₹8,999</td>
                    <td className="py-3"><span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">Completed</span></td>
                    <td className="py-3"><span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">Fulfilled</span></td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 font-medium">#10233</td>
                    <td className="py-3">Priya Patel</td>
                    <td className="py-3">Dec 28, 2024</td>
                    <td className="py-3">₹4,999</td>
                    <td className="py-3"><span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs">Processing</span></td>
                    <td className="py-3"><span className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs">Pending</span></td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 font-medium">#10232</td>
                    <td className="py-3">Amit Kumar</td>
                    <td className="py-3">Dec 27, 2024</td>
                    <td className="py-3">₹12,497</td>
                    <td className="py-3"><span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">Completed</span></td>
                    <td className="py-3"><span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">Fulfilled</span></td>
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
