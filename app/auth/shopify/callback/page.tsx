'use client';
import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default function ShopifyAuthCallback() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ShopifyAuthCallbackContent />
    </Suspense>
  );
}

function ShopifyAuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    const code = searchParams.get('code');
    const error = searchParams.get('error');
    const shop = searchParams.get('shop');

    if (error) {
      setStatus('error');
      setTimeout(() => {
        router.push('/dashboard/settings?tab=integrations&error=shopify_auth_failed');
      }, 2000);
      return;
    }

    if (code && shop) {
      setStatus('success');
      setTimeout(() => {
        router.push('/dashboard/settings?tab=integrations&success=shopify_connected');
      }, 2000);
    }
  }, [searchParams, router]);

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50'>
      <div className='text-center'>
        {status === 'loading' && (
          <div>
            <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4'></div>
            <h2 className='text-xl font-semibold mb-2'>Connecting to Shopify...</h2>
            <p className='text-gray-600'>Please wait while we authenticate your store.</p>
          </div>
        )}
        {status === 'success' && (
          <div>
            <div className='w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4'>
              <svg className='w-6 h-6 text-green-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M5 13l4 4L19 7'></path>
              </svg>
            </div>
            <h2 className='text-xl font-semibold mb-2 text-green-600'>Successfully Connected!</h2>
            <p className='text-gray-600'>Your Shopify store has been connected.</p>
          </div>
        )}
        {status === 'error' && (
          <div>
            <div className='w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4'>
              <svg className='w-6 h-6 text-red-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M6 18L18 6M6 6l12 12'></path>
              </svg>
            </div>
            <h2 className='text-xl font-semibold mb-2 text-red-600'>Connection Failed</h2>
            <p className='text-gray-600'>There was an error connecting to Shopify.</p>
          </div>
        )}
      </div>
    </div>
  );
}
