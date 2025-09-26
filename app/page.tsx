'use client';

import { redirectToYahooAuth } from './composables/useYahooApi';
import { getStoredToken } from './composables/useAuthToken';
import { useEffect, useState } from 'react';
import styles from './page.module.css';
import {LeagueStandings} from "./components/LeagueStandings"
import {Matchups} from "./components/Matchups"
import {getTeamsAndLeagueData, getMatchupsData} from './composables/frontEndData'
import type { Team } from './types';
import type { StandingsResponseLeague } from './types/standingsResponse';

function HomePage() {
const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error] = useState<string | null>(null);
  const [teams, setTeams] = useState<Team[] | null>(null)
  const [matchups, setMatchups] = useState<Team[] | null>(null)
  const [league, setLeague] = useState<StandingsResponseLeague | null>(null)

  // Check if user is already authenticated when component mounts
  useEffect(() => {
    const token = getStoredToken();
    if (token) {
      setIsAuthenticated(true);
      setTeamsAndLeague()
      setMatchupState()
    } else {
      handleLogin()
    }
    
  }, []);

  async function handleLogin () {
    await redirectToYahooAuth();

    setTeamsAndLeague()
  };


  async function setTeamsAndLeague () {
    const data = await getTeamsAndLeagueData().then(data => data)
    if(!data) return
      setTeams(data.teamsData)
      setLeague(data.leagueData)
  }

  async function setMatchupState () {
    const data = await getMatchupsData().then(data => data)
    if(!data) return
    
    setMatchups(data)
  }


  useEffect(() => {
    document.title = "River Rats Fantasy Football";

    if(!localStorage.getItem('yahoo_access_token') && 
      !localStorage.getItem('yahoo_refresh_token')) {

        redirectToYahooAuth()
      }
  }, []);

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.header}>
          <h1>🏈 River Rats Fantasy Football</h1>
          <div className={styles.userInfo}>
            <span>Welcome! You are authenticated.</span>
          </div>
        </div>
        
        <div className={styles.content}>
          <h2>Your Fantasy Dashboard</h2>
          <p>You have successfully authenticated with Yahoo Fantasy Sports!</p>
          
          <div className={styles.features}>
            <div className={styles.feature}>
              <h3>📊 League Standings</h3>
              <LeagueStandings teams={teams ? teams : null} />
      
            </div>
            <div className={styles.feature}>
              <h3>⚔️ Matchups</h3>
              <Matchups matchups={matchups ? matchups : null} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function Home() {
  return (
      <HomePage />
  );
}
