import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

// /api/leads/[id] (edge runtime)
export const runtime = 'edge'

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------
function badRequest(message: string) {
  return NextResponse.json({ error: message }, { status: 400 })
}

// -----------------------------------------------------------------------------
// GET /api/leads/:id  -> fetch a single lead
// PATCH /api/leads/:id -> update fields on a lead (e.g. status change)
// DELETE /api/leads/:id -> delete a lead
// -----------------------------------------------------------------------------
export async function GET(_, { params }: { params: { id: string } }) {
  const id = params.id
  if (!id) return badRequest('Missing lead id')

  const { data, error } = await supabaseAdmin.from('leads').select('*').eq('id', id).single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  if (!data) return NextResponse.json({ error: 'Lead not found' }, { status: 404 })

  return NextResponse.json(data)
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id
  if (!id) return badRequest('Missing lead id')

  let body: any = {}
  try {
    body = await request.json()
  } catch {
    return badRequest('Invalid JSON')
  }

  const { error, data } = await supabaseAdmin
    .from('leads')
    .update({ ...body, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function DELETE(_, { params }: { params: { id: string } }) {
  const id = params.id
  if (!id) return badRequest('Missing lead id')

  const { data, error } = await supabaseAdmin.from('leads').delete().eq('id', id).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
