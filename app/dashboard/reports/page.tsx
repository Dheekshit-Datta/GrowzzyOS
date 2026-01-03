'use client';
import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { Plus, Download, Eye, Trash2, FileText, Calendar, TrendingUp } from 'lucide-react';

// Define interfaces
interface Campaign {
  id: string;
  name: string;
  revenue: number;
}

interface Metrics {
  totalSpend: number;
  totalRevenue: number;
  blendedRoas: number;
  totalConversions: number;
  avgCTR: number;
  avgCPC: number;
  topCampaign: string;
  topPlatform: string;
}

// Remove duplicate Report interface and keep only one with all required fields

// Mock data
const mockCampaigns: Campaign[] = [
  { id: '1', name: 'Summer Sale', revenue: 500000 },
  { id: '2', name: 'New Collection', revenue: 420000 },
  { id: '3', name: 'Holiday Special', revenue: 380000 },
  { id: '4', name: 'Flash Sale', revenue: 320000 },
  { id: '5', name: 'Clearance', revenue: 280000 },
];

interface Report {
  id: string;
  title: string;
  type: 'weekly' | 'monthly' | 'custom';
  status: 'completed' | 'generating' | 'sent';
  generatedAt: string;
  metrics: Metrics;
}

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [generatingReport, setGeneratingReport] = useState(false);
  const [formData, setFormData] = useState({
    type: 'weekly' as 'weekly' | 'monthly' | 'custom',
    dateRange: 'last7days',
    platforms: [] as string[]
  });

  // Fetch reports from API
  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/reports');
      if (response.ok) {
        const data = await response.json();
        setReports(data.reports || []);
      }
    } catch (error) {
      toast({ title: 'Failed to fetch reports', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const generateReport = async () => {
    try {
      setGeneratingReport(true);
      
      // Calculate date range
      const now = new Date();
      let startDate: Date;
      let endDate: Date = now;
      
      switch (formData.dateRange) {
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
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      }

      const response = await fetch('/api/reports/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          dateRange: {
            start: startDate.toISOString().split('T')[0],
            end: endDate.toISOString().split('T')[0]
          },
          sections: ['executive', 'kpi', 'campaigns', 'platforms', 'insights'],
          userId: 'current-user' // Would come from auth
        }),
      });

      if (response.ok) {
        const result = await response.json();
        
        if (result.success) {
          // Create a new report entry
          const newReport: Report = {
            id: Date.now().toString(),
            title: `${formData.type.charAt(0).toUpperCase() + formData.type.slice(1)} Report - ${new Date().toLocaleDateString()}`,
            type: formData.type,
            status: 'completed',
            generatedAt: new Date().toISOString(),
            metrics: result.data.kpi
          };
          
          setReports([newReport, ...reports]);
          setShowGenerateModal(false);
          toast({ title: 'Report generated successfully' });
          
          // Auto-download the report
          setTimeout(() => {
            downloadReport(newReport, result.data);
          }, 1000);
        } else {
          toast({ title: 'Failed to generate report data', variant: 'destructive' });
        }
      } else {
        toast({ title: 'Failed to generate report', variant: 'destructive' });
      }
    } catch (error) {
      toast({ title: 'Failed to generate report', variant: 'destructive' });
    } finally {
      setGeneratingReport(false);
    }
  };

  const deleteReport = async (id: string) => {
    try {
      const response = await fetch(`/api/reports?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setReports(reports.filter((r) => r.id !== id));
        toast({ title: 'Report deleted successfully' });
      } else {
        toast({ title: 'Failed to delete report', variant: 'destructive' });
      }
    } catch (error) {
      toast({ title: 'Failed to delete report', variant: 'destructive' });
    }
  };

  const downloadReport = async (report: Report, reportData?: any) => {
    try {
      if (reportData) {
        // Generate enhanced PDF content with real data
        const pdfContent = generateEnhancedPDFContent(report, reportData);
        
        // Create blob and download
        const blob = new Blob([pdfContent], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${report.title.replace(/\s+/g, '_')}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } else {
        // Fallback to simple PDF generation
        const pdfContent = generatePDFContent(report);
        
        // Create blob and download
        const blob = new Blob([pdfContent], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${report.title.replace(/\s+/g, '_')}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
      
      toast({ title: 'Report downloaded successfully' });
    } catch (error) {
      toast({ title: 'Failed to download report', variant: 'destructive' });
    }
  };

  const generateEnhancedPDFContent = (report: Report, reportData: any): string => {
    // Enhanced PDF generation with real data
    const { executiveSummary, kpi, campaigns, platformBreakdown, aiInsights } = reportData;
    
    let content = `
%PDF-1.4
1 0 obj
<<
/Title (${report.title})
/Creator (GrowzzyOS)
/Producer (GrowzzyOS Reports)
>>
endobj

2 0 obj
<<
/Type /Catalog
/Pages 3 0 R
>>
endobj

3 0 obj
<<
/Type /Pages
/Kids [4 0 R 5 0 R 6 0 R]
/Count 3
>>
endobj

4 0 obj
<<
/Type /Page
/Parent 3 0 R
/MediaBox [0 0 612 792]
/Contents 7 0 R
/Resources <<
/Font <<
/F1 8 0 R
>>
>>
>>
endobj

5 0 obj
<<
/Type /Page
/Parent 3 0 R
/MediaBox [0 0 612 792]
/Contents 9 0 R
/Resources <<
/Font <<
/F1 8 0 R
>>
>>
>>
endobj

6 0 obj
<<
/Type /Page
/Parent 3 0 R
/MediaBox [0 0 612 792]
/Contents 10 0 R
/Resources <<
/Font <<
/F1 8 0 R
>>
>>
>>
endobj

7 0 obj
<<
/Length 300
>>
stream
BT
/F1 16 Tf
72 720 Td
(${report.title}) Tj
/F1 12 Tf
0 -20 Td
(Date Range: ${reportData.dateRange}) Tj
0 -15 Td
(Generated: ${new Date().toLocaleDateString()}) Tj
/F1 14 Tf
0 -30 Td
(Executive Summary) Tj
/F1 12 Tf
0 -20 Td
(Key Wins:) Tj
0 -15 Td
`;

    // Add wins
    executiveSummary.wins.forEach((win: string, index: number) => {
      content += `(${index + 1}. ${win}) Tj 0 -12 Td\n`;
    });

    content += `
0 -10 Td
(Areas of Concern:) Tj
0 -15 Td
`;

    // Add concerns
    executiveSummary.concerns.forEach((concern: string, index: number) => {
      content += `(${index + 1}. ${concern}) Tj 0 -12 Td\n`;
    });

    content += `
ET
endstream
endobj

8 0 obj
<<
/Type /Font
/Subtype /Type1
/BaseFont /Helvetica
>>
endobj

9 0 obj
<<
/Length 200
>>
stream
BT
/F1 14 Tf
72 720 Td
(KPI Dashboard) Tj
/F1 12 Tf
0 -20 Td
(Total Spend: ₹${kpi.totalSpend.toLocaleString()}) Tj
0 -15 Td
(Total Revenue: ₹${kpi.totalRevenue.toLocaleString()}) Tj
0 -15 Td
(Overall ROAS: ${kpi.roas}x) Tj
0 -15 Td
(Total Conversions: ${kpi.conversions}) Tj
ET
endstream
endobj

10 0 obj
<<
/Length 300
>>
stream
BT
/F1 14 Tf
72 720 Td
(AI Recommendations) Tj
/F1 12 Tf
0 -20 Td
`;

    // Add AI insights
    aiInsights.forEach((insight: string, index: number) => {
      content += `(${index + 1}. ${insight}) Tj 0 -15 Td\n`;
    });

    content += `
ET
endstream
endobj

xref
0 11
0000000000 65535 f
0000000009 00000 n
0000000058 00000 n
0000000115 00000 n
0000000174 00000 n
0000000300 00000 n
0000000400 00000 n
0000000500 00000 n
0000000800 00000 n
0000000850 00000 n
0000001050 00000 n
trailer
<<
/Size 11
/Root 2 0 R
>>
startxref
1200
%%EOF
    `.trim();

    return content;
  };

  const generatePDFContent = (report: Report): string => {
    // Simple PDF generation (in production, use a library like jsPDF or Puppeteer)
    return `
%PDF-1.4
1 0 obj
<<
/Title (${report.title})
/Creator (GrowzzyOS)
/Producer (GrowzzyOS Reports)
>>
endobj

2 0 obj
<<
/Type /Catalog
/Pages 3 0 R
>>
endobj

3 0 obj
<<
/Type /Pages
/Kids [4 0 R]
/Count 1
>>
endobj

4 0 obj
<<
/Type /Page
/Parent 3 0 R
/MediaBox [0 0 612 792]
/Contents 5 0 R
/Resources <<
/Font <<
/F1 6 0 R
>>
>>
>>
endobj

5 0 obj
<<
/Length 44
>>
stream
BT
/F1 12 Tf
72 720 Td
(${report.title}) Tj
ET
endstream
endobj

6 0 obj
<<
/Type /Font
/Subtype /Type1
/BaseFont /Helvetica
>>
endobj

xref
0 7
0000000000 65535 f
0000000009 00000 n
0000000058 00000 n
0000000115 00000 n
0000000174 00000 n
0000000301 00000 n
0000000380 00000 n
trailer
<<
/Size 7
/Root 2 0 R
>>
startxref
496
%%EOF
    `.trim();
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
          <Button 
            onClick={() => setShowGenerateModal(true)} 
            className="bg-black hover:bg-gray-800 text-white flex items-center gap-2"
          >
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
            <p className="text-gray-600 text-sm">Avg ROAS</p>
            <p className="text-3xl font-bold mt-2">
              {reports.length > 0 
                ? (reports.reduce((sum, r) => sum + r.metrics.blendedRoas, 0) / reports.length).toFixed(1) + 'x'
                : '0x'
              }
            </p>
          </Card>
          <Card className="p-6">
            <p className="text-gray-600 text-sm">Total Conversions</p>
            <p className="text-3xl font-bold mt-2">
              {reports.reduce((sum, r) => sum + r.metrics.totalConversions, 0).toLocaleString()}
            </p>
          </Card>
          <Card className="p-6">
            <p className="text-gray-600 text-sm">Avg CTR</p>
            <p className="text-3xl font-bold mt-2">
              {reports.length > 0 
                ? (reports.reduce((sum, r) => sum + r.metrics.avgCTR, 0) / reports.length).toFixed(1) + '%'
                : '0%'
              }
            </p>
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
                    Generated on {formatDate(report.generatedAt)}
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
                    onClick={() => downloadReport(report)}
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
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 overflow-y-auto" onClick={() => setSelectedReport(null)}>
            <Card className="p-8 max-w-3xl w-full mx-4 my-8" onClick={(e) => e.stopPropagation()}>
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
                    .sort((a: Campaign, b: Campaign) => b.revenue - a.revenue)
                    .slice(0, 5)
                    .map((campaign: Campaign, idx: number) => (
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
};
