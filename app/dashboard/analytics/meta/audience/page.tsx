'use client';
import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Eye, MousePointer, TrendingUp } from 'lucide-react';

export default function MetaAudiencePage() {
  const [audienceData, setAudienceData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('last30days');

  useEffect(() => {
    fetchAudienceData();
  }, [dateRange]);

  const fetchAudienceData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/analytics/meta/audience?dateRange=${dateRange}`);
      
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setAudienceData(result.data);
        }
      } else {
        console.error('Failed to fetch audience data');
      }
    } catch (error) {
      console.error('Error fetching audience data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout activeTab="analytics">
        <div className="space-y-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1,2,3,4].map(i => (
              <div key={i} className="p-6 bg-white rounded-lg shadow animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout activeTab="analytics">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Meta Audience Insights</h1>
            <p className="text-gray-600 mt-1">Understand your audience demographics and behavior</p>
          </div>
          <div className="flex gap-2">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-3 py-2 border rounded-lg text-sm"
            >
              <option value="last7days">Last 7 Days</option>
              <option value="last30days">Last 30 Days</option>
              <option value="last90days">Last 90 Days</option>
            </select>
            <Button className="bg-black hover:bg-gray-800 text-white flex items-center gap-2">
              <Users className="h-4 w-4" />
              Create Audience
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-600 text-sm">Total Reach</p>
                <p className="text-2xl font-bold">{(audienceData?.summary?.totalReach || 0).toLocaleString()}</p>
                <p className="text-green-600 text-xs">+18% vs last month</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-600 text-sm">Impressions</p>
                <p className="text-2xl font-bold">2.3M</p>
                <p className="text-green-600 text-xs">+24% vs last month</p>
              </div>
              <Eye className="h-8 w-8 text-green-600" />
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-600 text-sm">Engagement Rate</p>
                <p className="text-2xl font-bold">4.2%</p>
                <p className="text-green-600 text-xs">+0.8% vs last month</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-600 text-sm">Click-Through Rate</p>
                <p className="text-2xl font-bold">{audienceData?.summary?.avgCTR || 0}%</p>
                <p className="text-red-600 text-xs">-0.3% vs last month</p>
              </div>
              <MousePointer className="h-8 w-8 text-orange-600" />
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Age Distribution</h2>
            <div className="space-y-3">
              {Object.entries(audienceData?.demographics?.age || {}).map(([age, percentage]) => (
                <div key={age} className="flex items-center justify-between">
                  <span className="text-sm">{age}</span>
                  <div className="flex-1 mx-4 bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{width: `${percentage}%`}}></div>
                  </div>
                  <span className="text-sm font-medium">{Number(percentage)}%</span>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Gender Split</h2>
            <div className="space-y-3">
              {Object.entries(audienceData?.demographics?.gender || {}).map(([gender, percentage]) => (
                <div key={gender} className="flex items-center justify-between">
                  <span className="text-sm capitalize">{gender}</span>
                  <div className="flex-1 mx-4 bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        gender === 'male' ? 'bg-green-500' : 
                        gender === 'female' ? 'bg-purple-500' : 'bg-gray-500'
                      }`} 
                      style={{width: `${percentage}%`}}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">{Number(percentage)}%</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Top Locations</h2>
            <div className="space-y-3">
              {Object.entries(audienceData?.demographics?.location || {}).slice(0, 5).map(([location, percentage]) => (
                <div key={location} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <span className="font-medium">{location}</span>
                  <span className="text-sm text-gray-600">{Number(percentage)}% of audience</span>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Device Performance</h2>
            <div className="space-y-3">
              {Object.entries(audienceData?.device || {}).map(([device, percentage]) => (
                <div key={device} className="flex items-center justify-between">
                  <span className="text-sm capitalize">{device}</span>
                  <div className="flex-1 mx-4 bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        device === 'mobile' ? 'bg-blue-500' : 
                        device === 'desktop' ? 'bg-green-500' : 'bg-purple-500'
                      }`} 
                      style={{width: `${percentage}%`}}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">{Number(percentage)}%</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Top Performing Audiences</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Audience Name</th>
                  <th className="text-left py-3 px-4">Size</th>
                  <th className="text-left py-3 px-4">CTR</th>
                  <th className="text-left py-3 px-4">Conversions</th>
                  <th className="text-left py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {audienceData?.topAudiences?.map((audience: any, index: number) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">{audience.name}</td>
                    <td className="py-3 px-4">{audience.size.toLocaleString()}</td>
                    <td className="py-3 px-4">{audience.ctr}%</td>
                    <td className="py-3 px-4">{audience.conversions}</td>
                    <td className="py-3 px-4">
                      <div className="flex gap-1">
                        <button className="p-1 hover:bg-gray-200 rounded text-sm">Edit</button>
                        <button className="p-1 hover:bg-gray-200 rounded text-sm">Duplicate</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
