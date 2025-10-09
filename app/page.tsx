'use client';

import { redirectToYahooAuth } from './composables/useYahooApi';
import { getStoredToken } from './composables/useAuthToken';
import { useEffect, useState } from 'react';
import styles from './page.module.css';
import { LeagueStandings } from "./components/LeagueStandings"
import { Matchups } from "./components/Matchups"
import { getTeamsAndLeagueData, getMatchupsData } from './composables/frontEndData'
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
      localStorage.setItem("teamsData", JSON.stringify(data.teamsData))
      localStorage.setItem("teamsDataDate", JSON.stringify(new Date().toJSON()))
      localStorage.setItem("leagueData", JSON.stringify(data.leagueData))
      localStorage.setItem("leagueDataDate", JSON.stringify(new Date().toJSON()))
  }

  async function setMatchupState () {
    const data = await getMatchupsData().then(data => data)
    localStorage.setItem("matchups", JSON.stringify(data))
    localStorage.setItem("matchupDate", JSON.stringify(new Date().toJSON()))

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
        
        <div className={styles.content}>
          <h1><img src="./river-rat-square.jpg" alt="" /> River Rats Fantasy Football</h1>
          <article className={styles.features}>
            <div className={styles.feature}>
              <h2>📊 League Standings</h2>
              <LeagueStandings teams={teams ? teams : null} />
      
            </div>
            <div className={styles.feature}>
              <h2>⚔️ Matchups</h2>
              <Matchups matchups={matchups ? matchups : null} />
            </div>
          </article>
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
