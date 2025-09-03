import React, { useState, useEffect } from 'react';
import { redirectToYahooAuth, getStoredToken } from '../services/yahooApi';
import {LeagueStandings} from "../components/LeagueStandings"
import {getTeamsAndLeagueData} from '../services/frontEndData'
import type { Team } from '../types';
import type { StandingsResponseLeague } from '../types/standingsResponse';


const Home: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error] = useState<string | null>(null);
  const [teams, setTeams] = useState<Team[] | null>(null)
  const [league, setLeague] = useState<StandingsResponseLeague | null>(null)

  // Check if user is already authenticated when component mounts
  useEffect(() => {
    const token = getStoredToken();
    if (token) {
      setIsAuthenticated(true);
      setTeamsAndLeague()
    } else {
      handleLogin()
    }

    
  }, []);

  async function handleLogin () {
    await redirectToYahooAuth();

    setTeamsAndLeague()
  };

  // const handleLogout = () => {
  //   clearTokens();
  //   setIsAuthenticated(false);
  //   setError(null);
  // };

  async function setTeamsAndLeague () {
    const data = await getTeamsAndLeagueData().then(data => data)
    if(!data) return


      setTeams(data.teamsData)
      setLeague(data.leagueData)
  }


  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      
      {/* Authentication Status */}
      <div className="authenthicated-status">
        {isAuthenticated ? (
          <div>
            ✅ <strong>Connected</strong>
          </div>
        ) : (
          <div>
            ❌ <strong>Disconnected</strong>
          </div>
        )}
      </div>
      <h1>{league?.name}</h1>
      


      <LeagueStandings teams={teams ? teams : null} />

      {/* Error Display */}
      {error && (
        <div style={{ marginBottom: '20px', padding: '10px', backgroundColor: '#f8d7da', borderRadius: '5px', color: '#721c24' }}>
          <strong>Error:</strong> {error}
        </div>
      )}
    </div>
  );
};

export default Home;
