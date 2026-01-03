import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');

  if (error) {
    return NextResponse.redirect(
      `/dashboard?error=${encodeURIComponent(error)}`,
      { status: 302 }
    );
  }

  if (!code) {
    return NextResponse.redirect(
      '/dashboard?error=missing_code',
      { status: 302 }
    );
  }

  // Exchange code for access token
  try {
    const tokenResponse = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: code!,
        redirect_uri: `${process.env.NEXTAUTH_URL}/api/auth/linkedin`,
        client_id: process.env.NEXT_PUBLIC_LINKEDIN_CLIENT_ID!,
        client_secret: process.env.LINKEDIN_CLIENT_SECRET!,
      }).toString(),
    });

    if (!tokenResponse.ok) {
      throw new Error('Failed to exchange code for token');
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    // Get user profile and email
    const [profileResponse, emailResponse] = await Promise.all([
      fetch('https://api.linkedin.com/v2/people', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      }),
      fetch('https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      }),
    ]);

    if (!profileResponse.ok || !emailResponse.ok) {
      throw new Error('Failed to fetch user profile');
    }

    const profile = await profileResponse.json();
    const emailData = await emailResponse.json();
    
    // Extract user info
    const userInfo = {
      firstName: profile.localizedFirstName,
      lastName: profile.localizedLastName,
      email: emailData.elements?.[0]?.['handle~']?.emailAddress || '',
      id: profile.id,
    };

    // Store connection info (in real app, save to database)
    const connectionData = {
      platform: 'linkedin',
      accessToken,
      user: userInfo,
      connectedAt: new Date().toISOString(),
    };

    // Save to localStorage via redirect
    const redirectUrl = `${process.env.NEXTAUTH_URL}/dashboard/settings?success=linkedin_connected&data=${encodeURIComponent(JSON.stringify(connectionData))}`;
    
    return NextResponse.redirect(redirectUrl);

  } catch (error) {
    console.error('LinkedIn OAuth error:', error);
    return NextResponse.redirect(
      `/dashboard/settings?error=linkedin_auth_failed&message=${encodeURIComponent(error instanceof Error ? error.message : 'Unknown error')}`,
      { status: 302 }
    );
  }
}
