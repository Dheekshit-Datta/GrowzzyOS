'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Check, AlertCircle, Loader2, Shield, Zap } from 'lucide-react';

interface Platform {
  id: string;
  name: string;
  icon: string;
  status: 'connected' | 'not_connected' | 'connecting' | 'error';
  permissions?: string[];
  lastConnected?: string;
}

interface ConnectionManagerProps {
  platforms: Platform[];
  onConnect: (platformId: string) => Promise<void>;
  onDisconnect: (platformId: string) => Promise<void>;
}

export function ConnectionManager({ platforms, onConnect, onDisconnect }: ConnectionManagerProps) {
  const [connectingPlatform, setConnectingPlatform] = useState<string | null>(null);
  const [showPermissions, setShowPermissions] = useState<string | null>(null);

  const handleConnect = async (platformId: string) => {
    setConnectingPlatform(platformId);
    try {
      setShowPermissions(platformId);
    } catch (error) {
      console.error('Connection failed:', error);
      setConnectingPlatform(null);
    }
  };

  const handlePermissionAccept = async (platformId: string) => {
    setConnectingPlatform(platformId);
    setShowPermissions(null);
    
    try {
      if (platformId === 'meta') {
        const metaAppId = process.env.NEXT_PUBLIC_META_APP_ID || 'your-meta-app-id';
        const redirectUri = encodeURIComponent(window.location.origin + '/auth/meta/callback');
        const scope = encodeURIComponent('ads_management,pages_show_list,instagram_basic');
        
        const authUrl = 'https://www.facebook.com/v18.0/dialog/oauth?client_id=' + metaAppId + '&redirect_uri=' + redirectUri + '&scope=' + scope + '&response_type=code';
        
        const popup = window.open(authUrl, 'meta-auth', 'width=600,height=700,scrollbars=yes,resizable=yes');
        
        const checkClosed = setInterval(() => {
          if (popup?.closed) {
            clearInterval(checkClosed);
            setConnectingPlatform(null);
          }
        }, 1000);
        
        return;
      } else if (platformId === 'linkedin') {
        const linkedinClientId = process.env.NEXT_PUBLIC_LINKEDIN_CLIENT_ID || 'your-linkedin-client-id';
        const redirectUri = encodeURIComponent(window.location.origin + '/auth/linkedin/callback');
        const scope = encodeURIComponent('r_organization_social,w_organization_social,rw_ads,r_ads_reporting');
        
        const authUrl = 'https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=' + linkedinClientId + '&redirect_uri=' + redirectUri + '&scope=' + scope;
        
        const popup = window.open(authUrl, 'linkedin-auth', 'width=600,height=700,scrollbars=yes,resizable=yes');
        
        const checkClosed = setInterval(() => {
          if (popup?.closed) {
            clearInterval(checkClosed);
            setConnectingPlatform(null);
          }
        }, 1000);
        
        return;
      } else if (platformId === 'shopify') {
        const shopifyApiKey = process.env.NEXT_PUBLIC_SHOPIFY_API_KEY || 'your-shopify-api-key';
        const redirectUri = encodeURIComponent(window.location.origin + '/auth/shopify/callback');
        const scope = encodeURIComponent('read_products,write_products,read_orders,read_customers');
        const shopName = prompt('Enter your Shopify store name (e.g., your-store)');
        
        if (!shopName) {
          setConnectingPlatform(null);
          return;
        }
        
        const authUrl = 'https://' + shopName + '.myshopify.com/admin/oauth/authorize?client_id=' + shopifyApiKey + '&redirect_uri=' + redirectUri + '&scope=' + scope + '&response_type=code';
        
        const popup = window.open(authUrl, 'shopify-auth', 'width=600,height=700,scrollbars=yes,resizable=yes');
        
        const checkClosed = setInterval(() => {
          if (popup?.closed) {
            clearInterval(checkClosed);
            setConnectingPlatform(null);
          }
        }, 1000);
        
        return;
      } else if (platformId === 'google') {
        const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || 'your-google-client-id';
        const redirectUri = encodeURIComponent(window.location.origin + '/auth/google/callback');
        const scope = encodeURIComponent('https://www.googleapis.com/auth/adwords https://www.googleapis.com/auth/analytics.readonly https://www.googleapis.com/auth/youtube.readonly');
        
        const authUrl = 'https://accounts.google.com/o/oauth2/v2/auth?client_id=' + googleClientId + '&redirect_uri=' + redirectUri + '&scope=' + scope + '&response_type=code&access_type=offline&prompt=consent';
        
        const popup = window.open(authUrl, 'google-auth', 'width=600,height=700,scrollbars=yes,resizable=yes');
        
        const checkClosed = setInterval(() => {
          if (popup?.closed) {
            clearInterval(checkClosed);
            setConnectingPlatform(null);
          }
        }, 1000);
        
        return;
      }
      
      await onConnect(platformId);
    } catch (error) {
      console.error('Connection failed:', error);
    } finally {
      if (platformId !== 'meta' && platformId !== 'linkedin' && platformId !== 'shopify' && platformId !== 'google') {
        setConnectingPlatform(null);
      }
    }
  };

  const handleDisconnect = async (platformId: string) => {
    try {
      await onDisconnect(platformId);
    } catch (error) {
      console.error('Disconnection failed:', error);
    }
  };

  const getStatusIcon = (status: Platform['status']) => {
    switch (status) {
      case 'connected':
        return <Check className='w-4 h-4 text-green-600' />;
      case 'connecting':
        return <Loader2 className='w-4 h-4 text-blue-600 animate-spin' />;
      case 'error':
        return <AlertCircle className='w-4 h-4 text-red-600' />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: Platform['status']) => {
    switch (status) {
      case 'connected':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'connecting':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const getPlatformPermissions = (platformId: string) => {
    const platform = platforms.find(p => p.id === platformId);
    return platform?.permissions || [];
  };

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h3 className='text-lg font-semibold'>Platform Connections</h3>
          <p className='text-sm text-gray-600'>Connect your marketing platforms to sync data</p>
        </div>
        <div className='flex items-center space-x-2'>
          <Shield className='w-4 h-4 text-gray-500' />
          <span className='text-sm text-gray-500'>Secure OAuth 2.0</span>
        </div>
      </div>

      <div className='grid gap-4'>
        {platforms.map((platform) => (
          <Card key={platform.id} className='p-6'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center space-x-4'>
                <div className='text-2xl'>{platform.icon}</div>
                <div>
                  <h4 className='font-medium'>{platform.name}</h4>
                  <div className='flex items-center space-x-2 mt-1'>
                    <span className={'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ' + getStatusColor(platform.status)}>
                      {getStatusIcon(platform.status)}
                      <span className='ml-1'>
                        {platform.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </span>
                    {platform.lastConnected && platform.status === 'connected' && (
                      <span className='text-xs text-gray-500'>
                        Connected {platform.lastConnected}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className='flex items-center space-x-2'>
                {platform.status === 'connected' ? (
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => handleDisconnect(platform.id)}
                    disabled={connectingPlatform === platform.id}
                  >
                    {connectingPlatform === platform.id ? (
                      <Loader2 className='w-4 h-4 animate-spin mr-2' />
                    ) : null}
                    Disconnect
                  </Button>
                ) : (
                  <Button
                    size='sm'
                    onClick={() => handleConnect(platform.id)}
                    disabled={connectingPlatform === platform.id}
                  >
                    {connectingPlatform === platform.id ? (
                      <Loader2 className='w-4 h-4 animate-spin mr-2' />
                    ) : (
                      <Zap className='w-4 h-4 mr-2' />
                    )}
                    Connect
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {showPermissions && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
          <div className='bg-white rounded-lg p-6 max-w-md w-full mx-4'>
            <h3 className='text-lg font-semibold mb-4'>Required Permissions</h3>
            <p className='text-gray-600 mb-4'>
              To connect to {platforms.find(p => p.id === showPermissions)?.name}, we need the following permissions:
            </p>
            <ul className='space-y-2 mb-6'>
              {getPlatformPermissions(showPermissions).map((permission, index) => (
                <li key={index} className='flex items-center text-sm'>
                  <Check className='w-4 h-4 text-green-600 mr-2' />
                  {permission.replace(/_/g, ' ').toUpperCase()}
                </li>
              ))}
            </ul>
            <div className='flex space-x-3'>
              <Button
                onClick={() => handlePermissionAccept(showPermissions)}
                className='flex-1'
              >
                Accept & Connect
              </Button>
              <Button
                variant='outline'
                onClick={() => {
                  setShowPermissions(null);
                  setConnectingPlatform(null);
                }}
                className='flex-1'
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
