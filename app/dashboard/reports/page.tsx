'use client';
import { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { mockReports, mockCampaigns, calculateKPIs } from '@/lib/mockData';
import { Plus, Download, Eye, Trash2, FileText } from 'lucide-react';

export default function ReportsPage() {
  const [reports, setReports] = useState(mockReports);
  const [selectedReport, setSelectedReport] = useState<typeof mockReports[0] | null>(null);
  const kpis = calculateKPIs();

  const deleteReport = (id: string) => {
    setReports(reports.filter((r) => r.id !== id));
  };

  const downloadReport = (id: string) => {
    alert(`Downloading report ${id}...`);
  };

  return (
    <DashboardLayout activeTab="reports">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Reports & Insights</h1>
            <p className="text-gray-600 mt-1">Generate automated performance reports and AI insights</p>
          </div>
          <Button className="bg-black hover:bg-gray-800 text-white flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Generate Report
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-6">
            <p className="text-gray-600 text-sm">Total Reports</p>
            <p className="text-3xl font-bold mt-2">{reports.length}</p>
          </Card>
          <Card className="p-6">
            <p className="text-gray-600 text-sm">Blended ROAS</p>
            <p className="text-3xl font-bold mt-2">{kpis.avgRoas}x</p>
          </Card>
          <Card className="p-6">
            <p className="text-gray-600 text-sm">Total Conversions</p>
            <p className="text-3xl font-bold mt-2">{kpis.totalConversions.toLocaleString()}</p>
          </Card>
          <Card className="p-6">
            <p className="text-gray-600 text-sm">Avg CTR</p>
            <p className="text-3xl font-bold mt-2">{kpis.avgCtr}%</p>
          </Card>
        </div>

        {/* Reports List */}
        <div className="space-y-4">
          {reports.map((report) => (
            <Card key={report.id} className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="h-5 w-5 text-blue-600" />
                    <h3 className="text-lg font-bold">{report.title}</h3>
                  </div>
                  <p className="text-sm text-gray-600">
                    Generated on {new Date(report.generatedAt).toLocaleDateString()}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    report.status === 'completed'
                      ? 'bg-green-100 text-green-800'
                      : report.status === 'sent'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-xs text-gray-600">Total Spend</p>
                  <p className="text-sm font-bold mt-1">₹{(report.metrics.totalSpend / 100000).toFixed(1)}L</p>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-xs text-gray-600">Revenue</p>
                  <p className="text-sm font-bold mt-1">₹{(report.metrics.totalRevenue / 100000).toFixed(1)}L</p>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-xs text-gray-600">ROAS</p>
                  <p className="text-sm font-bold mt-1 text-green-600">{report.metrics.blendedRoas}x</p>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-xs text-gray-600">Top Campaign</p>
                  <p className="text-sm font-bold mt-1">{report.metrics.topCampaign}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedReport(report)}
                  className="flex-1 p-2 bg-black hover:bg-gray-800 text-white text-sm rounded flex items-center justify-center gap-2"
                >
                  <Eye className="h-4 w-4" />
                  View Report
                </button>
                <button
                  onClick={() => downloadReport(report.id)}
                  className="p-2 hover:bg-blue-100 rounded text-blue-600"
                  title="Download PDF"
                >
                  <Download className="h-4 w-4" />
                </button>
                <button
                  onClick={() => deleteReport(report.id)}
                  className="p-2 hover:bg-red-100 rounded text-red-600"
                  title="Delete"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </Card>
          ))}
        </div>

        {/* Report Details Modal */}
        {selectedReport && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
            <Card className="p-8 max-w-3xl w-full mx-4 my-8">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold">{selectedReport.title}</h2>
                <button
                  onClick={() => setSelectedReport(null)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-900">
                  <strong>Executive Summary:</strong> This report shows strong performance across all channels with a blended ROAS of {selectedReport.metrics.blendedRoas}x. The {selectedReport.metrics.topCampaign} campaign is the top performer, generating ₹{(selectedReport.metrics.totalRevenue / 1000).toFixed(0)}K in revenue from ₹{(selectedReport.metrics.totalSpend / 1000).toFixed(0)}K spend.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <p className="text-gray-600 text-sm">Total Spend</p>
                  <p className="text-3xl font-bold">₹{(selectedReport.metrics.totalSpend / 100000).toFixed(1)}L</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Total Revenue</p>
                  <p className="text-3xl font-bold">₹{(selectedReport.metrics.totalRevenue / 100000).toFixed(1)}L</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Blended ROAS</p>
                  <p className="text-3xl font-bold text-green-600">{selectedReport.metrics.blendedRoas}x</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Top Platform</p>
                  <p className="text-3xl font-bold">{selectedReport.metrics.topPlatform}</p>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-bold mb-3">Top Campaigns</h3>
                <div className="space-y-2">
                  {mockCampaigns
                    .sort((a, b) => b.revenue - a.revenue)
                    .slice(0, 5)
                    .map((campaign, idx) => (
                      <div key={campaign.id} className="flex justify-between p-2 bg-gray-50 rounded">
                        <span className="text-sm">
                          {idx + 1}. {campaign.name}
                        </span>
                        <span className="text-sm font-bold">₹{(campaign.revenue / 1000).toFixed(0)}K</span>
                      </div>
                    ))}
                </div>
              </div>

              <div className="flex gap-3">
                <Button className="flex-1 bg-black hover:bg-gray-800 text-white flex items-center justify-center gap-2">
                  <Download className="h-4 w-4" />
                  Download PDF
                </Button>
                <Button
                  onClick={() => setSelectedReport(null)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900"
                >
                  Close
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
