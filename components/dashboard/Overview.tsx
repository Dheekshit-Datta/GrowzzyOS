"use client";

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  BarChart2, 
  TrendingUp, 
  Zap, 
  MessageSquare,
  Search,
  Filter,
  ChevronDown,
  MoreHorizontal,
  AlertCircle,
  CheckCircle2,
  Clock,
  XCircle
} from "lucide-react"
import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  ChartTooltip,
  Legend,
  ArcElement
);

// Sample data for charts
const roasData = [
  { name: 'Jan 1', meta: 2.1, google: 1.5 },
  { name: 'Jan 8', meta: 2.4, google: 1.7 },
  { name: 'Jan 15', meta: 2.8, google: 1.9 },
  { name: 'Jan 22', meta: 2.6, google: 2.1 },
  { name: 'Jan 29', meta: 3.1, google: 1.8 },
];

const platformSpendData = [
  { name: 'Meta', value: 60, color: '#3B82F6' },
  { name: 'Google', value: 30, color: '#F97316' },
  { name: 'LinkedIn', value: 10, color: '#8B5CF6' },
];

const platformRoasData = [
  { name: 'Meta', roas: 2.8, color: '#10B981' },
  { name: 'Google', roas: 1.9, color: '#F59E0B' },
  { name: 'LinkedIn', roas: 1.5, color: '#EF4444' },
];

export function Overview() {
  // KPI data with calculations as per requirements
  const kpiData = [
    {
      title: "ROAS",
      value: "2.4x",
      change: "+15%",
      trend: "up",
      description: "vs last period"
    },
    {
      title: "CTR",
      value: "3.2%",
      change: "-8%",
      trend: "down",
      description: "vs last period"
    },
    {
      title: "CPC",
      value: "₹25.50",
      change: "+5%",
      trend: "up",
      description: "vs last period"
    },
    {
      title: "Spend",
      value: "₹2,50,000",
      change: "+22%",
      trend: "up",
      description: "vs last period"
    }
  ];

  const campaigns = [
    {
      id: 1,
      name: "Black Friday",
      platform: "Meta",
      spend: "₹80,000",
      roas: 3.8,
      ctr: 4.2,
      status: "active"
    },
    {
      id: 2,
      name: "New Customer",
      platform: "Google",
      spend: "₹60,000",
      roas: 2.1,
      ctr: 2.8,
      status: "active"
    },
    {
      id: 3,
      name: "Retargeting",
      platform: "Meta",
      spend: "₹40,000",
      roas: 0.8,
      ctr: 1.2,
      status: "active"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Date Range Picker */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Analytics Dashboard</h2>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search campaigns..."
              className="pl-8 w-[200px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
          </div>
          <Button variant="outline" className="h-9">
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </Button>
          <Button variant="outline" className="h-9">
            <span className="mr-2">Last 30 Days</span>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {kpiData.map((kpi, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {kpi.title}
              </CardTitle>
              <div className={`h-4 w-4 ${kpi.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                {kpi.trend === 'up' ? (
                  <ArrowUpRight className="h-4 w-4" />
                ) : (
                  <ArrowDownRight className="h-4 w-4" />
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpi.value}</div>
              <p className="text-xs text-muted-foreground">
                <span className={kpi.trend === 'up' ? 'text-green-500' : 'text-red-500'}>
                  {kpi.change}
                </span>{' '}
                {kpi.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Performance Chart */}
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>30-Day ROAS Trend</CardTitle>
            <CardDescription>Return on Ad Spend over time</CardDescription>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" className="h-8">
              <span className="w-3 h-3 rounded-full bg-blue-500 mr-2"></span>
              Meta
            </Button>
            <Button variant="outline" size="sm" className="h-8">
              <span className="w-3 h-3 rounded-full bg-orange-500 mr-2"></span>
              Google
            </Button>
          </div>
        </CardHeader>
        <div className="h-[300px] p-6 pt-0">
          <Line 
            data={{
              labels: roasData.map(item => item.name),
              datasets: [
                {
                  label: 'Meta',
                  data: roasData.map(item => item.meta),
                  borderColor: '#3B82F6',
                  backgroundColor: 'rgba(59, 130, 246, 0.1)',
                  tension: 0.3,
                },
                {
                  label: 'Google',
                  data: roasData.map(item => item.google),
                  borderColor: '#F97316',
                  backgroundColor: 'rgba(249, 115, 22, 0.1)',
                  tension: 0.3,
                },
              ],
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: 'bottom' as const,
                },
              },
              scales: {
                y: {
                  beginAtZero: true,
                  grid: {
                    color: 'rgba(0, 0, 0, 0.05)',
                  },
                },
                x: {
                  grid: {
                    display: false,
                  },
                },
              },
            }}
          />
        </div>
      </Card>

      {/* Campaign Performance */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Top Campaigns</CardTitle>
            <CardDescription>By ROAS this month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {campaigns.map((campaign) => (
                <div key={campaign.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{campaign.name}</p>
                    <p className="text-sm text-gray-500">{campaign.platform}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{campaign.roas}x ROAS</p>
                    <p className="text-sm text-gray-500">{campaign.spend} spent</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks to get started</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              <BarChart2 className="mr-2 h-4 w-4" />
              Create Report
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Zap className="mr-2 h-4 w-4" />
              New Campaign
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <MessageSquare className="mr-2 h-4 w-4" />
              Ask AI Assistant
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <TrendingUp className="mr-2 h-4 w-4" />
              View Analytics
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* AI Insights */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>AI Insights</CardTitle>
              <CardDescription>Smart recommendations to improve performance</CardDescription>
            </div>
            <Button variant="outline" size="sm">View All</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 text-blue-600">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h.01a1 1 0 100-2H10V9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">Optimization Opportunity</h3>
                  <div className="mt-1 text-sm text-blue-700">
                    <p>Your "Summer Sale" campaign has a high CTR of 4.2%. Consider increasing the budget by 20% to capitalize on this performance.</p>
                  </div>
                  <div className="mt-2">
                    <Button variant="outline" size="sm" className="text-blue-700 border-blue-200 bg-blue-50 hover:bg-blue-100">
                      Apply Suggestion
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-4 bg-yellow-50 rounded-lg">
              <div className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 text-yellow-600">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">Attention Needed</h3>
                  <div className="mt-1 text-sm text-yellow-700">
                    <p>Your "New Collection" campaign has a ROAS of 1.2x, below your target of 2.0x. Consider pausing underperforming ad sets.</p>
                  </div>
                  <div className="mt-2">
                    <Button variant="outline" size="sm" className="text-yellow-700 border-yellow-200 bg-yellow-50 hover:bg-yellow-100">
                      View Details
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default Overview;
