# 🚀 BokBok Fantasy Football Setup Guide

This guide will help you set up authentication for your River Rats Fantasy Football application.

## 📋 Prerequisites

- Node.js 16+ installed
- Yahoo Developer App credentials
- Both frontend (Next.js) and backend (modular server) ready

## 🔧 Environment Setup

### 1. Frontend Environment (Next.js)

Create `.env.local` in the root directory:

```bash
# Frontend API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### 2. Backend Environment (Server)

Update your existing `.env` file or create it in the root directory:

```bash
# Yahoo OAuth Configuration
YAHOO_CLIENT_ID=your_yahoo_client_id_here
YAHOO_CLIENT_SECRET=your_yahoo_client_secret_here
YAHOO_REDIRECT_URI=http://localhost:3000/auth/yahoo/callback

# Server Configuration
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# Optional SSL Configuration
ENABLE_SSL=false
SSL_KEY_PATH=server.key
SSL_CERT_PATH=server.crt
```

### 3. Update Yahoo Redirect URI

**IMPORTANT:** In your Yahoo Developer App settings, make sure your redirect URI is set to:
```
http://localhost:3000/auth/yahoo/callback
```

This should point to your **frontend** (Next.js app), not your backend server.

## 🏃‍♂️ Running the Application

### Terminal 1: Start the Backend Server
```bash
cd server
npm install
npm start
```
Server will run on `http://localhost:3001`

### Terminal 2: Start the Frontend
```bash
npm run dev
```
Frontend will run on `http://localhost:3000`

## 🔐 How Authentication Works

1. **User visits the site** → Automatically redirected to Yahoo OAuth
2. **User logs in with Yahoo** → Yahoo redirects back to your app
3. **App receives tokens** → Stores them securely in localStorage
4. **User can now access** → Yahoo Fantasy data through authenticated API calls

## 🎯 Authentication Flow

```
User visits / → AuthGate (autoLogin=true) → Yahoo OAuth → Yahoo callback 
→ Frontend processes tokens → User authenticated → Access to app
```

## 📁 Key Files Created

### Authentication System
- `app/lib/auth/AuthContext.tsx` - Authentication state management
- `app/lib/auth/useYahooApi.ts` - API hooks for Yahoo Fantasy
- `app/lib/auth/ProtectedRoute.tsx` - Route protection components

### Pages
- `app/page.tsx` - Main page with auto-authentication
- `app/login/page.tsx` - Manual login page
- `app/auth/success/page.tsx` - OAuth success handler
- `app/auth/error/page.tsx` - OAuth error handler

### Layout
- `app/layout.tsx` - Updated with AuthProvider

## 🛠️ Customization Options

### Change Auto-Login Behavior

In `app/page.tsx`, modify the `AuthGate` component:

```jsx
// Auto-redirect to login (current behavior)
<AuthGate autoLogin={true}>
  <HomePage />
</AuthGate>

// Show login prompt instead
<AuthGate autoLogin={false} showLoginPrompt={true}>
  <HomePage />
</AuthGate>

// Manual protection (redirect to /login page)
<ProtectedRoute>
  <HomePage />
</ProtectedRoute>
```

### Add Your Own Protected Pages

```jsx
import { ProtectedRoute } from './lib/auth/ProtectedRoute';

export default function MyPage() {
  return (
    <ProtectedRoute>
      <div>This page requires authentication!</div>
    </ProtectedRoute>
  );
}
```

### Use Yahoo API in Components

```jsx
import { useYahooApi } from './lib/auth/useYahooApi';

function MyComponent() {
  const { api } = useYahooApi();
  
  const fetchLeagueData = async () => {
    try {
      const standings = await api.getLeagueStandings();
      console.log(standings);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
  };
}
```

## 🚨 Troubleshooting

### 1. "Failed to get OAuth URL" Error
- Make sure your backend server is running on port 3001
- Check that `NEXT_PUBLIC_API_URL` matches your server URL

### 2. Yahoo Redirect Error
- Verify your Yahoo app redirect URI matches exactly: `http://localhost:3000/auth/yahoo/callback`
- Check that `YAHOO_REDIRECT_URI` in server .env matches this

### 3. CORS Issues
- Ensure `FRONTEND_URL` in server .env matches your frontend URL
- Both should be `http://localhost:3000` for development

### 4. Authentication Not Working
- Open browser dev tools and check console for errors
- Verify tokens are being stored in localStorage
- Check Network tab for failed API requests

## 🔄 Production Deployment

### Frontend (.env.local)
```bash
NEXT_PUBLIC_API_URL=https://your-api-domain.com
```

### Backend (.env)
```bash
FRONTEND_URL=https://your-frontend-domain.com
YAHOO_REDIRECT_URI=https://your-frontend-domain.com/auth/yahoo/callback
NODE_ENV=production
ENABLE_SSL=true
```

### Yahoo App Settings
Update your Yahoo app redirect URI to:
```
https://your-frontend-domain.com/auth/yahoo/callback
```

## ✅ Testing Authentication

1. Visit `http://localhost:3000`
2. Should automatically redirect to Yahoo login
3. Login with your Yahoo account
4. Should redirect back and show authenticated homepage
5. Try logging out and back in
6. Check that page refreshes maintain authentication

## 🎉 You're Ready!

Your application now requires Yahoo Fantasy Sports authentication when users enter the site. Users will be automatically redirected to login and can access their fantasy data once authenticated.

The modular server architecture means you can easily reuse these authentication components in other projects!
