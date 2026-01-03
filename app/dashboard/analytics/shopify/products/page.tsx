'use client';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';

export default function ShopifyProductsPage() {
  return (
    <DashboardLayout activeTab="analytics">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Shopify Products</h1>
            <p className="text-gray-600 mt-1">Analyze product performance and sales trends</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-6 bg-white rounded-lg shadow">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-600 text-sm">Total Products</p>
                <p className="text-2xl font-bold">234</p>
                <p className="text-green-600 text-xs">+12 this month</p>
              </div>
            </div>
          </div>
          
          <div className="p-6 bg-white rounded-lg shadow">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-600 text-sm">Products Sold</p>
                <p className="text-2xl font-bold">1,892</p>
                <p className="text-green-600 text-xs">+234 this week</p>
              </div>
            </div>
          </div>
          
          <div className="p-6 bg-white rounded-lg shadow">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-600 text-sm">Avg. Price</p>
                <p className="text-2xl font-bold">₹2,450</p>
                <p className="text-green-600 text-xs">+5% vs last month</p>
              </div>
            </div>
          </div>
          
          <div className="p-6 bg-white rounded-lg shadow">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-600 text-sm">Conversion Rate</p>
                <p className="text-2xl font-bold">3.2%</p>
                <p className="text-green-600 text-xs">+0.4% vs last month</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-4">Top Selling Products</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Product</th>
                    <th className="text-left py-2">SKU</th>
                    <th className="text-left py-2">Price</th>
                    <th className="text-left py-2">Units Sold</th>
                    <th className="text-left py-2">Revenue</th>
                    <th className="text-left py-2">Stock</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-3 font-medium">Premium Wireless Headphones</td>
                    <td className="py-3">WH-001</td>
                    <td className="py-3">₹4,999</td>
                    <td className="py-3">234</td>
                    <td className="py-3">₹1,169,766</td>
                    <td className="py-3"><span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">In Stock</span></td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 font-medium">Smart Watch Pro</td>
                    <td className="py-3">SW-002</td>
                    <td className="py-3">₹8,999</td>
                    <td className="py-3">156</td>
                    <td className="py-3">₹1,403,844</td>
                    <td className="py-3"><span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs">Low Stock</span></td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 font-medium">Bluetooth Speaker</td>
                    <td className="py-3">BS-003</td>
                    <td className="py-3">₹1,999</td>
                    <td className="py-3">445</td>
                    <td className="py-3">₹889,555</td>
                    <td className="py-3"><span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">In Stock</span></td>
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
