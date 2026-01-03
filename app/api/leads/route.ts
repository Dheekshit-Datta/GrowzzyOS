import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export const runtime = 'edge';

// -----------------------------------------------------------------------------
// GET /api/leads -> list leads
// -----------------------------------------------------------------------------
export async function GET() {
  const { data, error } = await supabaseAdmin
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

// -----------------------------------------------------------------------------
// POST /api/leads -> create a new lead
// -----------------------------------------------------------------------------
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      email,
      phone = '',
      company = '',
      value = 0,
      source = 'Manual',
      notes = '',
      tags = [],
      status = 'new',
    } = body;

    if (!name || !email) {
      return NextResponse.json({ error: 'Name & email required' }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from('leads')
      .insert({ name, email, phone, company, value, source, notes, tags, status })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed' }, { status: 500 });
  }
}
