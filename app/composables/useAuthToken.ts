

// Get stored access token
function getStoredToken (): string | null {
  return localStorage.getItem('yahoo_access_token');
};

async function checkOrRefreshToken() {
  let token = getStoredToken();
  if (!token) {
    // Try to refresh token if we have a refresh token
    await refreshAccessToken();

    token = getStoredToken();
    if (!token) {
      throw new Error('No access token found. Please login first.');
    }
  }

  return token;
}

// Remove stored tokens (logout)
function clearTokens () {
  localStorage.removeItem('yahoo_access_token');
  localStorage.removeItem('yahoo_refresh_token');
};

// Get stored refresh token
function getStoredRefreshToken (): string | null {
  return localStorage.getItem('yahoo_refresh_token');
};


// Refresh access token using refresh token
async function refreshAccessToken (): Promise<string | null> {
  console.log('refreshing token')
  const refreshToken = getStoredRefreshToken();
  if (!refreshToken) {
    return null;
  }

  try {
    const response = await fetch(`${process.env.FRONTEND_URL}/auth/yahoo/refresh`, {
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

export {
  getStoredRefreshToken,
  getStoredToken,
  refreshAccessToken,
  clearTokens,
  checkOrRefreshToken
}
