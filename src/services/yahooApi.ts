// Fetch Yahoo Fantasy Football games from backend

import type { Welcome } from "../types";

// Simple redirect to Yahoo OAuth
export const redirectToYahooAuth = () => {
  window.location.href = 'https://localhost:3000/auth/yahoo';
};

// Get stored access token
export const getStoredToken = (): string | null => {
  return localStorage.getItem('yahoo_access_token');
};

// Remove stored tokens (logout)
export const clearTokens = () => {
  localStorage.removeItem('yahoo_access_token');
  localStorage.removeItem('yahoo_refresh_token');
};

// Get stored refresh token
export const getStoredRefreshToken = (): string | null => {
  return localStorage.getItem('yahoo_refresh_token');
};

// Refresh access token using refresh token
export const refreshAccessToken = async (): Promise<string | null> => {
  const refreshToken = getStoredRefreshToken();
  if (!refreshToken) {
    return null;
  }

  try {
    const response = await fetch('https://localhost:3000/auth/yahoo/refresh', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh_token: refreshToken })
    });

    if (!response.ok) {
      throw new Error('Failed to refresh token');
    }

    const data = await response.json();
    
    // Store new tokens
    localStorage.setItem('yahoo_access_token', data.access_token);
    if (data.refresh_token) {
      localStorage.setItem('yahoo_refresh_token', data.refresh_token);
    }

    return data.access_token;
  } catch (error) {
    console.error('Token refresh failed:', error);
    // Clear invalid tokens
    clearTokens();
    return null;
  }
};

// Fetch Yahoo Fantasy Football games with automatic token refresh
export async function fetchLeagueData(): Promise<Welcome> {
  let token = getStoredToken();
  
  if (!token) {
    // Try to refresh token if we have a refresh token
    token = await refreshAccessToken();
    if (!token) {
      throw new Error('No access token found. Please login first.');
    }
  }
  
  // fetch(`https://localhost:3000/yahoo/games?access_token=${token}`);
  const res = await fetch(`https://localhost:3000/yahoo/league?access_token=${token}`);
  
  if (!res.ok) {
    if (res.status === 401) {
      // Token expired, try to refresh
      console.log('Access token expired, attempting refresh...');
      const newToken = await refreshAccessToken();
      
      if (newToken) {
        // Retry with new token
        const retryRes = await fetch(`https://localhost:3000/yahoo/league?access_token=${newToken}`);
        if (retryRes.ok) {
          return retryRes.json();
        }
      }
      
      // Refresh failed or retry failed
      throw new Error('Access token expired. Please login again.');
    }
    throw new Error(`Failed to fetch games data: ${res.statusText}`);
  }
  return res.json();
}
