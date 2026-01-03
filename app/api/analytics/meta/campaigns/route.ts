import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const dateRange = searchParams.get('dateRange') || 'last30days';
    
    // Calculate date range
    const now = new Date();
    let startDate: Date;
    
    switch (dateRange) {
      case 'last7days':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'last30days':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case 'last90days':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    // Fetch Meta campaigns from database
    const { data: campaigns, error: campaignsError } = await supabaseAdmin
      .from('campaigns')
      .select('*')
      .eq('platform', 'meta')
      .gte('created_at', startDate.toISOString())
      .lte('created_at', now.toISOString())
      .order('created_at', { ascending: false });

    if (campaignsError) throw campaignsError;

    // Calculate metrics
    const activeCampaigns = campaigns?.filter(c => c.status === 'active').length || 0;
    const totalSpend = campaigns?.reduce((sum, c) => sum + (c.spend || 0), 0) || 0;
    const totalConversions = campaigns?.reduce((sum, c) => sum + (c.conversions || 0), 0) || 0;
    const totalRevenue = campaigns?.reduce((sum, c) => sum + (c.revenue || 0), 0) || 0;
    const avgROAS = totalSpend > 0 ? (totalRevenue / totalSpend).toFixed(2) : '0';

    // Format campaign data for display
    const formattedCampaigns = campaigns?.map(campaign => ({
      id: campaign.id,
      name: campaign.name,
      status: campaign.status || 'unknown',
      spend: campaign.spend || 0,
      conversions: campaign.conversions || 0,
      revenue: campaign.revenue || 0,
      roas: campaign.spend > 0 ? ((campaign.revenue || 0) / campaign.spend).toFixed(2) : '0',
      ctr: campaign.ctr || 0,
      cpc: campaign.cpc || 0,
      created_at: campaign.created_at
    })) || [];

    // Calculate trends (mock for now, would compare with previous period)
    const trends = {
      activeCampaignsChange: '+3 this week',
      spendChange: '+12% vs last month',
      conversionsChange: '+8% vs last month',
      roasChange: '+0.4 vs last month'
    };

    return NextResponse.json({
      success: true,
      data: {
        summary: {
          activeCampaigns,
          totalSpend,
          totalConversions,
          avgROAS: parseFloat(avgROAS),
          trends
        },
        campaigns: formattedCampaigns
      }
    });

  } catch (error: any) {
    console.error('Meta campaigns API error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch Meta campaigns' },
      { status: 500 }
    );
  }
}
