import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const UpdateSchema = z.object({
  name: z.string().min(2).optional(),
  status: z.enum(['active', 'paused', 'completed', 'scheduled']).optional(),
  daily_budget: z.number().min(0).optional(),
  platform: z.enum(['meta', 'google', 'tiktok']).optional(),
});

interface Params {
  params: { id: string };
}

export async function PATCH(request: Request, { params }: Params) {
  const supabase = createRouteHandlerClient({ cookies });
  const { id } = params;
  const body = await request.json();
  const parse = UpdateSchema.safeParse(body);
  if (!parse.success) {
    return NextResponse.json({ error: parse.error.flatten().fieldErrors }, { status: 400 });
  }
  const { data, error } = await supabase.from('campaigns').update(parse.data).eq('id', id).select().single();
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ campaign: data });
}

export async function DELETE(_request: Request, { params }: Params) {
  const supabase = createRouteHandlerClient({ cookies });
  const { id } = params;
  const { error } = await supabase.from('campaigns').delete().eq('id', id);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ success: true });
}
