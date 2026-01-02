'use client';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';

export default function GoogleAnalyticsPage() {
  return (
    <DashboardLayout activeTab='analytics'>
      <div className='space-y-6'>
        <div className='flex justify-between items-center'>
          <div>
            <h1 className='text-3xl font-bold'>Google Ads Analytics</h1>
            <p className='text-gray-600 mt-1'>Monitor your Google Ads performance and campaigns</p>
          </div>
        </div>
        
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
          <div className='p-6 bg-white rounded-lg shadow'>
            <div className='flex justify-between items-start'>
              <div>
                <p className='text-gray-600 text-sm'>Total Spend</p>
                <p className='text-2xl font-bold'>,340</p>
              </div>
            </div>
          </div>
          
          <div className='p-6 bg-white rounded-lg shadow'>
            <div className='flex justify-between items-start'>
              <div>
                <p className='text-gray-600 text-sm'>Conversions</p>
                <p className='text-2xl font-bold'>456</p>
              </div>
            </div>
          </div>
          
          <div className='p-6 bg-white rounded-lg shadow'>
            <div className='flex justify-between items-start'>
              <div>
                <p className='text-gray-600 text-sm'>CTR</p>
                <p className='text-2xl font-bold'>3.2%</p>
              </div>
            </div>
          </div>
          
          <div className='p-6 bg-white rounded-lg shadow'>
            <div className='flex justify-between items-start'>
              <div>
                <p className='text-gray-600 text-sm'>ROAS</p>
                <p className='text-2xl font-bold'>4.1x</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
