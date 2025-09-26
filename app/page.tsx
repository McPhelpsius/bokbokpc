'use client';

import { redirectToYahooAuth } from './composables/useYahooApi';
import { useEffect } from 'react';
import styles from './page.module.css';

function HomePage() {
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
              <p>View your league&apos;s current standings and rankings</p>
            </div>
            <div className={styles.feature}>
              <h3>⚔️ Matchups</h3>
              <p>Check this week&apos;s matchups and scores</p>
            </div>
            <div className={styles.feature}>
              <h3>👥 Team Management</h3>
              <p>Manage your roster and lineup</p>
            </div>
            <div className={styles.feature}>
              <h3>📈 Statistics</h3>
              <p>View detailed player and team statistics</p>
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
