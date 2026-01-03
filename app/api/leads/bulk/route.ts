import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

export const runtime = 'edge'

// POST /api/leads/bulk -> bulk insert leads
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('Bulk import request body:', body)
    const { leads } = body
    
    if (!Array.isArray(leads) || leads.length === 0) {
      console.error('Invalid leads array:', leads)
      return NextResponse.json({ error: 'Invalid leads array' }, { status: 400 })
    }

    // Ensure required fields
    const validLeads = leads.filter(l => l.name && l.email)
    console.log('Valid leads to insert:', validLeads.length)

    const { data, error } = await supabaseAdmin
      .from('leads')
      .insert(validLeads)
      .select()

    if (error) {
      console.error('Supabase insert error:', error)
      throw error
    }

    console.log('Inserted leads:', data)
    return NextResponse.json(data, { status: 201 })
  } catch (err: any) {
    console.error('Bulk insert error:', err)
    return NextResponse.json({ error: err.message || 'Bulk insert failed' }, { status: 500 })
  }
}
