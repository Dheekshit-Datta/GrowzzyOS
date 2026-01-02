import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const AudienceSchema = z.object({
  workspace_id: z.string().uuid(),
  name: z.string().min(2),
  type: z.enum(['lookalike', 'interest', 'behavior', 'retargeting', 'zero_party']),
  definition: z.record(z.any()),
  size_estimate: z.number().int().positive().optional(),
});

export async function GET() {
  const supabase = createRouteHandlerClient({ cookies });
  const { data, error } = await supabase.from('audiences').select('*').order('created_at', { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ audiences: data });
}

export async function POST(request: Request) {
  const supabase = createRouteHandlerClient({ cookies });
  const body = await request.json();
  const parse = AudienceSchema.safeParse(body);
  if (!parse.success) {
    return NextResponse.json({ error: parse.error.flatten().fieldErrors }, { status: 400 });
  }
  const { data, error } = await supabase.from('audiences').insert(parse.data).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ audience: data }, { status: 201 });
}
