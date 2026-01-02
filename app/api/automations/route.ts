import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export const runtime = 'edge';

// GET /api/automations -> fetch all automations
export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('automations')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ automations: data });
  } catch (error: any) {
    console.error('Error fetching automations:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST /api/automations -> create new automation
export async function POST(request: NextRequest) {
  try {
    const { name, trigger, condition, action } = await request.json();
    
    if (!name || !trigger || !condition || !action) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from('automations')
      .insert({
        name,
        trigger,
        condition,
        action,
        status: 'active',
        last_run: null,
        next_run: calculateNextRun(trigger),
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data, { status: 201 });
  } catch (error: any) {
    console.error('Error creating automation:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT /api/automations -> update automation
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status, ...updateData } = body;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Missing automation ID' },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from('automations')
      .update(status ? { status } : updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error updating automation:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PATCH /api/automations -> update automation status
export async function PATCH(request: NextRequest) {
  try {
    const { id, status } = await request.json();
    
    if (!id || !status) {
      return NextResponse.json(
        { error: 'Missing id or status' },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from('automations')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error updating automation:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE /api/automations -> delete automation
export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Missing automation ID' },
        { status: 400 }
      );
    }

    const { error } = await supabaseAdmin
      .from('automations')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting automation:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

function calculateNextRun(trigger: string): string {
  const now = new Date();
  
  if (trigger.includes('Daily')) {
    now.setDate(now.getDate() + 1);
  } else if (trigger.includes('Weekly')) {
    now.setDate(now.getDate() + 7);
  } else if (trigger.includes('Monthly')) {
    now.setMonth(now.getMonth() + 1);
  } else if (trigger.includes('Hourly')) {
    now.setHours(now.getHours() + 1);
  } else {
    now.setDate(now.getDate() + 1);
  }
  
  return now.toISOString();
}
