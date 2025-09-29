import { checkOrRefreshToken, getStoredToken, refreshAccessToken } from "./useAuthToken";

// Simple redirect to Yahoo OAuth
function redirectToYahooAuth () {
  console.log({redirect: process.env.FRONTEND_URL})
  window.location.href = `https://bokbokpc.info/api/auth/yahoo`;
};

async function makeYahooApiRequest(endpoint: string): Promise<any> {
  await checkOrRefreshToken();
  const token = getStoredToken();
  const appendChar = endpoint.includes('?') ? '&' : '?';

  const res = await fetch(`https://bokbokpc.info/api/yahoo/${endpoint}${appendChar}access_token=${token}`);

  if (!res.ok) {
    if (res.status === 401 || res.status === 500) {
      // Token expired, try to refresh
      console.log('attempting token refresh...');
      const newToken = await refreshAccessToken();
      
      if (newToken) {
        // Retry with new token
        const retryRes = await fetch(`https://bokbokpc.info/api/yahoo/${endpoint}${appendChar}access_token=${newToken}`);
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

// Fetch Yahoo Fantasy Football games with automatic token refresh
async function fetchLeagueData(): Promise<any> {
  const res = await makeYahooApiRequest('league');
  return res.json();
}

async function fetchMatchupsData(): Promise<any> {
  let token = getStoredToken();
  
  if (!token) {
    // Try to refresh token if we have a refresh token
    token = await refreshAccessToken();
    if (!token) {
      throw new Error('No access token found. Please login first.');
    }
  }
  
  const res = await fetch(`https://bokbokpc.info/api/yahoo/matchups?access_token=${token}`);
  
  if (!res.ok) {
    if (res.status === 401) {
      // Token expired, try to refresh
      console.log('Access token expired, attempting refresh...');
      const newToken = await refreshAccessToken();
      
      if (newToken) {
        // Retry with new token

        const retryRes = await fetch(`https://bokbokpc.info/api/yahoo/matchups?access_token=${newToken}`);
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

async function fetchIndividualTeamData(teamId: number): Promise<any> {
  const res = await makeYahooApiRequest(`team?teamId=${teamId}`);

  return res.json();
}
async function fetchIndividualTeamStats(teamId: number): Promise<any> {
  const res = await makeYahooApiRequest(`team/stats?teamId=${teamId}`);

  return res.json();
}
async function fetchIndividualTeamMatchups(teamId: number): Promise<any> {
  const res = await makeYahooApiRequest(`team/matchups?teamId=${teamId}`);

  return res.json();
}
async function fetchIndividualTeamRoster(teamId: number): Promise<any> {
  const res = await makeYahooApiRequest(`team/roster?teamId=${teamId}`);

  return res.json();
}

export {redirectToYahooAuth, fetchIndividualTeamData, fetchIndividualTeamMatchups, fetchIndividualTeamRoster, fetchIndividualTeamStats, fetchLeagueData, fetchMatchupsData};