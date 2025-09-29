import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const clientId = process.env.YAHOO_CLIENT_ID;
  const redirectUri = process.env.YAHOO_REDIRECT_URI;

  if (!clientId || !redirectUri) {
    console.error('Missing Yahoo OAuth configuration');
    return NextResponse.redirect(
      new URL('/auth/error?error=Server configuration error', request.url)
    );
  }

  const authUrl = new URL('https://bokbokpc.info/api.login.yahoo.com/oauth2/request_auth');
  authUrl.searchParams.set('client_id', clientId);
  authUrl.searchParams.set('redirect_uri', redirectUri);
  authUrl.searchParams.set('response_type', 'code');
  authUrl.searchParams.set('language', 'en-us');


  console.log('Redirecting to Yahoo OAuth:', authUrl);
  return NextResponse.redirect(authUrl.toString());

}


