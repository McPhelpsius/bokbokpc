import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    console.log('here')
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    
    if (!code) {
      console.error('OAuth callback: Missing code parameter');
      return NextResponse.redirect(
        new URL('/auth/error?error=Missing authorization code', request.url)
      );
    }

    const clientId = process.env.YAHOO_CLIENT_ID;
    const clientSecret = process.env.YAHOO_CLIENT_SECRET;
    const redirectUri = process.env.YAHOO_REDIRECT_URI;

    if (!clientId || !clientSecret || !redirectUri) {
      console.error('Missing Yahoo OAuth configuration');
      return NextResponse.redirect(
        new URL('/auth/error?error=Server configuration error', request.url)
      );
    }

    // Exchange code for access token
    console.log('Exchanging code for access token...');
    
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
      return NextResponse.redirect(
        new URL('/auth/error?error=Token exchange failed', request.url)
      );
    }

    const tokens = await tokenResponse.json();
    const { access_token, refresh_token } = tokens;

    if (!access_token || !refresh_token) {
      console.error('Invalid token response:', tokens);
      return NextResponse.redirect(
        new URL('/auth/error?error=Invalid token response', request.url)
      );
    }

    console.log('Successfully got tokens, redirecting to frontend...');
    
    // Redirect to success page with tokens
    const successUrl = new URL('/auth/success', request.url);
    successUrl.searchParams.set('access_token', access_token);
    successUrl.searchParams.set('refresh_token', refresh_token);
    
    return NextResponse.redirect(successUrl);
    
  } catch (error) {
    console.error('OAuth callback error:', error);
    return NextResponse.redirect(
      new URL(`/auth/error?error=${encodeURIComponent(error instanceof Error ? error.message : 'Unknown error')}`, request.url)
    );
  }
}
