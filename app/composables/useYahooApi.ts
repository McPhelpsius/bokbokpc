import { checkOrRefreshToken, getStoredToken, refreshAccessToken } from "./useAuthToken";

console.log('API URL:', process.env.NEXT_PUBLIC_FRONTEND_URL);
// Simple redirect to Yahoo OAuth
function redirectToYahooAuth () {
  console.log({redirect: process.env.NEXT_PUBLIC_FRONTEND_URL})
  window.location.href = `${process.env.NEXT_PUBLIC_FRONTEND_URL || 'https://bokbokpc.info'}/api/auth/yahoo`;
};

async function makeYahooApiRequest(endpoint: string): Promise<any> {
  await checkOrRefreshToken();
  const token = getStoredToken();
  const appendChar = endpoint.includes('?') ? '&' : '?';

  const res = await fetch(`${process.env.NEXT_PUBLIC_FRONTEND_URL || 'https://bokbokpc.info'}/api/yahoo/${endpoint}${appendChar}access_token=${token}`);

  if (!res.ok) {
    if (res.status === 401 || res.status === 500) {
      // Token expired, try to refresh
      console.log('attempting token refresh...');
      const newToken = await refreshAccessToken();
      
      if (newToken) {
        // Retry with new token
        const retryRes = await fetch(`${process.env.NEXT_PUBLIC_FRONTEND_URL || 'https://bokbokpc.info'}/api/yahoo/${endpoint}${appendChar}access_token=${newToken}`);
        if (retryRes.ok) {
          return retryRes;
        }
      }
      
      // Refresh failed or retry failed
      throw new Error('Access token expired. Please login again.');
    }
    throw new Error(`Failed to fetch data: ${res.statusText}`);
  }

  return res.json();
}

// Fetch Yahoo Fantasy Football games with automatic token refresh
async function fetchLeagueData(): Promise<any> {
  return await makeYahooApiRequest('league');
}

async function fetchMatchupsData(): Promise<any> {
  return await makeYahooApiRequest('matchups')
}

async function fetchIndividualTeamData(teamId: string): Promise<any> {
  return await makeYahooApiRequest(`team?teamId=${teamId}`);
}
async function fetchIndividualTeamStats(teamId: string): Promise<any> {
  return await makeYahooApiRequest(`team/stats?teamId=${teamId}`);
}
async function fetchIndividualTeamMatchups(teamId: string): Promise<any> {
  return await makeYahooApiRequest(`team/matchups?teamId=${teamId}`);
}
async function fetchIndividualTeamRoster(teamId: string): Promise<any> {
  return await makeYahooApiRequest(`team/roster?teamId=${teamId}`);
}

export {redirectToYahooAuth, fetchIndividualTeamData, fetchIndividualTeamMatchups, fetchIndividualTeamRoster, fetchIndividualTeamStats, fetchLeagueData, fetchMatchupsData};