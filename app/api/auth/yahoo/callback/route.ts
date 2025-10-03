import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    console.log('here')
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    
    if (!code) {
      console.error('OAuth callback: Missing code parameter');
      const frontendUrl = process.env.NEXT_PUBLIC_FRONTEND_URL || 'https://bokbokpc.info';
      return NextResponse.redirect(
        new URL('/auth/error?error=Missing authorization code', frontendUrl)
      );
    }

    const clientId = process.env.YAHOO_CLIENT_ID;
    const clientSecret = process.env.YAHOO_CLIENT_SECRET;
    const redirectUri = process.env.YAHOO_REDIRECT_URI;

    if (!clientId || !clientSecret || !redirectUri) {
      console.error('Missing Yahoo OAuth configuration');
      const frontendUrl = process.env.NEXT_PUBLIC_FRONTEND_URL || 'https://bokbokpc.info';
      return NextResponse.redirect(
        new URL('/auth/error?error=Server configuration error', frontendUrl)
      );
    }

    // Exchange code for access token
    console.log('Exchanging code for access token...', redirectUri);
    
    const tokenResponse = await fetch('https://api.login.yahoo.com/oauth2/get_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        code: code,
        grant_type: 'authorization_code',
      }),
    });

    console.log('Token response status:', tokenResponse);
    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error('Token exchange failed:', errorText);
      const frontendUrl = process.env.NEXT_PUBLIC_FRONTEND_URL || 'https://bokbokpc.info';
      return NextResponse.redirect(
        new URL('/auth/error?error=Token exchange failed', frontendUrl)
      );
    }

    const tokens = await tokenResponse.json();
    const { access_token, refresh_token } = tokens;

    if (!access_token || !refresh_token) {
      console.error('Invalid token response:', tokens);
      const frontendUrl = process.env.NEXT_PUBLIC_FRONTEND_URL || 'https://bokbokpc.info';
      return NextResponse.redirect(
        new URL('/auth/error?error=Invalid token response', frontendUrl)
      );
    }

    console.log('Successfully got tokens, redirecting to frontend...');
    
    // Redirect to success page with tokens using FRONTEND_URL
    const frontendUrl = process.env.NEXT_PUBLIC_FRONTEND_URL || 'https://bokbokpc.info';
    const successUrl = new URL('/auth/success', frontendUrl);
    successUrl.searchParams.set('access_token', access_token);
    successUrl.searchParams.set('refresh_token', refresh_token);
    
    console.log('Redirecting to:', successUrl.toString());
    return NextResponse.redirect(successUrl);
    
  } catch (error) {
    console.error('OAuth callback error:', error);
    const frontendUrl = process.env.NEXT_PUBLIC_FRONTEND_URL || 'https://bokbokpc.info';
    return NextResponse.redirect(
      new URL(`/auth/error?error=${encodeURIComponent(error instanceof Error ? error.message : 'Unknown error')}`, frontendUrl)
    );
  }
}
