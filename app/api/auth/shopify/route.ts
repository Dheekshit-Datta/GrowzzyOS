import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');
  const shop = searchParams.get('shop');

  if (error) {
    return NextResponse.redirect(
      `/dashboard/settings?error=shopify_auth_failed`,
      { status: 302 }
    );
  }

  if (!code || !shop) {
    return NextResponse.redirect(
      '/dashboard/settings?error=missing_code_or_shop',
      { status: 302 }
    );
  }

  try {
    // Exchange code for access token
    const tokenResponse = await fetch(`https://${shop}/admin/oauth/access_token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: process.env.NEXT_PUBLIC_SHOPIFY_API_KEY!,
        client_secret: process.env.SHOPIFY_API_SECRET!,
        code: code!,
      }),
    });

    if (!tokenResponse.ok) {
      throw new Error('Failed to exchange code for token');
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    // Get shop info and products
    const [shopResponse, productsResponse] = await Promise.all([
      fetch(`https://${shop}/admin/api/2024-01/shop.json`, {
        headers: {
          'X-Shopify-Access-Token': accessToken,
        },
      }),
      fetch(`https://${shop}/admin/api/2024-01/products/count.json`, {
        headers: {
          'X-Shopify-Access-Token': accessToken,
        },
      }),
    ]);

    let shopData = null;
    let productsCount = 0;

    if (shopResponse.ok) {
      const shopResult = await shopResponse.json();
      shopData = shopResult.shop;
    }

    if (productsResponse.ok) {
      const productsResult = await productsResponse.json();
      productsCount = productsResult.count;
    }

    // Store connection info (in real app, save to database)
    const connectionData = {
      platform: 'shopify',
      accessToken,
      shop,
      shopData,
      productsCount,
      connectedAt: new Date().toISOString(),
    };

    // Save to localStorage via redirect
    const redirectUrl = `${process.env.NEXTAUTH_URL}/dashboard/settings?success=shopify_connected&data=${encodeURIComponent(JSON.stringify(connectionData))}`;
    
    return NextResponse.redirect(redirectUrl);

  } catch (error) {
    console.error('Shopify OAuth error:', error);
    return NextResponse.redirect(
      `/dashboard/settings?error=shopify_auth_failed&message=${encodeURIComponent(error instanceof Error ? error.message : 'Unknown error')}`,
      { status: 302 }
    );
  }
}
