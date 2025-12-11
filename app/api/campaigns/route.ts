import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const CampaignSchema = z.object({
  workspace_id: z.string().uuid(),
  name: z.string().min(2),
  platform: z.enum(['meta', 'google', 'tiktok']),
  daily_budget: z.number().min(0).optional(),
  currency: z.string().default('USD'),
  status: z.enum(['active', 'paused', 'completed', 'scheduled']).optional(),
  external_id: z.string().optional(),
});

export async function GET() {
  const supabase = createRouteHandlerClient({ cookies });

  const { data, error } = await supabase.from('campaigns').select('*').order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ campaigns: data });
}

export async function POST(request: Request) {
  const supabase = createRouteHandlerClient({ cookies });

  const body = await request.json();
  const parse = CampaignSchema.safeParse(body);

  if (!parse.success) {
    return NextResponse.json({ error: parse.error.flatten().fieldErrors }, { status: 400 });
  }

  const payload = {
    ...parse.data,
    status: parse.data.status ?? 'active',
  };

  const { data, error } = await supabase.from('campaigns').insert(payload).select().single();

  if (error) {
    console.error('Create campaign error', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ campaign: data }, { status: 201 });
}
