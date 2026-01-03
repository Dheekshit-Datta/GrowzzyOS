import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');

  if (error) {
    return NextResponse.redirect(
      `/dashboard/settings?error=google_auth_failed`,
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
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        redirect_uri: `${process.env.NEXTAUTH_URL}/api/auth/google`,
        grant_type: 'authorization_code',
        code: code!,
      }).toString(),
    });

    if (!tokenResponse.ok) {
      throw new Error('Failed to exchange code for token');
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;
    const refreshToken = tokenData.refresh_token;

    // Get user profile and ads accounts
    const [userResponse, adsAccountsResponse] = await Promise.all([
      fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      }),
      fetch('https://googleads.googleapis.com/v16/customers:listAccessibleCustomers', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'developer-token': process.env.GOOGLE_ADS_DEVELOPER_TOKEN!,
        },
      }),
    ]);

    let userData = null;
    let adsAccounts = [];

    if (userResponse.ok) {
      userData = await userResponse.json();
    }

    if (adsAccountsResponse.ok) {
      const adsData = await adsAccountsResponse.json();
      adsAccounts = adsData.resourceNames || [];
    }

    // Store connection info (in real app, save to database)
    const connectionData = {
      platform: 'google',
      accessToken,
      refreshToken,
      user: userData,
      adsAccounts,
      connectedAt: new Date().toISOString(),
    };

    // Save to localStorage via redirect
    const redirectUrl = `${process.env.NEXTAUTH_URL}/dashboard/settings?success=google_connected&data=${encodeURIComponent(JSON.stringify(connectionData))}`;
    
    return NextResponse.redirect(redirectUrl);

  } catch (error) {
    console.error('Google OAuth error:', error);
    return NextResponse.redirect(
      `/dashboard/settings?error=google_auth_failed&message=${encodeURIComponent(error instanceof Error ? error.message : 'Unknown error')}`,
      { status: 302 }
    );
  }
}
