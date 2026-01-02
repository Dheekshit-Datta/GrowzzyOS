import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');

  if (error) {
    return NextResponse.redirect(
      `/dashboard/settings?error=meta_auth_failed`,
      { status: 302 }
    );
  }

  if (!code) {
    return NextResponse.redirect(
      '/dashboard/settings?error=missing_code',
      { status: 302 }
    );
  }

  try {
    // Exchange code for access token
    const tokenResponse = await fetch('https://graph.facebook.com/v19.0/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: process.env.NEXT_PUBLIC_META_APP_ID!,
        client_secret: process.env.META_APP_SECRET!,
        redirect_uri: `${process.env.NEXTAUTH_URL}/api/auth/meta`,
        code: code!,
      }).toString(),
    });

    if (!tokenResponse.ok) {
      throw new Error('Failed to exchange code for token');
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    // Get user profile and ad accounts
    const [userResponse, adAccountsResponse] = await Promise.all([
      fetch('https://graph.facebook.com/v19.0/me', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      }),
      fetch('https://graph.facebook.com/v19.0/me/adaccounts', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      }),
    ]);

    if (!userResponse.ok || !adAccountsResponse.ok) {
      throw new Error('Failed to fetch user data');
    }

    const userData = await userResponse.json();
    const adAccountsData = await adAccountsResponse.json();

    // Store connection info (in real app, save to database)
    const connectionData = {
      platform: 'meta',
      accessToken,
      user: userData,
      adAccounts: adAccountsData.data || [],
      connectedAt: new Date().toISOString(),
    };

    // Save to localStorage via redirect
    const redirectUrl = `${process.env.NEXTAUTH_URL}/dashboard/settings?success=meta_connected&data=${encodeURIComponent(JSON.stringify(connectionData))}`;
    
    return NextResponse.redirect(redirectUrl);

  } catch (error) {
    console.error('Meta OAuth error:', error);
    return NextResponse.redirect(
      `/dashboard/settings?error=meta_auth_failed&message=${encodeURIComponent(error instanceof Error ? error.message : 'Unknown error')}`,
      { status: 302 }
    );
  }
}
