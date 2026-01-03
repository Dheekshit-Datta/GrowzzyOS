"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { showToast } from "@/components/Toast"
import { 
  TrendingUp, 
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Search,
  Filter,
  ChevronDown,
  BarChart2,
  Zap,
  MessageSquare
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
  Legend
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  ChartTooltip,
  Legend
);

// Revenue by Channel data (stacked bar chart)
const revenueByChannelData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      label: 'Meta',
      data: [12000, 15000, 18000, 14000, 16000, 20000],
      backgroundColor: '#3B82F6',
      borderColor: '#3B82F6',
      borderWidth: 1,
    },
    {
      label: 'Google',
      data: [8000, 10000, 12000, 9000, 11000, 13000],
      backgroundColor: '#93C5FD',
      borderColor: '#93C5FD',
      borderWidth: 1,
    },
    {
      label: 'Shopify',
      data: [5000, 6000, 7000, 5500, 6500, 8000],
      backgroundColor: '#10B981',
      borderColor: '#10B981',
      borderWidth: 1,
    },
  ],
};

// ROAS data for line chart
const roasData = [
  { name: 'Jan 1', meta: 2.1, google: 1.5 },
  { name: 'Jan 8', meta: 2.4, google: 1.7 },
  { name: 'Jan 15', meta: 2.8, google: 1.9 },
  { name: 'Jan 22', meta: 2.6, google: 2.1 },
  { name: 'Jan 29', meta: 3.1, google: 1.8 },
];

export function Overview() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDateRange, setSelectedDateRange] = useState("Last 30 Days");
  const [showFilters, setShowFilters] = useState(false);

  // Event handlers
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    showToast(`Searching for: ${e.target.value}`, 'info');
  };

  const [insights, setInsights] = useState<any[]>([]);
  const [loadingInsights, setLoadingInsights] = useState(true);

  // Fetch insights from API
  useEffect(() => {
    fetchInsights();
  }, []);

  const fetchInsights = async () => {
    try {
      setLoadingInsights(true);
      const response = await fetch('/api/insights');
      if (response.ok) {
        const data = await response.json();
        setInsights(data.slice(0, 3)); // Show only first 3 insights
      }
    } catch (error) {
      console.error('Failed to fetch insights:', error);
    } finally {
      setLoadingInsights(false);
    }
  };

  const handleApplySuggestion = async (insightId: string, suggestion: string) => {
    try {
      const response = await fetch('/api/insights', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'apply',
          insightId,
          note: suggestion
        }),
      });

      if (response.ok) {
        const result = await response.json();
        showToast(`Successfully applied suggestion for ${result.insight.campaign}`, 'success');
        
        // Update insights list
        setInsights(insights.map(i => 
          i.id === insightId ? { ...i, status: 'applied' } : i
        ));
        
        // Show detailed result
        console.log('Applied suggestion result:', result.result);
      } else {
        showToast('Failed to apply suggestion', 'error');
      }
    } catch (error) {
      showToast('Failed to apply suggestion', 'error');
    }
  };

  const handleViewDetails = (insightId: string, campaign: string) => {
    showToast(`Opening detailed analytics for ${campaign}...`, 'info');
    // In a real app, this would navigate to campaign details
    window.open(`/dashboard/analytics?campaign=${encodeURIComponent(campaign)}`, '_blank');
  };

  const handleDismissInsight = async (insightId: string) => {
    try {
      const response = await fetch('/api/insights', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          insightId,
          status: 'dismissed'
        }),
      });

      if (response.ok) {
        setInsights(insights.filter(i => i.id !== insightId));
        showToast('Insight dismissed', 'success');
      } else {
        showToast('Failed to dismiss insight', 'error');
      }
    } catch (error) {
      showToast('Failed to dismiss insight', 'error');
    }
  };

  const handleQuickAction = (action: string) => {
    switch(action) {
      case 'report':
        showToast('Creating report...', 'info');
        break;
      case 'campaign':
        window.location.href = '/dashboard/campaigns';
        break;
      case 'ai':
        window.location.href = '/dashboard/copilot';
        break;
      case 'analytics':
        window.location.href = '/dashboard/analytics';
        break;
      default:
        showToast(`Action: ${action}`, 'info');
    }
  };
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
              value={searchQuery}
              onChange={handleSearch}
              className="pl-8 w-[200px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
          </div>
          <Button variant="outline" className="h-9" onClick={() => setShowFilters(!showFilters)}>
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </Button>
          <Button variant="outline" className="h-9" onClick={() => showToast(`Date range: ${selectedDateRange}`, 'info')}>
            <span className="mr-2">{selectedDateRange}</span>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </div>
      </div>

    {/* KPI Cards */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {kpiData.map((kpi, index) => (
        <Card key={index} className="bg-gray-900 border-gray-800 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">{kpi.title}</CardTitle>
            <div className={`h-4 w-4 ${kpi.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
              {kpi.trend === 'up' ? (
                <ArrowUpRight className="h-4 w-4" />
              ) : (
                <ArrowDownRight className="h-4 w-4" />
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpi.value}</div>
            <p className="text-xs text-gray-400">
              {kpi.change} {kpi.description}
            </p>
          </CardContent>
        </Card>
      ))}
      </div>

      {/* Quick Actions */}
      <Card className="bg-gray-900 border-gray-800 text-white">
        <CardHeader>
          <CardTitle className="text-white">Quick Actions</CardTitle>
          <CardDescription className="text-gray-400">Common tasks to get started</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button variant="outline" className="w-full justify-start" onClick={() => handleQuickAction('report')}>
            <BarChart2 className="mr-2 h-4 w-4" />
            Create Report
          </Button>
          <Button variant="outline" className="w-full justify-start" onClick={() => handleQuickAction('campaign')}>
            <Zap className="mr-2 h-4 w-4" />
            New Campaign
          </Button>
          <Button variant="outline" className="w-full justify-start" onClick={() => handleQuickAction('ai')}>
            <MessageSquare className="mr-2 h-4 w-4" />
            Ask AI Assistant
          </Button>
          <Button variant="outline" className="w-full justify-start" onClick={() => handleQuickAction('analytics')}>
            <TrendingUp className="mr-2 h-4 w-4" />
            View Analytics
          </Button>
        </CardContent>
      </Card>

      {/* AI Insights */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>AI Insights</CardTitle>
              <CardDescription>Smart recommendations to improve performance</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={() => window.location.href = '/dashboard/reports'}>View All</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {loadingInsights ? (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900 mx-auto"></div>
                <p className="text-sm text-gray-500 mt-2">Loading insights...</p>
              </div>
            ) : insights.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-sm text-gray-500">No insights available at the moment</p>
              </div>
            ) : (
              insights.map((insight) => (
                <div key={insight.id} className={`p-4 rounded-lg ${
                  insight.type === 'opportunity' ? 'bg-blue-50' :
                  insight.type === 'warning' ? 'bg-yellow-50' : 'bg-green-50'
                }`}>
                  <div className="flex items-start">
                    <div className={`flex-shrink-0 h-5 w-5 ${
                      insight.type === 'opportunity' ? 'text-blue-600' :
                      insight.type === 'warning' ? 'text-yellow-600' : 'text-green-600'
                    }`}>
                      {insight.type === 'opportunity' && (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h.01a1 1 0 100-2H10V9z" clipRule="evenodd" />
                        </svg>
                      )}
                      {insight.type === 'warning' && (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      )}
                      {insight.type === 'recommendation' && (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <div className="ml-3 flex-1">
                      <h3 className={`text-sm font-medium ${
                        insight.type === 'opportunity' ? 'text-blue-800' :
                        insight.type === 'warning' ? 'text-yellow-800' : 'text-green-800'
                      }`}>{insight.title}</h3>
                      <div className={`mt-1 text-sm ${
                        insight.type === 'opportunity' ? 'text-blue-700' :
                        insight.type === 'warning' ? 'text-yellow-700' : 'text-green-700'
                      }`}>
                        <p>{insight.description}</p>
                        {insight.metrics && (
                          <div className="mt-2 text-xs">
                            {insight.metrics.ctr && <span>CTR: {insight.metrics.ctr}% • </span>}
                            {insight.metrics.roas && <span>ROAS: {insight.metrics.roas}x • </span>}
                            {insight.metrics.adAge && <span>Ad Age: {insight.metrics.adAge} days</span>}
                          </div>
                        )}
                      </div>
                      <div className="mt-2 flex gap-2">
                        {insight.status !== 'applied' && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className={`${
                              insight.type === 'opportunity' ? 'text-blue-700 border-blue-200 bg-blue-50 hover:bg-blue-100' :
                              insight.type === 'warning' ? 'text-yellow-700 border-yellow-200 bg-yellow-50 hover:bg-yellow-100' : 'text-green-700 border-green-200 bg-green-50 hover:bg-green-100'
                            }`} 
                            onClick={() => handleApplySuggestion(insight.id, insight.description)}
                          >
                            Apply Suggestion
                          </Button>
                        )}
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleViewDetails(insight.id, insight.campaign)}
                        >
                          View Details
                        </Button>
                        {insight.status !== 'applied' && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleDismissInsight(insight.id)}
                            className="text-gray-500 hover:text-gray-700"
                          >
                            Dismiss
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default Overview;
