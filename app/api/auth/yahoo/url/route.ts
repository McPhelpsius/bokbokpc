import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  console.table(request)
  try {
    const clientId = process.env.YAHOO_CLIENT_ID;
    const redirectUri = process.env.YAHOO_REDIRECT_URI;

    if (!clientId || !redirectUri) {
      return NextResponse.json(
        { error: 'Missing Yahoo OAuth configuration' },
        { status: 500 }
      );
    }

    const authUrl = new URL('https://api.login.yahoo.com/oauth2/request_auth');
    authUrl.searchParams.set('client_id', clientId);
    authUrl.searchParams.set('redirect_uri', redirectUri);
    authUrl.searchParams.set('response_type', 'code');
    authUrl.searchParams.set('language', 'en-us');

    return NextResponse.json({ authUrl: authUrl.toString() });
  } catch (error) {
    console.error('Error generating OAuth URL:', error);
    return NextResponse.json(
      { error: 'Failed to generate OAuth URL' },
      { status: 500 }
    );
  }
}
