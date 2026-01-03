'use client';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';

export default function ShopifyAnalyticsPage() {
  return (
    <DashboardLayout activeTab='analytics'>
      <div className='space-y-6'>
        <div className='flex justify-between items-center'>
          <div>
            <h1 className='text-3xl font-bold'>Shopify Analytics</h1>
            <p className='text-gray-600 mt-1'>Monitor your Shopify store performance and sales</p>
          </div>
        </div>
        
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
          <div className='p-6 bg-white rounded-lg shadow'>
            <div className='flex justify-between items-start'>
              <div>
                <p className='text-gray-600 text-sm'>Total Revenue</p>
                <p className='text-2xl font-bold'>,680</p>
              </div>
            </div>
          </div>
          
          <div className='p-6 bg-white rounded-lg shadow'>
            <div className='flex justify-between items-start'>
              <div>
                <p className='text-gray-600 text-sm'>Orders</p>
                <p className='text-2xl font-bold'>892</p>
              </div>
            </div>
          </div>
          
          <div className='p-6 bg-white rounded-lg shadow'>
            <div className='flex justify-between items-start'>
              <div>
                <p className='text-gray-600 text-sm'>AOV</p>
                <p className='text-2xl font-bold'>.20</p>
              </div>
            </div>
          </div>
          
          <div className='p-6 bg-white rounded-lg shadow'>
            <div className='flex justify-between items-start'>
              <div>
                <p className='text-gray-600 text-sm'>Conversion Rate</p>
                <p className='text-2xl font-bold'>3.4%</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
