import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');
  const errorReason = searchParams.get('error_reason');

  if (error) {
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings?error=${encodeURIComponent(errorReason || 'unknown_error')}`
    );
  }

  if (!code) {
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings?error=no_code_provided`
    );
  }

  try {
    // Exchange code for access token
    const tokenResponse = await fetch('https://graph.facebook.com/v19.0/oauth/access_token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: process.env.META_APP_ID,
        client_secret: process.env.META_APP_SECRET,
        redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/meta/callback`,
        code,
      }),
    });

    if (!tokenResponse.ok) {
      throw new Error('Failed to exchange code for access token');
    }

    const { access_token, expires_in } = await tokenResponse.json();

    // Get user's ad accounts
    const accountsResponse = await fetch(
      `https://graph.facebook.com/v19.0/me/adaccounts?fields=id,name,account_id,account_status,currency&access_token=${access_token}`
    );

    if (!accountsResponse.ok) {
      throw new Error('Failed to fetch ad accounts');
    }

    const { data: adAccounts } = await accountsResponse.json();

    // Get user's profile
    const userResponse = await fetch(
      `https://graph.facebook.com/v19.0/me?fields=id,name,email&access_token=${access_token}`
    );
    const userData = await userResponse.json();

    // Store credentials in database
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { error: dbError } = await supabase
      .from('platform_credentials')
      .upsert({
        user_id: user.id,
        platform: 'meta',
        access_token,
        refresh_token: null,
        expires_at: Math.floor(Date.now() / 1000) + expires_in,
        account_data: {
          user_id: userData.id,
          name: userData.name,
          email: userData.email,
          ad_accounts: adAccounts.data || [],
        },
      }, {
        onConflict: 'user_id,platform',
      });

    if (dbError) {
      console.error('Database error:', dbError);
      throw new Error('Failed to store credentials');
    }

    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings?success=meta_connected`
    );
  } catch (error) {
    console.error('Meta OAuth error:', error);
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings?error=connection_failed`
    );
  }
}
