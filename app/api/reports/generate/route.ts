import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function POST(request: NextRequest) {
  try {
    const { dateRange, sections, userId } = await request.json();
    
    // Fetch campaigns data
    const { data: campaigns, error: campaignsError } = await supabaseAdmin
      .from('campaigns')
      .select('*')
      .gte('created_at', dateRange.start)
      .lte('created_at', dateRange.end)
      .order('created_at', { ascending: false });

    if (campaignsError) throw campaignsError;

    // Calculate KPIs
    const totalSpend = campaigns?.reduce((sum, c) => sum + (c.spend || 0), 0) || 0;
    const totalRevenue = campaigns?.reduce((sum, c) => sum + (c.revenue || 0), 0) || 0;
    const totalConversions = campaigns?.reduce((sum, c) => sum + (c.conversions || 0), 0) || 0;
    const roas = totalSpend > 0 ? (totalRevenue / totalSpend).toFixed(2) : '0';

    // Platform breakdown
    const platformData = campaigns?.reduce((acc: any, campaign) => {
      const platform = campaign.platform || 'Unknown';
      if (!acc[platform]) {
        acc[platform] = { platform, spend: 0, revenue: 0, campaigns: 0 };
      }
      acc[platform].spend += campaign.spend || 0;
      acc[platform].revenue += campaign.revenue || 0;
      acc[platform].campaigns += 1;
      return acc;
    }, {}) || {};

    const platformBreakdown = Object.values(platformData).map((platform: any) => ({
      ...platform,
      roas: platform.spend > 0 ? (platform.revenue / platform.spend).toFixed(2) : '0'
    }));

    // Generate executive summary
    const topPerformers = campaigns
      ?.filter(c => c.roas > 2)
      .sort((a, b) => b.roas - a.roas)
      .slice(0, 3) || [];

    const underPerformers = campaigns
      ?.filter(c => c.roas < 1 && c.spend > 1000)
      .sort((a, b) => a.roas - b.roas)
      .slice(0, 3) || [];

    const executiveSummary = {
      wins: [
        `Total ROAS of ${roas}x across all platforms`,
        `${topPerformers.length} campaigns performing above 2x ROAS`,
        `Generated ₹${totalRevenue.toLocaleString()} in revenue`
      ],
      concerns: [
        underPerformers.length > 0 ? `${underPerformers.length} campaigns underperforming` : 'No major concerns',
        totalSpend > totalRevenue ? 'Total spend exceeds revenue' : 'Budget optimization possible',
        campaigns && campaigns.length > 0 ? `${Math.round((campaigns.filter(c => c.status === 'active').length / campaigns.length) * 100)}% of campaigns active` : 'Low campaign activity'
      ]
    };

    // AI Insights (mock for now, can be enhanced with OpenAI)
    const aiInsights = [
      `Focus on optimizing ${underPerformers[0]?.name || 'underperforming'} campaigns for better ROAS`,
      `Consider increasing budget for ${topPerformers[0]?.name || 'top performing'} campaigns`,
      `${platformBreakdown[0]?.platform || 'Meta'} platform shows highest potential for growth`,
      'Implement A/B testing on ad creatives to improve CTR',
      'Review and optimize targeting parameters for better conversion rates'
    ];

    const reportData = {
      title: 'Marketing Performance Report',
      dateRange: `${dateRange.start} to ${dateRange.end}`,
      executiveSummary,
      kpi: {
        totalSpend,
        totalRevenue,
        roas: parseFloat(roas),
        conversions: totalConversions
      },
      campaigns: campaigns?.map(c => ({
        name: c.name,
        platform: c.platform,
        spend: c.spend || 0,
        revenue: c.revenue || 0,
        roas: c.roas || 0,
        conversions: c.conversions || 0,
        status: c.status || 'unknown'
      })) || [],
      platformBreakdown,
      aiInsights
    };

    // Generate PDF (would need jsPDF package)
    // For now, return the data that would be used to generate PDF
    return NextResponse.json({
      success: true,
      data: reportData,
      message: 'Report data generated successfully. PDF generation requires jsPDF package.'
    });

  } catch (error: any) {
    console.error('Report generation error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate report' },
      { status: 500 }
    );
  }
}
