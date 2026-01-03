'use client';
import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { 
  Linkedin, 
  Facebook, 
  Search as GoogleIcon, 
  ShoppingBag, 
  Check, 
  AlertCircle,
  ExternalLink 
} from 'lucide-react';

interface LinkedInUser {
  firstName: string;
  lastName: string;
  email: string;
  id: string;
}

interface MetaUser {
  id: string;
  name: string;
  email: string;
}

interface GoogleUser {
  id: string;
  name: string;
  email: string;
  picture: string;
}

interface ShopifyShop {
  id: string;
  name: string;
  domain: string;
  email: string;
}

export default function SettingsPage() {
  const [integrations, setIntegrations] = useState({
    meta: { 
      connected: false, 
      clientId: '', 
      clientSecret: '',
      user: null as MetaUser | null,
      connectedAt: null as string | null,
      adAccounts: [] as string[],
    },
    google: { 
      connected: false, 
      clientId: '', 
      clientSecret: '',
      user: null as GoogleUser | null,
      connectedAt: null as string | null,
      adsAccounts: [] as string[],
    },
    linkedin: { 
      connected: false, 
      clientId: '', 
      clientSecret: '',
      user: null as LinkedInUser | null,
      connectedAt: null as string | null,
    },
    shopify: { 
      connected: false, 
      apiKey: '',
      user: null as ShopifyShop | null,
      connectedAt: null as string | null,
      shop: null as string | null,
      productsCount: 0,
    },
  });

  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    reports: true,
    alerts: true,
  });

  const [apiKeys, setApiKeys] = useState({
    openai: '',
    meta: '',
    google: '',
  });

  useEffect(() => {
    // Load saved settings from localStorage or API
    const savedSettings = localStorage.getItem('growzzy-settings');
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      setIntegrations(parsed.integrations || integrations);
      setNotifications(parsed.notifications || notifications);
      setApiKeys(parsed.apiKeys || apiKeys);
    }
    
    // Handle OAuth callbacks
    const urlParams = new URLSearchParams(window.location.search);
    const success = urlParams.get('success');
    const error = urlParams.get('error');
    const data = urlParams.get('data');
    
    if (success && data) {
      try {
        const connectionData = JSON.parse(decodeURIComponent(data));
        const platform = connectionData.platform;
        
        if (platform) {
          setIntegrations(prev => ({
            ...prev,
            [platform]: { 
              ...prev[platform as keyof typeof prev], 
              connected: true,
              user: connectionData.user,
              connectedAt: connectionData.connectedAt,
              ...(connectionData.accessToken && { accessToken: connectionData.accessToken }),
              ...(connectionData.refreshToken && { refreshToken: connectionData.refreshToken }),
              ...(connectionData.adAccounts && { adAccounts: connectionData.adAccounts }),
              ...(connectionData.shop && { shop: connectionData.shop }),
              ...(connectionData.productsCount !== undefined && { productsCount: connectionData.productsCount }),
            }
          }));
          
          alert(`Successfully connected to ${platform.charAt(0).toUpperCase() + platform.slice(1)}!`);
          
          // Clean URL
          window.history.replaceState({}, document.title, '/dashboard/settings');
        }
      } catch (parseError) {
        console.error('Failed to parse connection data:', parseError);
        alert('Failed to process connection data');
      }
    }
    
    if (error) {
      const message = urlParams.get('message') || 'Authentication failed';
      alert(`Connection failed: ${message}`);
      
      // Clean URL
      window.history.replaceState({}, document.title, '/dashboard/settings');
    }
  }, []);

  const saveSettings = () => {
    if (typeof window === 'undefined') return;
    
    const settings = {
      integrations,
      notifications,
      apiKeys,
    };
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('growzzy-settings', JSON.stringify(settings));
    }
    if (typeof alert !== 'undefined') {
      alert('Settings saved successfully!');
    }
  };

  const handleIntegrationConnect = (platform: keyof typeof integrations) => {
    if (typeof window === 'undefined') return;
    
    const redirectUri = `${window.location.origin}/api/auth/${platform}`;
    
    if (platform === 'linkedin') {
      const clientId = process.env.NEXT_PUBLIC_LINKEDIN_CLIENT_ID || prompt(`Enter your ${platform} Client ID:`);
      if (clientId) {
        window.location.href = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=r_liteprofile%20r_emailaddress%20r_basicprofile`;
      }
    } else if (platform === 'meta') {
      const clientId = process.env.NEXT_PUBLIC_META_APP_ID || prompt(`Enter your ${platform} Client ID:`);
      if (clientId) {
        window.location.href = `https://www.facebook.com/v18.0/dialog/oauth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=ads_management,ads_read`;
      }
    } else if (platform === 'google') {
      const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || prompt(`Enter your ${platform} Client ID:`);
      if (clientId) {
        window.location.href = `https://accounts.google.com/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=https://www.googleapis.com/auth/adwords&response_type=code&access_type=offline`;
      }
    } else if (platform === 'shopify') {
      const shop = prompt(`Enter your Shopify store URL (e.g., your-store.myshopify.com):`);
      if (shop) {
        const clientId = process.env.NEXT_PUBLIC_SHOPIFY_API_KEY || prompt(`Enter your ${platform} API Key:`);
        if (clientId) {
          window.location.href = `https://${shop}/admin/oauth/authorize?client_id=${clientId}&scope=read_products,read_orders&redirect_uri=${encodeURIComponent(redirectUri)}`;
        }
      }
    }
  };

  const handleIntegrationDisconnect = (platform: keyof typeof integrations) => {
    setIntegrations(prev => ({
      ...prev,
      [platform]: { 
        ...prev[platform], 
        connected: false, 
        clientId: '', 
        clientSecret: '',
        user: null,
        connectedAt: null,
        ...(platform === 'meta' && { adAccounts: [] }),
        ...(platform === 'google' && { adsAccounts: [] }),
        ...(platform === 'shopify' && { shop: null, productsCount: 0 }),
      }
    }));
  };

  const handleApiKeyChange = (platform: keyof typeof apiKeys, value: string) => {
    setApiKeys(prev => ({
      ...prev,
      [platform]: value
    }));
  };

  return (
    <DashboardLayout activeTab="settings">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Settings</h1>
            <p className="text-gray-600 mt-1">Manage your integrations and preferences</p>
          </div>
          <Button onClick={saveSettings} className="bg-black hover:bg-gray-800 text-white">
            Save Settings
          </Button>
        </div>

        {/* Platform Integrations */}
        <Card>
          <CardHeader>
            <CardTitle>Platform Integrations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* LinkedIn */}
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-3">
                <Linkedin className="h-5 w-5 text-blue-700" />
                <div>
                  <h3 className="font-medium">LinkedIn</h3>
                  <p className="text-sm text-gray-500">Connect your LinkedIn ad account</p>
                  {integrations.linkedin.connected && (
                    <p className="text-xs text-green-600 mt-1">✓ Connected as {integrations.linkedin.user?.firstName} {integrations.linkedin.user?.lastName}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-3">
                {integrations.linkedin.connected ? (
                  <>
                    <span className="text-sm text-green-600">Connected</span>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleIntegrationDisconnect('linkedin')}
                    >
                      Disconnect
                    </Button>
                  </>
                ) : (
                  <Button 
                    variant="default" 
                    size="sm" 
                    onClick={() => handleIntegrationConnect('linkedin')}
                  >
                    Connect
                  </Button>
                )}
              </div>
            </div>

            {/* Meta */}
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-3">
                <Facebook className="h-5 w-5 text-blue-600" />
                <div>
                  <h3 className="font-medium">Meta Ads</h3>
                  <p className="text-sm text-gray-500">Connect your Facebook ad account</p>
                  {integrations.meta.connected && (
                    <p className="text-xs text-green-600 mt-1">✓ Connected as {integrations.meta.user?.name}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-3">
                {integrations.meta.connected ? (
                  <>
                    <span className="text-sm text-green-600">Connected</span>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleIntegrationDisconnect('meta')}
                    >
                      Disconnect
                    </Button>
                  </>
                ) : (
                  <Button 
                    variant="default" 
                    size="sm" 
                    onClick={() => handleIntegrationConnect('meta')}
                  >
                    Connect
                  </Button>
                )}
              </div>
            </div>

            {/* Google */}
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-3">
                <GoogleIcon className="h-5 w-5 text-red-600" />
                <div>
                  <h3 className="font-medium">Google Ads</h3>
                  <p className="text-sm text-gray-500">Connect your Google ad account</p>
                  {integrations.google.connected && (
                    <p className="text-xs text-green-600 mt-1">✓ Connected as {integrations.google.user?.name}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-3">
                {integrations.google.connected ? (
                  <>
                    <span className="text-sm text-green-600">Connected</span>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleIntegrationDisconnect('google')}
                    >
                      Disconnect
                    </Button>
                  </>
                ) : (
                  <Button 
                    variant="default" 
                    size="sm" 
                    onClick={() => handleIntegrationConnect('google')}
                  >
                    Connect
                  </Button>
                )}
              </div>
            </div>

            {/* Shopify */}
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-3">
                <ShoppingBag className="h-5 w-5 text-green-600" />
                <div>
                  <h3 className="font-medium">Shopify</h3>
                  <p className="text-sm text-gray-500">Connect your Shopify store</p>
                  {integrations.shopify.connected && (
                    <p className="text-xs text-green-600 mt-1">✓ Connected to {integrations.shopify.shop}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-3">
                {integrations.shopify.connected ? (
                  <>
                    <span className="text-sm text-green-600">Connected</span>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleIntegrationDisconnect('shopify')}
                    >
                      Disconnect
                    </Button>
                  </>
                ) : (
                  <Button 
                    variant="default" 
                    size="sm" 
                    onClick={() => handleIntegrationConnect('shopify')}
                  >
                    Connect
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* API Keys */}
        <Card>
          <CardHeader>
            <CardTitle>API Keys</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium">OpenAI API Key</label>
              <input
                type="password"
                value={apiKeys.openai}
                onChange={(e) => handleApiKeyChange('openai', e.target.value)}
                className="w-full p-2 border rounded-md"
                placeholder="sk-..."
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium">Meta API Key</label>
              <input
                type="password"
                value={apiKeys.meta}
                onChange={(e) => handleApiKeyChange('meta', e.target.value)}
                className="w-full p-2 border rounded-md"
                placeholder="Enter Meta API key"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium">Google API Key</label>
              <input
                type="password"
                value={apiKeys.google}
                onChange={(e) => handleApiKeyChange('google', e.target.value)}
                className="w-full p-2 border rounded-md"
                placeholder="Enter Google API key"
              />
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium">Email Notifications</label>
                <Switch
                  checked={notifications.email}
                  onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, email: checked }))}
                />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium">Push Notifications</label>
                <Switch
                  checked={notifications.push}
                  onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, push: checked }))}
                />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium">Weekly Reports</label>
                <Switch
                  checked={notifications.reports}
                  onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, reports: checked }))}
                />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium">Real-time Alerts</label>
                <Switch
                  checked={notifications.alerts}
                  onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, alerts: checked }))}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Help Section */}
        <Card>
          <CardHeader>
            <CardTitle>LinkedIn Integration Help</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 border rounded-lg bg-blue-50">
              <div className="flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium">Fixing Redirect URI Error</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    The redirect URI in your LinkedIn app must exactly match: <code className="bg-gray-100 px-2 py-1 rounded">{window.location.origin}/api/auth/linkedin</code>
                  </p>
                  <div className="mt-3 space-y-2">
                    <div className="text-xs text-gray-500">
                      <strong>Steps to fix:</strong>
                    </div>
                    <div className="text-xs text-gray-500 space-y-1">
                      1. Go to LinkedIn Developer Dashboard
                    </div>
                    <div className="text-xs text-gray-500">
                      2. Find your app settings
                    </div>
                    <div className="text-xs text-gray-500">
                      3. Update "OAuth 2.0 Redirect URLs" to add: <code className="bg-gray-100 px-2 py-1 rounded">{window.location.origin}/api/auth/linkedin</code>
                    </div>
                    <div className="text-xs text-gray-500">
                      4. Save changes and wait a few minutes for them to take effect
                    </div>
                    <div className="text-xs text-gray-500">
                      5. Try connecting again
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
