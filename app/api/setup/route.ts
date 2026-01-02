import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    
    if (action === 'check-env') {
      // Check environment variables
      const env = {
        supabase_url: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        supabase_key: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
        openai_key: !!process.env.OPENAI_API_KEY,
        meta_app_id: !!process.env.NEXT_PUBLIC_META_APP_ID,
        linkedin_client_id: !!process.env.NEXT_PUBLIC_LINKEDIN_CLIENT_ID,
        shopify_api_key: !!process.env.NEXT_PUBLIC_SHOPIFY_API_KEY,
        google_client_id: !!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
      };
      
      return NextResponse.json({ env });
    }
    
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
