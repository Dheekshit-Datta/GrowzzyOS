import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export const runtime = 'edge';

// GET /api/reports -> fetch all reports
export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('reports')
      .select('*')
      .order('generated_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ reports: data });
  } catch (error: any) {
    console.error('Error fetching reports:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST /api/reports -> generate new report
export async function POST(request: NextRequest) {
  try {
    const { type, dateRange, platforms } = await request.json();
    
    if (!type || !dateRange) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Generate report metrics based on campaigns data
    const { data: campaigns, error: campaignsError } = await supabaseAdmin
      .from('campaigns')
      .select('*');

    if (campaignsError) throw campaignsError;

    const totalSpend = campaigns?.reduce((sum, c) => sum + (c.spend || 0), 0) || 0;
    const totalRevenue = campaigns?.reduce((sum, c) => sum + (c.revenue || 0), 0) || 0;
    const totalConversions = campaigns?.reduce((sum, c) => sum + (c.conversions || 0), 0) || 0;
    const blendedRoas = totalSpend > 0 ? totalRevenue / totalSpend : 0;
    const avgCTR = campaigns?.reduce((sum, c) => sum + (c.ctr || 0), 0) / (campaigns?.length || 1) || 0;
    const avgCPC = campaigns?.reduce((sum, c) => sum + (c.cpc || 0), 0) / (campaigns?.length || 1) || 0;
    
    const topCampaign = campaigns?.reduce((top, c) => 
      (c.revenue || 0) > (top?.revenue || 0) ? c : top, campaigns[0])?.name || '';
    
    const platformCounts = campaigns?.reduce((acc, c) => {
      acc[c.platform] = (acc[c.platform] || 0) + 1;
      return acc;
    }, {} as Record<string, number>) || {};
    
    const topPlatform = Object.entries(platformCounts)
      .sort(([,a], [,b]) => (b as number) - (a as number))[0]?.[0] || '';

    const metrics = {
      totalSpend,
      totalRevenue,
      blendedRoas,
      totalConversions,
      avgCTR,
      avgCPC,
      topCampaign,
      topPlatform,
    };

    const { data, error } = await supabaseAdmin
      .from('reports')
      .insert({
        title: `${type.charAt(0).toUpperCase() + type.slice(1)} Report - ${new Date().toLocaleDateString()}`,
        type,
        status: 'completed',
        metrics,
        generated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data, { status: 201 });
  } catch (error: any) {
    console.error('Error generating report:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Missing report ID' },
        { status: 400 }
      );
    }

    const { error } = await supabaseAdmin
      .from('reports')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting report:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
