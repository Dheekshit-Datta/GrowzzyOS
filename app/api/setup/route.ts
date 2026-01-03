import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function GET() {
  try {
    // Test database connection
    const { data, error } = await supabaseAdmin.from('leads').select('count').single();
    
    if (error) {
      return NextResponse.json({ 
        error: 'Database connection failed', 
        details: error.message 
      }, { status: 500 });
    }

    // Create sample lead if table is empty
    const { count } = data;
    if (count === 0) {
      const sampleLead = {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+1-555-0101',
        company: 'TechCorp',
        value: 50000,
        source: 'Manual',
        notes: 'Sample lead for testing',
        tags: ['sample', 'test'],
        status: 'new'
      };

      const { data: newLead, error: insertError } = await supabaseAdmin
        .from('leads')
        .insert(sampleLead)
        .select()
        .single();

      if (insertError) {
        return NextResponse.json({ 
          error: 'Failed to create sample lead', 
          details: insertError.message 
        }, { status: 500 });
      }

      return NextResponse.json({ 
        message: 'Database connected and sample lead created',
        lead: newLead
      });
    }

    return NextResponse.json({ 
      message: 'Database connected successfully',
      existingLeads: count
    });

  } catch (error: any) {
    return NextResponse.json({ 
      error: 'Setup failed', 
      details: error.message 
    }, { status: 500 });
  }
}
