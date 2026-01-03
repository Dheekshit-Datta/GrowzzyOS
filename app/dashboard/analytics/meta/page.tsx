'use client';
import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ArrowLeft, TrendingUp, TrendingDown, Calendar } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function MetaAnalyticsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    setLoading(true);
    try {
      // Mock data for Meta analytics
      const mockData = {
        summary: {
          totalSpend: 127450,
          totalRevenue: 484310,
          avgRoas: 3.8,
          conversions: 678,
          ctr: 2.9,
          impressions: 234567,
          clicks: 6780
        },
        campaigns: [
          { id: 1, name: 'Black Friday Sale', status: 'active', spend: 45000, revenue: 180000, roas: 4.0, ctr: 3.2 },
          { id: 2, name: 'New Product Launch', status: 'active', spend: 32000, revenue: 112000, roas: 3.5, ctr: 2.8 },
          { id: 3, name: 'Retargeting Campaign', status: 'paused', spend: 28000, revenue: 84000, roas: 3.0, ctr: 2.5 },
          { id: 4, name: 'Brand Awareness', status: 'active', spend: 22450, revenue: 108310, roas: 4.8, ctr: 3.1 }
        ],
        dailyPerformance: Array.from({ length: 30 }, (_, i) => ({
          date: `Day ${i + 1}`,
          spend: Math.floor(Math.random() * 5000) + 2000,
          revenue: Math.floor(Math.random() * 20000) + 5000,
          conversions: Math.floor(Math.random() * 50) + 10,
        })),
        demographics: [
          { name: '18-24', value: 25 },
          { name: '25-34', value: 35 },
          { name: '35-44', value: 28 },
          { name: '45+', value: 12 }
        ],
        deviceBreakdown: [
          { name: 'Mobile', value: 65 },
          { name: 'Desktop', value: 30 },
          { name: 'Tablet', value: 5 }
        ]
      };
      setAnalyticsData(mockData);
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout activeTab="analytics">
        <div className="flex items-center justify-center h-64">
          <p>Loading analytics data...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (!analyticsData) {
    return (
      <DashboardLayout activeTab="analytics">
        <div className="flex items-center justify-center h-64">
          <p>No analytics data available</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout activeTab="analytics">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-bold">Meta Analytics</h1>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Calendar className="mr-2 h-4 w-4" />
              Last 30 Days
            </Button>
            <Button size="sm">Export</Button>
          </div>
        </div>

        <Tabs defaultValue="overview" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
            <TabsTrigger value="audience">Audience</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Spend</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    ${analyticsData.summary.totalSpend.toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    +12% from last month
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    ${analyticsData.summary.totalRevenue.toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    +18% from last month
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">ROAS</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {analyticsData.summary.avgRoas.toFixed(1)}x
                  </div>
                  <p className="text-xs text-muted-foreground">
                    +0.3 from last month
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Conversions</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {analyticsData.summary.conversions.toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    +24% from last month
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
