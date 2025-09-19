

// Get stored access token
export const getStoredToken = (): string | null => {
  return localStorage.getItem('yahoo_access_token');
};


// Refresh access token using refresh token
export const refreshAccessToken = async (): Promise<string | null> => {
  console.log('refreshing token')
  const refreshToken = getStoredRefreshToken();
  if (!refreshToken) {
    return null;
  }

  try {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/yahoo/refresh`, {
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

// Simple redirect to Yahoo OAuth
export const redirectToYahooAuth = () => {
  console.log({redirect: import.meta.env.VITE_API_BASE_URL})
  window.location.href = `${import.meta.env.VITE_API_BASE_URL}/auth/yahoo`;
};


async function makeYahooApiRequest(endpoint: string): Promise<any> {
  await checkOrRefreshToken();
  const token = getStoredToken();
  const appendChar = endpoint.includes('?') ? '&' : '?';

  const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/yahoo/${endpoint}${appendChar}access_token=${token}`);

  if (!res.ok) {
    if (res.status === 401 || res.status === 500) {
      // Token expired, try to refresh
      console.log('attempting token refresh...');
      const newToken = await refreshAccessToken();
      
      if (newToken) {
        // Retry with new token
        const retryRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/yahoo/${endpoint}${appendChar}access_token=${newToken}`);
        if (retryRes.ok) {
          return retryRes;
        }
      }
      
      // Refresh failed or retry failed
      throw new Error('Access token expired. Please login again.');
    }
    throw new Error(`Failed to fetch data: ${res.statusText}`);
  }

  return res;
}


// Remove stored tokens (logout)
export const clearTokens = () => {
  localStorage.removeItem('yahoo_access_token');
  localStorage.removeItem('yahoo_refresh_token');
};

// Get stored refresh token
export const getStoredRefreshToken = (): string | null => {
  return localStorage.getItem('yahoo_refresh_token');
};

// Fetch Yahoo Fantasy Football games with automatic token refresh
export async function fetchLeagueData(): Promise<any> {
  const res = await makeYahooApiRequest('league');
  console.table(res)
  return res.json();
}

export async function fetchMatchupsData(): Promise<any> {
  let token = getStoredToken();
  
  if (!token) {
    // Try to refresh token if we have a refresh token
    token = await refreshAccessToken();
    if (!token) {
      throw new Error('No access token found. Please login first.');
    }
  }
  
  // fetch(`https://localhost:3000/yahoo/games?access_token=${token}`);
  const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/yahoo/matchups?access_token=${token}`);
  
  if (!res.ok) {
    if (res.status === 401) {
      // Token expired, try to refresh
      console.log('Access token expired, attempting refresh...');
      const newToken = await refreshAccessToken();
      
      if (newToken) {
        // Retry with new token

        const retryRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/yahoo/matchups?access_token=${newToken}`);
        if (retryRes.ok) {
          return retryRes.json();
        }
      }
      
      // Refresh failed or retry failed
      throw new Error('Access token expired. Please login again.');
    }
    throw new Error(`Failed to fetch matchups data: ${res.statusText}`);
  }
  return res.json();
}

export async function fetchIndividualTeamData(teamId: number): Promise<any> {
  const res = await makeYahooApiRequest(`team?teamId=${teamId}`);

  return res.json();
}
export async function fetchIndividualTeamStats(teamId: number): Promise<any> {
  const res = await makeYahooApiRequest(`team/stats?teamId=${teamId}`);

  return res.json();
}
export async function fetchIndividualTeamMatchups(teamId: number): Promise<any> {
  const res = await makeYahooApiRequest(`team/matchups?teamId=${teamId}`);

  return res.json();
}
export async function fetchIndividualTeamRoster(teamId: number): Promise<any> {
  const res = await makeYahooApiRequest(`team/roster?teamId=${teamId}`);

  return res.json();
}
