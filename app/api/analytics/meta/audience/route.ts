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

    // Mock audience data (in production, would fetch from Meta API)
    const audienceData = {
      demographics: {
        age: {
          '18-24': 15,
          '25-34': 35,
          '35-44': 25,
          '45-54': 15,
          '55+': 10
        },
        gender: {
          'male': 45,
          'female': 52,
          'other': 3
        },
        location: {
          'Mumbai': 22,
          'Delhi': 18,
          'Bangalore': 15,
          'Chennai': 12,
          'Kolkata': 8,
          'Others': 25
        }
      },
      device: {
        'mobile': 65,
        'desktop': 30,
        'tablet': 5
      },
      topAudiences: [
        { name: 'E-commerce Shoppers', size: 125000, ctr: 2.4, conversions: 890 },
        { name: 'Tech Professionals', size: 98000, ctr: 3.1, conversions: 654 },
        { name: 'Fashion Enthusiasts', size: 156000, ctr: 2.8, conversions: 723 },
        { name: 'Business Owners', size: 76000, ctr: 1.9, conversions: 432 },
        { name: 'Students', size: 234000, ctr: 1.6, conversions: 567 }
      ],
      interests: [
        { name: 'Shopping', reach: 450000, frequency: 3.2 },
        { name: 'Technology', reach: 380000, frequency: 2.8 },
        { name: 'Fashion', reach: 520000, frequency: 3.5 },
        { name: 'Business', reach: 290000, frequency: 2.1 },
        { name: 'Education', reach: 340000, frequency: 2.6 }
      ],
      behavior: {
        'Engaged Shoppers': 28,
        'Frequent Travelers': 15,
        'Early Adopters': 22,
        'Brand Loyal': 18,
        'Price Conscious': 17
      }
    };

    // Calculate some metrics
    const totalReach = Object.values(audienceData.demographics.age).reduce((sum, val) => sum + val, 0) * 10000;
    const avgCTR = audienceData.topAudiences.reduce((sum, aud) => sum + aud.ctr, 0) / audienceData.topAudiences.length;

    return NextResponse.json({
      success: true,
      data: {
        summary: {
          totalReach,
          avgCTR: avgCTR.toFixed(2),
          topAudience: audienceData.topAudiences[0].name,
          bestDevice: 'mobile'
        },
        ...audienceData
      }
    });

  } catch (error: any) {
    console.error('Meta audience API error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch Meta audience data' },
      { status: 500 }
    );
  }
}
