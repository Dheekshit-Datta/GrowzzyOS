// Mock data for GROWZZY OS dashboard
export interface Campaign {
  id: string;
  name: string;
  platform: 'meta' | 'google' | 'shopify' | 'linkedin';
  status: 'active' | 'paused' | 'completed';
  spend: number;
  revenue: number;
  roas: number;
  ctr: number;
  cpc: number;
  conversions: number;
  impressions: number;
  createdAt: string;
}

export interface MetricSnapshot {
  date: string;
  platform: string;
  spend: number;
  revenue: number;
  roas: number;
  ctr: number;
  conversions: number;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  status: 'new' | 'contacted' | 'qualified' | 'meeting' | 'closed';
  source: string;
  score: number;
  tags: string[];
  createdAt: string;
}

export interface ContentAsset {
  id: string;
  type: 'ad_copy' | 'creative_brief' | 'image';
  title: string;
  content: string;
  platform: string;
  status: 'draft' | 'published' | 'archived';
  performance: {
    likes: number;
    comments: number;
    shares: number;
    reach: number;
  };
  createdAt: string;
}

export interface Automation {
  id: string;
  name: string;
  trigger: string;
  condition: string;
  action: string;
  status: 'active' | 'paused' | 'completed';
  lastRun: string;
  nextRun: string;
}

export interface Report {
  id: string;
  title: string;
  type: 'daily' | 'weekly' | 'monthly';
  status: 'pending' | 'completed' | 'sent';
  generatedAt: string;
  metrics: {
    totalSpend: number;
    totalRevenue: number;
    blendedRoas: number;
    topCampaign: string;
    topPlatform: string;
  };
}

// Mock campaigns data
export const mockCampaigns: Campaign[] = [
  {
    id: '1',
    name: 'Diwali Mega Sale - Fashion',
    platform: 'meta',
    status: 'active',
    spend: 85000,
    revenue: 340000,
    roas: 4.0,
    ctr: 3.8,
    cpc: 18.5,
    conversions: 2156,
    impressions: 850000,
    createdAt: '2024-11-01',
  },
  {
    id: '2',
    name: 'Winter Collection Launch',
    platform: 'google',
    status: 'active',
    spend: 62000,
    revenue: 186000,
    roas: 3.0,
    ctr: 2.9,
    cpc: 22.0,
    conversions: 1420,
    impressions: 620000,
    createdAt: '2024-11-05',
  },
  {
    id: '3',
    name: 'New Year Fitness Challenge',
    platform: 'meta',
    status: 'active',
    spend: 48000,
    revenue: 144000,
    roas: 3.0,
    ctr: 3.2,
    cpc: 16.8,
    conversions: 1876,
    impressions: 480000,
    createdAt: '2024-12-01',
  },
  {
    id: '4',
    name: 'B2B Software Leads',
    platform: 'linkedin',
    status: 'active',
    spend: 35000,
    revenue: 105000,
    roas: 3.0,
    ctr: 2.1,
    cpc: 45.0,
    conversions: 412,
    impressions: 350000,
    createdAt: '2024-11-10',
  },
  {
    id: '5',
    name: 'Republic Day Special',
    platform: 'meta',
    status: 'paused',
    spend: 28000,
    revenue: 56000,
    roas: 2.0,
    ctr: 2.4,
    cpc: 19.5,
    conversions: 678,
    impressions: 280000,
    createdAt: '2024-01-15',
  },
  {
    id: '6',
    name: 'Skincare Bundle Offer',
    platform: 'shopify',
    status: 'active',
    spend: 42000,
    revenue: 126000,
    roas: 3.0,
    ctr: 1.8,
    cpc: 24.0,
    conversions: 892,
    impressions: 420000,
    createdAt: '2024-11-20',
  },
  {
    id: '7',
    name: 'Holi Colors Campaign',
    platform: 'meta',
    status: 'completed',
    spend: 18000,
    revenue: 72000,
    roas: 4.0,
    ctr: 4.2,
    cpc: 15.2,
    conversions: 845,
    impressions: 180000,
    createdAt: '2024-03-01',
  },
  {
    id: '8',
    name: 'Amazon Prime Day Prep',
    platform: 'google',
    status: 'active',
    spend: 55000,
    revenue: 165000,
    roas: 3.0,
    ctr: 2.7,
    cpc: 20.5,
    conversions: 1340,
    impressions: 550000,
    createdAt: '2024-07-01',
  },
];

// Mock metrics data
export const mockMetrics: MetricSnapshot[] = [
  { date: '2024-11-25', platform: 'Meta', spend: 8000, revenue: 32000, roas: 4.0, ctr: 3.2, conversions: 245 },
  { date: '2024-11-26', platform: 'Meta', spend: 7500, revenue: 30000, roas: 4.0, ctr: 3.1, conversions: 230 },
  { date: '2024-11-27', platform: 'Google', spend: 6000, revenue: 18000, roas: 3.0, ctr: 2.8, conversions: 178 },
  { date: '2024-11-28', platform: 'Google', spend: 6500, revenue: 19500, roas: 3.0, ctr: 2.9, conversions: 195 },
  { date: '2024-11-29', platform: 'LinkedIn', spend: 3000, revenue: 9000, roas: 3.0, ctr: 1.8, conversions: 45 },
  { date: '2024-11-30', platform: 'Shopify', spend: 2000, revenue: 4000, roas: 2.0, ctr: 1.5, conversions: 30 },
];

// Mock leads data
export const mockLeads: Lead[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john@example.com',
    phone: '+1-555-0101',
    company: 'TechFlow Inc',
    status: 'qualified',
    source: 'Meta Lead Form',
    score: 85,
    tags: ['high-value', 'enterprise'],
    createdAt: '2024-11-20',
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    phone: '+1-555-0102',
    company: 'Growth Labs',
    status: 'meeting',
    source: 'LinkedIn',
    score: 92,
    tags: ['vip', 'decision-maker'],
    createdAt: '2024-11-18',
  },
  {
    id: '3',
    name: 'Mike Chen',
    email: 'mike@example.com',
    phone: '+1-555-0103',
    company: 'Digital Ventures',
    status: 'contacted',
    source: 'Google Ads',
    score: 72,
    tags: ['mid-market'],
    createdAt: '2024-11-22',
  },
  {
    id: '4',
    name: 'Emma Wilson',
    email: 'emma@example.com',
    phone: '+1-555-0104',
    company: 'StartUp Co',
    status: 'new',
    source: 'Organic',
    score: 45,
    tags: ['startup'],
    createdAt: '2024-11-25',
  },
];

// Mock content assets
export const mockContentAssets: ContentAsset[] = [
  {
    id: '1',
    type: 'ad_copy',
    title: 'Black Friday Hero Copy',
    content: 'Transform your body in 90 days with our scientifically-formulated supplements. Join 10K+ happy customers. Use code SAVE20 for 20% off.',
    platform: 'meta',
    status: 'published',
    performance: { likes: 1250, comments: 89, shares: 234, reach: 45000 },
    createdAt: '2024-11-01',
  },
  {
    id: '2',
    type: 'creative_brief',
    title: 'Winter Collection Brief',
    content: 'Hook: Your competitors are getting ahead. Problem: Generic products don\'t work. Solution: Premium quality at affordable prices. CTA: Shop now.',
    platform: 'google',
    status: 'published',
    performance: { likes: 890, comments: 56, shares: 145, reach: 32000 },
    createdAt: '2024-11-05',
  },
  {
    id: '3',
    type: 'ad_copy',
    title: 'New Year Motivation',
    content: 'New year, new goals. Start your fitness journey with 50% off all products. Limited time offer!',
    platform: 'meta',
    status: 'draft',
    performance: { likes: 0, comments: 0, shares: 0, reach: 0 },
    createdAt: '2024-12-01',
  },
];

// Mock automations
export const mockAutomations: Automation[] = [
  {
    id: '1',
    name: 'Daily Ad Pause',
    trigger: 'Daily at 11:59 PM',
    condition: 'ROAS < 1.0 AND spend > ₹1,000',
    action: 'Pause ad set, send Slack alert',
    status: 'active',
    lastRun: '2024-11-25T23:59:00Z',
    nextRun: '2024-11-26T23:59:00Z',
  },
  {
    id: '2',
    name: 'Budget Reallocation',
    trigger: 'Daily at 6 AM',
    condition: 'Any campaign ROAS > 2.5x',
    action: 'Increase budget by 20%, notify user',
    status: 'active',
    lastRun: '2024-11-25T06:00:00Z',
    nextRun: '2024-11-26T06:00:00Z',
  },
  {
    id: '3',
    name: 'Weekly Report',
    trigger: 'Every Monday 9 AM',
    condition: 'Always',
    action: 'Generate PDF report, email to clients',
    status: 'active',
    lastRun: '2024-11-25T09:00:00Z',
    nextRun: '2024-12-02T09:00:00Z',
  },
];

// Mock reports
export const mockReports: Report[] = [
  {
    id: '1',
    title: 'Weekly Performance Report',
    type: 'weekly',
    status: 'completed',
    generatedAt: '2024-11-25T09:00:00Z',
    metrics: {
      totalSpend: 120000,
      totalRevenue: 360000,
      blendedRoas: 3.0,
      topCampaign: 'Black Friday Sale',
      topPlatform: 'Meta',
    },
  },
  {
    id: '2',
    title: 'Monthly Performance Report',
    type: 'monthly',
    status: 'completed',
    generatedAt: '2024-11-01T09:00:00Z',
    metrics: {
      totalSpend: 480000,
      totalRevenue: 1440000,
      blendedRoas: 3.0,
      topCampaign: 'Black Friday Sale',
      topPlatform: 'Meta',
    },
  },
];

// Calculate KPIs
export function calculateKPIs() {
  const totalSpend = mockCampaigns.reduce((sum, c) => sum + c.spend, 0);
  const totalRevenue = mockCampaigns.reduce((sum, c) => sum + c.revenue, 0);
  const totalConversions = mockCampaigns.reduce((sum, c) => sum + c.conversions, 0);
  const totalImpressions = mockCampaigns.reduce((sum, c) => sum + c.impressions, 0);
  const avgRoas = totalRevenue / totalSpend;
  const avgCtr = (mockCampaigns.reduce((sum, c) => sum + c.ctr, 0) / mockCampaigns.length).toFixed(2);
  const avgCpc = (mockCampaigns.reduce((sum, c) => sum + c.cpc, 0) / mockCampaigns.length).toFixed(2);

  return {
    totalSpend,
    totalRevenue,
    totalConversions,
    totalImpressions,
    avgRoas: avgRoas.toFixed(2),
    avgCtr,
    avgCpc,
    activeCampaigns: mockCampaigns.filter(c => c.status === 'active').length,
  };
}

// Get platform breakdown
export function getPlatformBreakdown() {
  const platforms = ['meta', 'google', 'linkedin', 'shopify'];
  return platforms.map(platform => {
    const campaigns = mockCampaigns.filter(c => c.platform === platform);
    const spend = campaigns.reduce((sum, c) => sum + c.spend, 0);
    const revenue = campaigns.reduce((sum, c) => sum + c.revenue, 0);
    return {
      platform: platform.charAt(0).toUpperCase() + platform.slice(1),
      spend,
      revenue,
      roas: spend > 0 ? (revenue / spend).toFixed(2) : 0,
      campaigns: campaigns.length,
    };
  });
}
