'use client';
import { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { mockLeads } from '@/lib/mockData';
import { Plus, Mail, Phone, Star, Trash2 } from 'lucide-react';

export default function LeadsPage() {
  const [leads, setLeads] = useState(mockLeads);
  const [selectedLead, setSelectedLead] = useState<typeof mockLeads[0] | null>(null);

  const statuses = ['new', 'contacted', 'qualified', 'meeting', 'closed'] as const;

  const leadsByStatus = statuses.map((status) => ({
    status,
    leads: leads.filter((l) => l.status === status),
  }));

  const moveLead = (leadId: string, newStatus: typeof statuses[number]) => {
    setLeads(
      leads.map((l) =>
        l.id === leadId ? { ...l, status: newStatus } : l
      )
    );
  };

  const deleteLead = (id: string) => {
    setLeads(leads.filter((l) => l.id !== id));
  };

  const stats = {
    total: leads.length,
    qualified: leads.filter((l) => l.status === 'qualified' || l.status === 'meeting').length,
    avgScore: (leads.reduce((sum, l) => sum + l.score, 0) / leads.length).toFixed(0),
  };

  return (
    <DashboardLayout activeTab="leads">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Leads & CRM</h1>
            <p className="text-gray-600 mt-1">Manage leads and track outreach campaigns</p>
          </div>
          <Button className="bg-black hover:bg-gray-800 text-white flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Import Leads
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-6">
            <p className="text-gray-600 text-sm">Total Leads</p>
            <p className="text-3xl font-bold mt-2">{stats.total}</p>
          </Card>
          <Card className="p-6">
            <p className="text-gray-600 text-sm">Qualified Leads</p>
            <p className="text-3xl font-bold mt-2">{stats.qualified}</p>
          </Card>
          <Card className="p-6">
            <p className="text-gray-600 text-sm">Avg Lead Score</p>
            <p className="text-3xl font-bold mt-2">{stats.avgScore}</p>
          </Card>
        </div>

        {/* Kanban Board */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 overflow-x-auto pb-4">
          {leadsByStatus.map((column) => (
            <div key={column.status} className="flex-shrink-0 w-full md:w-80">
              <div className="bg-gray-100 rounded-lg p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold capitalize">{column.status}</h3>
                  <span className="bg-gray-300 text-gray-700 text-xs font-semibold px-2 py-1 rounded">
                    {column.leads.length}
                  </span>
                </div>

                <div className="space-y-3">
                  {column.leads.map((lead) => (
                    <Card
                      key={lead.id}
                      className="p-4 cursor-pointer hover:shadow-lg transition-shadow bg-white"
                      onClick={() => setSelectedLead(lead)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-sm">{lead.name}</h4>
                        <Star className={`h-4 w-4 ${lead.score > 80 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                      </div>
                      <p className="text-xs text-gray-600 mb-2">{lead.company}</p>
                      <div className="flex gap-2 mb-3">
                        <a href={`mailto:${lead.email}`} className="flex-1">
                          <button className="w-full p-1 bg-blue-100 hover:bg-blue-200 rounded text-blue-700 text-xs flex items-center justify-center gap-1">
                            <Mail className="h-3 w-3" />
                            Email
                          </button>
                        </a>
                        <a href={`tel:${lead.phone}`} className="flex-1">
                          <button className="w-full p-1 bg-green-100 hover:bg-green-200 rounded text-green-700 text-xs flex items-center justify-center gap-1">
                            <Phone className="h-3 w-3" />
                            Call
                          </button>
                        </a>
                      </div>
                      <div className="flex gap-2">
                        {column.status !== 'closed' && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              const nextStatus = statuses[statuses.indexOf(column.status) + 1];
                              if (nextStatus) moveLead(lead.id, nextStatus);
                            }}
                            className="flex-1 text-xs bg-black hover:bg-gray-800 text-white py-1 rounded"
                          >
                            Move
                          </button>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteLead(lead.id);
                          }}
                          className="p-1 hover:bg-red-100 rounded text-red-600"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Lead Details Modal */}
        {selectedLead && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="p-8 max-w-2xl w-full mx-4">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold">{selectedLead.name}</h2>
                <button
                  onClick={() => setSelectedLead(null)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <p className="text-gray-600 text-sm">Email</p>
                  <p className="text-lg font-semibold">{selectedLead.email}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Phone</p>
                  <p className="text-lg font-semibold">{selectedLead.phone}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Company</p>
                  <p className="text-lg font-semibold">{selectedLead.company}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Status</p>
                  <p className="text-lg font-semibold capitalize">{selectedLead.status}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Lead Score</p>
                  <p className="text-lg font-semibold">{selectedLead.score}/100</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Source</p>
                  <p className="text-lg font-semibold">{selectedLead.source}</p>
                </div>
              </div>

              <div className="mb-6">
                <p className="text-gray-600 text-sm mb-2">Tags</p>
                <div className="flex flex-wrap gap-2">
                  {selectedLead.tags.map((tag) => (
                    <span key={tag} className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <Button className="flex-1 bg-black hover:bg-gray-800 text-white">
                  Send Email
                </Button>
                <Button
                  onClick={() => setSelectedLead(null)}
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
