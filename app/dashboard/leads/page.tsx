'use client'

import { useState, useEffect } from 'react'
import * as XLSX from 'xlsx'
import {
  DndContext,
  DragEndEvent,
  closestCorners,
} from '@dnd-kit/core'
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { toast } from '@/components/ui/use-toast'
import { Plus, Mail, Phone, MoreVertical, MessageCircle, Upload } from 'lucide-react'

export type Lead = {
  id: string
  name: string
  email: string
  phone: string
  company: string
  value: number
  status: 'new' | 'contacted' | 'qualified' | 'meeting' | 'closed'
  source: string
  notes: string
  last_contact: string | null
  tags: string[]
}

const COLUMNS = [
  { id: 'new', title: 'New', color: 'bg-blue-500' },
  { id: 'contacted', title: 'Contacted', color: 'bg-yellow-500' },
  { id: 'qualified', title: 'Qualified', color: 'bg-purple-500' },
  { id: 'meeting', title: 'Meeting', color: 'bg-orange-500' },
  { id: 'closed', title: 'Closed', color: 'bg-green-500' },
] as const

type ColumnId = (typeof COLUMNS)[number]['id']

function LeadCard({ lead }: { lead: Lead }) {
  const { setNodeRef, transform, transition, attributes, listeners } = useSortable({ id: lead.id })
  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  }
  const initials = lead.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Card className="mb-2 cursor-move hover:shadow-lg transition">
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-semibold">
                {initials}
              </div>
              <div>
                <h4 className="font-semibold text-sm">{lead.name}</h4>
                <p className="text-xs text-muted-foreground">{lead.company}</p>
              </div>
            </div>
            <MoreVertical className="w-4 h-4 text-muted-foreground" />
          </div>
          <div className="space-y-1 text-xs text-muted-foreground mb-3">
            <div className="flex items-center">
              <Mail className="w-3 h-3 mr-1" />
              {lead.email}
            </div>
            {lead.phone && (
              <div className="flex items-center">
                <Phone className="w-3 h-3 mr-1" />
                {lead.phone}
              </div>
            )}
          </div>
          <div className="flex gap-1 mb-3">
            <Button size="sm" variant="outline" className="h-7 px-2 text-xs">
              <Mail className="w-3 h-3 mr-1" />
              Email
            </Button>
            {lead.phone && (
              <Button size="sm" variant="outline" className="h-7 px-2 text-xs">
                <Phone className="w-3 h-3 mr-1" />
                Call
              </Button>
            )}
            <Button size="sm" variant="outline" className="h-7 px-2 text-xs">
              <MessageCircle className="w-3 h-3 mr-1" />
              WhatsApp
            </Button>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-green-600 text-xs font-semibold">₹{lead.value.toLocaleString()}</span>
            <div className="flex gap-1">
              {lead.tags.slice(0, 2).map((tag) => (
                <span key={tag} className="bg-blue-100 text-blue-800 rounded px-2 py-0.5 text-xs">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

import { DashboardLayout } from '@/components/dashboard/DashboardLayout'

export default function CRMPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)
  const [showImport, setShowImport] = useState(false)
  const [saving, setSaving] = useState(false)
  const [importing, setImporting] = useState(false)
  const [form, setForm] = useState<Partial<Lead>>({ status: 'new' })

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        console.log('Fetching leads...')
        const res = await fetch('/api/leads')
        console.log('Fetch response status:', res.status)
        
        if (!res.ok) {
          const errorText = await res.text()
          console.error('Fetch error:', errorText)
          throw new Error(`Failed to fetch: ${errorText}`)
        }
        
        const data: Lead[] = await res.json()
        console.log('Fetched leads:', data)
        setLeads(data)
      } catch (e: any) {
        console.error('Failed to fetch leads:', e)
        toast({ 
          title: 'Failed to load leads', 
          description: e.message,
          variant: 'destructive' 
        })
      } finally {
        setLoading(false)
      }
    }
    
    fetchLeads()
  }, [])

  const onDragEnd = async (e: DragEndEvent) => {
    const { active, over } = e
    if (!over) return
    const id = active.id as string
    const newStatus = over.id as ColumnId
    // Optimistic update
    const previousLeads = [...leads]
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status: newStatus } : l)))
    try {
      const res = await fetch(`/api/leads/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      if (!res.ok) throw new Error('Failed to update status')
    } catch (err) {
      // Revert on error
      setLeads(previousLeads)
      toast({ title: 'Failed to update status', variant: 'destructive' })
    }
  }

  const importLeadsFromCSV = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    setImporting(true)
    try {
      let rows: string[][]
      if (file.name.endsWith('.csv')) {
        const text = await file.text()
        rows = text.split('\n').filter(Boolean).map(r => r.split(',').map(c => c.trim()))
      } else {
        // Excel file
        const buffer = await file.arrayBuffer()
        const workbook = XLSX.read(buffer, { type: 'array' })
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]
        const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][]
        rows = data.map(row => row.map(cell => String(cell || '').trim()))
      }

      if (rows.length < 2) {
        toast({ title: 'File must have at least one row of data', variant: 'destructive' })
        return
      }

      const headers = rows[0].map(h => h.toLowerCase())
      const nameIdx = headers.findIndex(h => h.includes('name'))
      const emailIdx = headers.findIndex(h => h.includes('email'))
      const phoneIdx = headers.findIndex(h => h.includes('phone'))
      const companyIdx = headers.findIndex(h => h.includes('company'))
      const valueIdx = headers.findIndex(h => h.includes('value') || h.includes('deal'))
      const sourceIdx = headers.findIndex(h => h.includes('source'))
      const notesIdx = headers.findIndex(h => h.includes('note'))

      if (nameIdx === -1 || emailIdx === -1) {
        toast({ title: 'File must have "name" and "email" columns', variant: 'destructive' })
        return
      }

      const newLeads: Partial<Lead>[] = []
      for (let i = 1; i < rows.length; i++) {
        const cols = rows[i]
        if (!cols[nameIdx] || !cols[emailIdx]) continue
        newLeads.push({
          name: cols[nameIdx],
          email: cols[emailIdx],
          phone: cols[phoneIdx] || '',
          company: cols[companyIdx] || '',
          value: cols[valueIdx] ? Number(cols[valueIdx]) : 0,
          source: cols[sourceIdx] || 'Import',
          notes: cols[notesIdx] || '',
          status: 'new',
        })
      }

      // Bulk insert
      console.log('Sending to API:', { leads: newLeads })
      const res = await fetch('/api/leads/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leads: newLeads }),
      })
      console.log('API response status:', res.status)
      if (!res.ok) {
        const errorText = await res.text()
        console.error('API error response:', errorText)
        throw new Error(`Failed to import: ${errorText}`)
      }
      const created = await res.json()
      console.log('Created leads:', created)
      setLeads((prev) => [...prev, ...created])
      setShowImport(false)
      toast({ title: `Imported ${newLeads.length} leads` })
    } catch (e: any) {
      toast({ title: 'Import failed', description: e.message, variant: 'destructive' })
    } finally {
      setImporting(false)
    }
  }

  const addLead = async () => {
    if (!form.name || !form.email) {
      toast({ title: 'Name & email required', variant: 'destructive' })
      return
    }
    setSaving(true)
    try {
      console.log('Adding lead:', form)
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      console.log('Response status:', res.status)
      
      if (!res.ok) {
        const errorText = await res.text()
        console.error('API error:', errorText)
        throw new Error(`Failed to save: ${errorText}`)
      }
      
      const created: Lead = await res.json()
      console.log('Created lead:', created)
      setLeads((prev) => [...prev, created])
      setShowAdd(false)
      setForm({ status: 'new' })
      toast({ title: 'Lead added successfully' })
    } catch (e: any) {
      console.error('Add lead error:', e)
      toast({ title: 'Error', description: e.message, variant: 'destructive' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <DashboardLayout activeTab="leads">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">CRM Pipeline</h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setShowImport(true)}>
              Import Leads
            </Button>
            <Button onClick={() => setShowAdd(true)}>
              <Plus className="w-4 h-4 mr-1" /> Add Lead
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          {COLUMNS.map((c) => {
            const list = leads.filter((l) => l.status === c.id)
            const value = list.reduce((s, l) => s + l.value, 0)
            return (
              <Card key={c.id} className="p-4">
                <p className="text-sm text-muted-foreground mb-1">{c.title}</p>
                <p className="text-2xl font-bold">{list.length}</p>
                <p className="text-xs">₹{value.toLocaleString()}</p>
              </Card>
            )
          })}
          <Card className="p-4">
            <p className="text-sm text-muted-foreground mb-1">Conversion Rate</p>
            <p className="text-2xl font-bold">
              {leads.length > 0
                ? Math.round(
                    (leads.filter((l) => l.status === 'closed').length / leads.length) * 100
                  )
                : 0}
              %
            </p>
            <p className="text-xs">Closed / Total</p>
          </Card>
        </div>

        {/* Kanban */}
        {!loading && (
          <DndContext collisionDetection={closestCorners} onDragEnd={onDragEnd}>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 overflow-x-auto">
              {COLUMNS.map((col) => (
                <div key={col.id} className="bg-slate-50 p-3 rounded-lg min-h-[500px]">
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-3 h-3 rounded-full ${col.color}`} />
                    <h3 className="text-sm font-semibold">
                      {col.title} ({leads.filter((l) => l.status === col.id).length})
                    </h3>
                  </div>
                  <SortableContext
                    items={leads.filter((l) => l.status === col.id).map((l) => l.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    {leads
                      .filter((l) => l.status === col.id)
                      .map((lead) => (
                        <LeadCard key={lead.id} lead={lead} />
                      ))}
                  </SortableContext>
                </div>
              ))}
            </div>
          </DndContext>
        )}

        {/* Add Lead dialog */}
        <Dialog open={showAdd} onOpenChange={setShowAdd}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add Lead</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Name *</Label>
                <Input value={form.name || ''} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div>
                <Label>Email *</Label>
                <Input
                  type="email"
                  value={form.email || ''}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
              <div>
                <Label>Phone</Label>
                <Input value={form.phone || ''} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              </div>
              <div>
                <Label>Company</Label>
                <Input value={form.company || ''} onChange={(e) => setForm({ ...form, company: e.target.value })} />
              </div>
              <div>
                <Label>Source</Label>
                <select
                  value={form.source || 'Manual'}
                  onChange={(e) => setForm({ ...form, source: e.target.value })}
                  className="w-full mt-1 px-3 py-2 border rounded text-sm"
                >
                  <option value="Manual">Manual</option>
                  <option value="Meta Ads">Meta Ads</option>
                  <option value="Google Ads">Google Ads</option>
                  <option value="LinkedIn">LinkedIn</option>
                  <option value="Referral">Referral</option>
                </select>
              </div>
              <div className="col-span-2">
                <Label>Deal Value</Label>
                <Input
                  type="number"
                  value={form.value || ''}
                  onChange={(e) => setForm({ ...form, value: +e.target.value })}
                />
              </div>
              <div className="col-span-2">
                <Label>Notes</Label>
                <Textarea
                  value={form.notes || ''}
                  rows={3}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setShowAdd(false)}>
                Cancel
              </Button>
              <Button onClick={addLead} disabled={saving}>
                {saving ? 'Saving...' : 'Add Lead'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Import Leads dialog */}
        <Dialog open={showImport} onOpenChange={setShowImport}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Import Leads from CSV or Excel</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Upload a CSV or Excel file with columns: name, email, phone, company, value, source, notes
              </p>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                <label htmlFor="csv-upload" className="cursor-pointer">
                  <span className="text-sm text-gray-600">Click to upload or drag and drop</span>
                  <input
                    id="csv-upload"
                    type="file"
                    accept=".csv,.xlsx,.xls"
                    className="hidden"
                    onChange={importLeadsFromCSV}
                    disabled={importing}
                  />
                </label>
              </div>
              {importing && (
                <div className="text-center text-sm text-gray-600">Importing...</div>
              )}
            </div>
            <div className="flex justify-end">
              <Button variant="outline" onClick={() => setShowImport(false)} disabled={importing}>
                Cancel
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}

