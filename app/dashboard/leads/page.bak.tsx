'use client'

import { useState, useEffect } from 'react'
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
import { Plus, Mail, Phone, MoreVertical } from 'lucide-react'

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
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Card className="mb-2 cursor-move hover:shadow-lg transition">
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h4 className="font-semibold text-sm">{lead.name}</h4>
              <p className="text-xs text-muted-foreground">{lead.company}</p>
            </div>
            <MoreVertical className="w-4 h-4 text-muted-foreground" />
          </div>
          <div className="space-y-1 text-xs text-muted-foreground">
            <div className="flex items-center">
              <Mail className="w-3 h-3 mr-1" />
              {lead.email}
            </div>
            <div className="flex items-center">
              <Phone className="w-3 h-3 mr-1" />
              {lead.phone}
            </div>
          </div>
          <div className="flex justify-between items-center mt-3">
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

export default function CRMPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState<Partial<Lead>>({ status: 'new' })

  useEffect(() => {
    fetch('/api/leads')
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data: Lead[]) => setLeads(data))
      .catch(() => setLeads(fakeLeads()))
      .finally(() => setLoading(false))
  }, [])

  const onDragEnd = async (e: DragEndEvent) => {
    const { active, over } = e
    if (!over) return
    const id = active.id as string
    const status = over.id as ColumnId
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)))
    await fetch(`/api/leads/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
  }

  const addLead = async () => {
    if (!form.name || !form.email) {
      toast({ title: 'Name & email required', variant: 'destructive' })
      return
    }
    setSaving(true)
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const created: Lead = await res.json()
      setLeads((prev) => [...prev, created])
      setShowAdd(false)
      setForm({ status: 'new' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">CRM Pipeline</h1>
        <Button onClick={() => setShowAdd(true)}>
          <Plus className="w-4 h-4 mr-1" /> Add Lead
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
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
    </div>
  )
}

function fakeLeads(): Lead[] {
  return Array.from({ length: 8 }, (_, i) => ({
    id: `mock_${i}`,
    name: `Lead ${i + 1}`,
    email: `lead${i + 1}@demo.com`,
    phone: '+91 9876543210',
    company: `Company ${i + 1】`,
    value: Math.floor(Math.random() * 100000) + 10000,
    status: COLUMNS[Math.floor(Math.random() * COLUMNS.length)].id as ColumnId,
    source: 'Manual',
    notes: '',
    last_contact: null,
    tags: ['Demo'],
  }))
}


import { useState, useEffect } from 'react'
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
import { Plus, Mail, Phone, MoreVertical } from 'lucide-react'

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
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Card className="mb-2 cursor-move hover:shadow-lg transition">
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h4 className="font-semibold text-sm">{lead.name}</h4>
              <p className="text-xs text-muted-foreground">{lead.company}</p>
            </div>
            <MoreVertical className="w-4 h-4 text-muted-foreground" />
          </div>
          <div className="space-y-1 text-xs text-muted-foreground">
            <div className="flex items-center">
              <Mail className="w-3 h-3 mr-1" />
              {lead.email}
            </div>
            <div className="flex items-center">
              <Phone className="w-3 h-3 mr-1" />
              {lead.phone}
            </div>
          </div>
          <div className="flex justify-between items-center mt-3">
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

export default function CRMPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState<Partial<Lead>>({ status: 'new' })

  useEffect(() => {
    fetch('/api/leads')
      .then((r) => r.ok ? r.json() : Promise.reject())
      .then((data: Lead[]) => setLeads(data))
      .catch(() => setLeads(fakeLeads()))
      .finally(() => setLoading(false))
  }, [])

  const onDragEnd = async (e: DragEndEvent) => {
    const { active, over } = e
    if (!over) return
    const id = active.id as string
    const status = over.id as ColumnId
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)))
    await fetch(`/api/leads/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
  }

  const addLead = async () => {
    if (!form.name || !form.email) {
      toast({ title: 'Name & email required', variant: 'destructive' })
      return
    }
    setSaving(true)
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const created: Lead = await res.json()
      setLeads((prev) => [...prev, created])
      setShowAdd(false)
      setForm({ status: 'new' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">CRM Pipeline</h1>
        <Button onClick={() => setShowAdd(true)}>
          <Plus className="w-4 h-4 mr-1" /> Add Lead
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
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
              <Input type="email" value={form.email || ''} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div>
              <Label>Phone</Label>
              <Input value={form.phone || ''} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div>
              <Label>Company</Label>
              <Input value={form.company || ''} onChange={(e) => setForm({ ...form, company: e.target.value })} />
            </div>
            <div className="col-span-2">
              <Label>Deal Value</Label>
              <Input type="number" value={form.value || ''} onChange={(e) => setForm({ ...form, value: +e.target.value })} />
            </div>
            <div className="col-span-2">
              <Label>Notes</Label>
              <Textarea value={form.notes || ''} rows={3} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setShowAdd(false)}>Cancel</Button>
            <Button onClick={addLead} disabled={saving}>{saving ? 'Saving...' : 'Add Lead'}</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function fakeLeads(): Lead[] {
  return Array.from({ length: 8 }, (_, i) => ({
    id: `mock_${i}`,
    name: `Lead ${i + 1}`,
    email: `lead${i + 1}@demo.com`,
    phone: '+91 9876543210',
    company: `Company ${i + 1}`,
    value: Math.floor(Math.random() * 100000) + 10000,
    status: COLUMNS[Math.floor(Math.random() * COLUMNS.length)].id as ColumnId,
    source: 'Manual',
    notes: '',
    last_contact: null,
    tags: ['Demo'],
  }))
}
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/components/ui/use-toast'
import { Plus, Mail, Phone, Calendar, MoreVertical } from 'lucide-react'

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
  lastContact: string | null
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
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: lead.id })

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Card className="mb-2 cursor-move hover:shadow-lg transition">
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h4 className="font-semibold text-sm">{lead.name}</h4>
              <p className="text-xs text-muted-foreground">{lead.company}</p>
            </div>
            <MoreVertical className="h-4 w-4 text-muted-foreground" />
          </div>

          <div className="space-y-1 text-xs text-muted-foreground">
            <div className="flex items-center">
              <Mail className="h-3 w-3 mr-1" /> {lead.email}
            </div>
            <div className="flex items-center">
              <Phone className="h-3 w-3 mr-1" /> {lead.phone}
            </div>
          </div>

          <div className="flex items-center justify-between mt-3">
            <span className="text-xs font-semibold text-green-600">₹{lead.value.toLocaleString()}</span>
            <div className="flex gap-1">
              {lead.tags.slice(0, 2).map((tag) => (
                <span key={tag} className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded text-xs">
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

export default function CRMPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddLead, setShowAddLead] = useState(false)
  const [newLead, setNewLead] = useState<Partial<Lead>>({ status: 'new', tags: [] })
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchLeads()
  }, [])

  const fetchLeads = async () => {
    try {
      const res = await fetch('/api/leads')
      if (!res.ok) throw new Error('Failed')
      const data = await res.json()
      setLeads(data)
    } catch (e) {
      setLeads(generateMockLeads())
      toast({
        title: 'Using mock leads',
        description: 'Replace with real API once ready',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event
    if (!over) return
    const id = active.id as string
    const newStatus = over.id as ColumnId
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status: newStatus } : l)))

    try {
      await fetch(`/api/leads/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
    } catch {
      toast({ title: 'Failed to save status', variant: 'destructive' })
    }
  }

  const addLead = async () => {
    if (!newLead.name || !newLead.email) {
      toast({ title: 'Name & email required', variant: 'destructive' })
      return
    }
    setSaving(true)
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newLead),
      })
      if (!res.ok) throw new Error('Failed')
      const created = await res.json()
      setLeads((prev) => [...prev, created])
      setShowAddLead(false)
      setNewLead({ status: 'new', tags: [] })
      toast({ title: 'Lead added' })
    } catch {
      toast({ title: 'Add lead failed', variant: 'destructive' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">CRM Pipeline</h1>
        <Button onClick={() => setShowAddLead(true)}>
          <Plus className="h-4 w-4 mr-1" /> Add Lead
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {COLUMNS.map((col) => {
          const colLeads = leads.filter((l) => l.status === col.id)
          const value = colLeads.reduce((sum, l) => sum + l.value, 0)
          return (
            <Card key={col.id} className="p-4">
              <p className="text-sm text-muted-foreground mb-1">{col.title}</p>
              <p className="text-2xl font-bold">{colLeads.length}</p>
              <p className="text-xs">₹{value.toLocaleString()}</p>
            </Card>
          )
        })}
      </div>

      {/* Kanban */}
      {!loading && (
        <DndContext collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 overflow-x-auto">
            {COLUMNS.map((col) => {
              const colLeads = leads.filter((l) => l.status === col.id)
              return (
                <div key={col.id} className="min-h-[500px] bg-slate-50 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-3 h-3 rounded-full ${col.color}`}></div>
                    <h3 className="font-semibold text-sm">
                      {col.title} ({colLeads.length})
                    </h3>
                  </div>
                  <SortableContext items={colLeads.map((l) => l.id)} strategy={verticalListSortingStrategy}>
                    {colLeads.map((lead) => (
                      <LeadCard key={lead.id} lead={lead} />
                    ))}
                  </SortableContext>
                </div>
              )
            })}
          </div>
        </DndContext>
      )}

      {/* Add Lead Dialog */}
      <Dialog open={showAddLead} onOpenChange={setShowAddLead}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Add New Lead</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Name *</Label>
              <Input
                value={newLead.name || ''}
                onChange={(e) => setNewLead({ ...newLead, name: e.target.value })}
              />
            </div>
            <div>
              <Label>Email *</Label>
              <Input
                type="email"
                value={newLead.email || ''}
                onChange={(e) => setNewLead({ ...newLead, email: e.target.value })}
              />
            </div>
            <div>
              <Label>Company</Label>
              <Input
                value={newLead.company || ''}
                onChange={(e) => setNewLead({ ...newLead, company: e.target.value })}
              />
            </div>
            <div>
              <Label>Phone</Label>
              <Input
                value={newLead.phone || ''}
                onChange={(e) => setNewLead({ ...newLead, phone: e.target.value })}
              />
            </div>
            <div className="col-span-2">
              <Label>Deal Value (₹)</Label>
              <Input
                type="number"
                value={newLead.value || ''}
                onChange={(e) => setNewLead({ ...newLead, value: parseInt(e.target.value, 10) })}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setShowAddLead(false)}>
              Cancel
            </Button>
            <Button onClick={addLead} disabled={saving}>
 from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/components/ui/use-toast'
import { Plus, Mail, Phone, Calendar, MoreVertical, MessageSquare } from 'lucide-react'

// Lead type definition
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
  lastContact: Date
  tags: string[]
}

// Pipeline columns
const COLUMNS = [
  { id: 'new', title: 'New', color: 'bg-blue-500' },
  { id: 'contacted', title: 'Contacted', color: 'bg-yellow-500' },
  { id: 'qualified', title: 'Qualified', color: 'bg-purple-500' },
  { id: 'meeting', title: 'Meeting', color: 'bg-orange-500' },
  { id: 'closed', title: 'Closed', color: 'bg-green-500' },
] as const

type ColumnId = (typeof COLUMNS)[number]['id']

// Single lead card (draggable)
function LeadCard({
  lead,
  onEdit,
}: {
  lead: Lead
  onEdit: () => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: lead.id })

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Card className="mb-3 cursor-move hover:shadow-lg transition">
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h4 className="font-semibold text-sm">{lead.name}</h4>
              <p className="text-xs text-muted-foreground">{lead.company}</p>
            </div>
            <button className="text-muted-foreground hover:text-foreground">
              <MoreVertical className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-1 text-xs">
            <div className="flex items-center text-muted-foreground">
              <Mail className="h-3 w-3 mr-1" />
              {lead.email}
            </div>
            <div className="flex items-center text-muted-foreground">
              <Phone className="h-3 w-3 mr-1" />
              {lead.phone}
            </div>
          </div>

          <div className="flex items-center justify-between mt-3">
            <span className="text-xs font-semibold text-green-600">
              ₹{lead.value.toLocaleString()}
            </span>
            <div className="flex gap-1">
              {lead.tags.slice(0, 2).map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded text-xs"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="flex gap-2 mt-3">
            <Button size="sm" variant="outline" className="flex-1" onClick={onEdit}>
              <MessageSquare className="h-3 w-3 mr-1" />
              Contact
            </Button>
            <Button size="sm" variant="outline" onClick={onEdit}>
              <Calendar className="h-3 w-3" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function CRMPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddLead, setShowAddLead] = useState(false)
  const [newLead, setNewLead] = useState<Partial<Lead>>({ status: 'new', tags: [] })
  const { toast } = useToast()

  useEffect(() => {
    fetchLeads()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Fetch leads from backend (fallback to mock on error)
  const fetchLeads = async () => {
    try {
      const res = await fetch('/api/leads')
      if (!res.ok) throw new Error('Failed')
      const data = await res.json()
      setLeads(data.leads ?? data)
    } catch (_) {
      setLeads(generateMockLeads())
    } finally {
      setLoading(false)
    }
  }

  // Drag-n-drop status change
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event
    if (!over) return
    const leadId = active.id as string
    const newStatus = over.id as ColumnId

    setLeads((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, status: newStatus } : l))
    )

    try {
      await fetch(`/api/leads/${leadId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      toast({ title: 'Lead Updated', description: 'Lead status changed successfully' })
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to update lead',
        variant: 'destructive',
      })
    }
  }

  // Add new lead
  const handleAddLead = async () => {
    if (!newLead.name || !newLead.email) {
      toast({ title: 'Name & email required', variant: 'destructive' })
      return
    }

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newLead),
      })
      const data = await res.json()
      setLeads((prev) => [...prev, data.lead ?? data])
      setShowAddLead(false)
      setNewLead({ status: 'new', tags: [] })
      toast({ title: 'Lead Added', description: 'New lead created successfully' })
    } catch {
      toast({ title: 'Error', description: 'Failed to create lead', variant: 'destructive' })
    }
  }

  // UI
  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">CRM Pipeline</h1>
          <p className="text-muted-foreground">Manage your leads and opportunities</p>
        </div>
        <Button onClick={() => setShowAddLead(true)}>
          <Plus className="h-4 w-4 mr-2" /> Add Lead
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-5 gap-4 mb-6">
        {COLUMNS.map((col) => {
          const colLeads = leads.filter((l) => l.status === col.id)
          const value = colLeads.reduce((sum, l) => sum + l.value, 0)
          return (
            <Card key={col.id}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">{col.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{colLeads.length}</div>
                <p className="text-xs text-muted-foreground">₹{value.toLocaleString()}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Kanban Board */}
      {!loading && (
        <DndContext collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-5 gap-4">
            {COLUMNS.map((column) => {
              const columnLeads = leads.filter((l) => l.status === column.id)
              return (
                <div key={column.id} className="bg-slate-50 rounded-lg p-4 min-h-[600px]">
                  <div className="flex items-center gap-2 mb-4">
                    <div className={`w-3 h-3 rounded-full ${column.color}`} />
                    <h3 className="font-semibold">
                      {column.title} ({columnLeads.length})
                    </h3>
                  </div>
                  <SortableContext
                    items={columnLeads.map((l) => l.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="space-y-2">
                      {columnLeads.map((lead) => (
                        <LeadCard key={lead.id} lead={lead} onEdit={() => {}} />
                      ))}
                    </div>
                  </SortableContext>
                </div>
              )
            })}
          </div>
        </DndContext>
      )}

      {/* Add Lead Dialog */}
      <Dialog open={showAddLead} onOpenChange={setShowAddLead}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Lead</DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <Label>Name *</Label>
              <Input
                value={newLead.name || ''}
                onChange={(e) => setNewLead({ ...newLead, name: e.target.value })}
                placeholder="John Doe"
              />
            </div>
            <div>
              <Label>Email *</Label>
              <Input
                type="email"
                value={newLead.email || ''}
                onChange={(e) => setNewLead({ ...newLead, email: e.target.value })}
                placeholder="john@example.com"
              />
            </div>
            <div>
              <Label>Phone</Label>
              <Input
                value={newLead.phone || ''}
                onChange={(e) => setNewLead({ ...newLead, phone: e.target.value })}
                placeholder="+91 98765 43210"
              />
            </div>
            <div>
              <Label>Company</Label>
              <Input
                value={newLead.company || ''}
                onChange={(e) => setNewLead({ ...newLead, company: e.target.value })}
                placeholder="Acme Corp"
              />
            </div>
            <div>
              <Label>Deal Value (₹)</Label>
              <Input
                type="number"
                value={newLead.value || ''}
                onChange={(e) =>
                  setNewLead({ ...newLead, value: parseInt(e.target.value, 10) })
                }
                placeholder="50000"
              />
            </div>
            <div>
              <Label>Source</Label>
              <Input
                value={newLead.source || ''}
                onChange={(e) => setNewLead({ ...newLead, source: e.target.value })}
                placeholder="LinkedIn, Website, Referral"
              />
            </div>
            <div className="col-span-2">
              <Label>Notes</Label>
              <Textarea
                value={newLead.notes || ''}
                onChange={(e) => setNewLead({ ...newLead, notes: e.target.value })}
                rows={3}
                placeholder="Any additional information..."
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowAddLead(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddLead}>Add Lead</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Temporary mock leads until API is ready
function generateMockLeads(): Lead[] {
  return Array.from({ length: 20 }, (_, i) => ({
    id: `lead_${i + 1}`,
    name: `Lead ${i + 1}`,
    email: `lead${i + 1}@example.com`,
    phone: `+91 ${Math.floor(Math.random() * 9000000000) + 1000000000}`,
    company: `Company ${i + 1}`,
    value: Math.floor(Math.random() * 100000) + 10000,
    status: COLUMNS[Math.floor(Math.random() * COLUMNS.length)].id as ColumnId,
    source: ['LinkedIn', 'Website', 'Referral', 'Cold Email'][Math.floor(Math.random() * 4)],
    notes: 'Sample notes',
    lastContact: new Date(),
    tags: ['Enterprise', 'Hot Lead'].slice(0, Math.floor(Math.random() * 2) + 1),
  }))
}
 from '@dnd-kit/core'
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/components/ui/use-toast'
import {
  Plus,
  Mail,
  Phone,
  Calendar,
  MoreVertical,
  MessageSquare,
} from 'lucide-react'

type Lead = {
  id: string
  name: string
  email: string
  phone: string
  company: string
  value: number
  status: 'new' | 'contacted' | 'qualified' | 'meeting' | 'closed'
  source: string
  notes: string
  lastContact: Date
  tags: string[]
}

export default function CRMPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    source: 'Manual',
    tags: '',
    notes: ''
  });

  const statuses = ['new', 'contacted', 'qualified', 'meeting', 'closed'] as const;

  // Fetch leads from API
  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/leads');
      if (response.ok) {
        const data = await response.json();
        setLeads(data);
      }
    } catch (error) {
      showToast('Failed to fetch leads', 'error');
    } finally {
      setLoading(false);
    }
  };

  const leadsByStatus = statuses.map((status) => ({
    status,
    leads: leads.filter((l) => l.status === status),
  }));

  const moveLead = async (leadId: string, newStatus: typeof statuses[number]) => {
    try {
      const response = await fetch('/api/leads', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: leadId, status: newStatus }),
      });

      if (response.ok) {
        setLeads(
          leads.map((l) =>
            l.id === leadId ? { ...l, status: newStatus, lastContact: new Date().toISOString() } : l
          )
        );
        showToast(`Lead moved to ${newStatus}`, 'success');
      } else {
        showToast('Failed to update lead', 'error');
      }
    } catch (error) {
      showToast('Failed to update lead', 'error');
    }
  };

  const deleteLead = async (id: string) => {
    try {
      const response = await fetch(`/api/leads?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setLeads(leads.filter((l) => l.id !== id));
        showToast('Lead deleted successfully', 'success');
      } else {
        showToast('Failed to delete lead', 'error');
      }
    } catch (error) {
      showToast('Failed to delete lead', 'error');
    }
  };

  const addLead = async () => {
    if (!formData.name || !formData.email) {
      showToast('Name and email are required', 'error');
      return;
    }

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
        }),
      });

      if (response.ok) {
        const newLead = await response.json();
        setLeads([newLead, ...leads]);
        setShowAddModal(false);
        setFormData({
          name: '',
          email: '',
          phone: '',
          company: '',
          source: 'Manual',
          tags: '',
          notes: ''
        });
        showToast('Lead added successfully', 'success');
      } else {
        const errorData = await response.json();
        showToast(errorData.error || 'Failed to add lead', 'error');
      }
    } catch (error) {
      showToast('Failed to add lead', 'error');
    }
  };

  const updateLeadNotes = async (leadId: string, notes: string) => {
    try {
      const response = await fetch('/api/leads', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: leadId, notes }),
      });

      if (response.ok) {
        setLeads(
          leads.map((l) =>
            l.id === leadId ? { ...l, notes } : l
          )
        );
        showToast('Notes updated successfully', 'success');
      } else {
        showToast('Failed to update notes', 'error');
      }
    } catch (error) {
      showToast('Failed to update notes', 'error');
    }
  };

  const stats = {
    total: leads.length,
    qualified: leads.filter((l) => l.status === 'qualified' || l.status === 'meeting').length,
    avgScore: leads.length > 0 ? (leads.reduce((sum, l) => sum + l.score, 0) / leads.length).toFixed(0) : '0',
  };

  const handleImportLeads = () => {
    // Create file input for CSV import
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        showToast('Lead import functionality coming soon!', 'info');
      }
    };
    input.click();
  };

  const handleSendEmail = (lead: Lead) => {
    showToast(`Opening email client for ${lead.name}...`, 'info');
    window.location.href = `mailto:${lead.email}`;
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
          <div className="flex gap-2">
            <Button onClick={() => setShowAddModal(true)} className="bg-black hover:bg-gray-800 text-white flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Lead
            </Button>
            <Button onClick={handleImportLeads} className="bg-gray-200 hover:bg-gray-300 text-gray-900 flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Import Leads
            </Button>
          </div>
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
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setSelectedLead(null)}>
            <Card className="p-8 max-w-2xl w-full mx-4" onClick={(e) => e.stopPropagation()}>
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
                <Button onClick={() => handleSendEmail(selectedLead)} className="flex-1 bg-black hover:bg-gray-800 text-white">
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

        {/* Add Lead Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setShowAddModal(false)}>
            <Card className="p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold">Add New Lead</h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Name *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="John Doe"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Email *</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="john@example.com"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Phone</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+1 (555) 123-4567"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Company</label>
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      placeholder="Acme Corp"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Source</label>
                  <select
                    value={formData.source}
                    onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm"
                  >
                    <option value="Manual">Manual Entry</option>
                    <option value="Meta Ads">Meta Ads</option>
                    <option value="Google Ads">Google Ads</option>
                    <option value="LinkedIn">LinkedIn</option>
                    <option value="Referral">Referral</option>
                    <option value="Website">Website</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Tags (comma-separated)</label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    placeholder="technology, enterprise, high-value"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Notes</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Initial notes about this lead..."
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <Button onClick={addLead} className="flex-1 bg-black hover:bg-gray-800 text-white">
                  Add Lead
                </Button>
                <Button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900"
                >
                  Cancel
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
