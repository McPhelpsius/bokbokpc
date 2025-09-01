import React, { useState, useEffect } from 'react';
import { redirectToYahooAuth, getStoredToken, clearTokens } from '../services/yahooApi';
import {LeagueStandings} from "../components/LeagueStandings"
import {getTeamsAndLeagueData} from '../services/frontEndData'


const Home: React.FC = (props) => {
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [teams, setTeams] = useState()
  const [league, setLeague] = useState()

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
    const done  = await redirectToYahooAuth();

    setTeamsAndLeague()
  };

  const handleLogout = () => {
    clearTokens();
    setIsAuthenticated(false);
    setError(null);
  };

  async function setTeamsAndLeague () {
    const {teamsData, leagueData} = await getTeamsAndLeagueData().then(data => data)
setTeams(teamsData)
setLeague(leagueData)
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
