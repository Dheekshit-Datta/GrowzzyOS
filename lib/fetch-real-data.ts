import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

type Campaign = {
  id: string;
  name: string;
  platform: 'meta' | 'google' | 'tiktok' | 'linkedin' | 'shopify';
  status: 'active' | 'paused' | 'archived' | 'completed';
  spend: number;
  impressions: number;
  clicks: number;
  ctr: number;
  cpc: number;
  roas?: number;
  start_date: string;
  end_date?: string;
};

export async function fetchRealCampaignData(userId: string): Promise<Campaign[]> {
  try {
    // Get user's connected platforms
    const { data: credentials, error: credentialsError } = await supabase
      .from('platform_credentials')
      .select('*')
      .eq('user_id', userId);

    if (credentialsError) {
      console.error('Error fetching credentials:', credentialsError);
      throw credentialsError;
    }

    const allCampaigns: Campaign[] = [];

    // Process each connected platform
    for (const cred of credentials) {
      try {
        if (cred.platform === 'meta' && cred.access_token) {
          const metaCampaigns = await fetchMetaCampaigns(cred.access_token);
          allCampaigns.push(...metaCampaigns);
        } 
        else if (cred.platform === 'google' && cred.access_token) {
          const googleCampaigns = await fetchGoogleCampaigns(cred.access_token);
          allCampaigns.push(...googleCampaigns);
        }
      } catch (error) {
        console.error(`Error fetching ${cred.platform} campaigns:`, error);
        // Continue with other platforms even if one fails
        continue;
      }
    }

    return allCampaigns;
  } catch (error) {
    console.error('Error in fetchRealCampaignData:', error);
    throw error;
  }
}

async function fetchMetaCampaigns(accessToken: string): Promise<Campaign[]> {
  try {
    // First, get the ad account ID
    const accountsRes = await fetch(
      `https://graph.facebook.com/v19.0/me/adaccounts?access_token=${accessToken}`
    );
    
    if (!accountsRes.ok) {
      throw new Error(`Facebook API error: ${await accountsRes.text()}`);
    }
    
    const accountsData = await accountsRes.json();
    
    if (!accountsData.data || accountsData.data.length === 0) {
      return [];
    }
    
    const adAccountId = accountsData.data[0].id;
    
    // Get campaigns with insights
    const campaignsRes = await fetch(
      `https://graph.facebook.com/v19.0/${adAccountId}/campaigns?` +
      `fields=id,name,status,objective,start_time,stop_time,insights{spend,impressions,clicks,ctr,cpc,actions}` +
      `&access_token=${accessToken}`
    );
    
    if (!campaignsRes.ok) {
      throw new Error(`Facebook API error: ${await campaignsRes.text()}`);
    }
    
    const campaignsData = await campaignsRes.json();
    
    if (!campaignsData.data) {
      return [];
    }
    
    // Transform the data to match our Campaign type
    return campaignsData.data.map((campaign: any) => {
      const insights = campaign.insights?.data?.[0] || {};
      const purchaseActions = insights.actions?.find((a: any) => a.action_type === 'purchase');
      
      return {
        id: `meta_${campaign.id}`,
        name: campaign.name,
        platform: 'meta' as const,
        status: mapStatus(campaign.status),
        spend: parseFloat(insights.spend || 0),
        impressions: parseInt(insights.impressions || 0),
        clicks: parseInt(insights.clicks || 0),
        ctr: parseFloat(insights.ctr || 0),
        cpc: parseFloat(insights.cpc || 0),
        roas: purchaseActions ? parseFloat(purchaseActions.value) / parseFloat(insights.spend || 1) : undefined,
        start_date: campaign.start_time,
        end_date: campaign.stop_time || undefined,
      };
    });
    
  } catch (error) {
    console.error('Error in fetchMetaCampaigns:', error);
    throw error;
  }
}

async function fetchGoogleCampaigns(accessToken: string): Promise<Campaign[]> {
  // Google Ads API implementation would go here
  // This is a simplified example - the actual implementation would use the Google Ads API
  // and handle OAuth and pagination properly
  
  // For now, return an empty array as a placeholder
  return [];
}

function mapStatus(status: string): Campaign['status'] {
  const statusMap: Record<string, Campaign['status']> = {
    'ACTIVE': 'active',
    'PAUSED': 'paused',
    'ARCHIVED': 'archived',
    'DELETED': 'archived',
    'COMPLETED': 'completed',
  };
  
  return statusMap[status] || 'paused';
}

// Utility function to refresh access tokens
export async function refreshAccessToken(platform: string, refreshToken: string) {
  // Implementation depends on the OAuth provider
  // This is a placeholder that would be implemented based on the platform
  try {
    if (platform === 'meta') {
      // Meta token refresh implementation
    } else if (platform === 'google') {
      // Google token refresh implementation
    }
  } catch (error) {
    console.error(`Error refreshing ${platform} token:`, error);
    throw error;
  }
}
