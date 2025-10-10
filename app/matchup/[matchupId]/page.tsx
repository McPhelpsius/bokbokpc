'use client'

import { use, useState, useEffect, Suspense } from 'react';
import { fetchMatchupsData,
    fetchIndividualTeamRoster
} from '../../composables/useYahooApi';
import { Matchup } from '../../types';
import styles from './matchup.module.css';

export default function Team ({ params }: { params: { matchupId: string } }) {
  const { matchupId } = use(params);

  const [matchup, setMatchup] = useState<Matchup | null>();
  const [rosterOne, setRosterOne] = useState<any[] | null>();
  const [rosterTwo, setRosterTwo] = useState<any[] | null>();

  
  async function setMatchupState() {
    debugger
    const storedMatchups = localStorage.getItem("matchups")
    if(!storedMatchups) {
    await fetchMatchupsData().then(async data => {
      if(!data) return
      localStorage.setItem("matchups", JSON.stringify(data))
      localStorage.setItem("matchupDate", JSON.stringify(new Date().toJSON()))
      await setMatchup(data.find((m: Matchup) => m.teams[0].team_key === matchupId || m.teams[1].team_key === matchupId) || [])
    })
    }
    else {
      const storedMatchupsJson = JSON.parse(storedMatchups)
      const foundMatchup = storedMatchupsJson.find((m: Matchup) => m.teams[0].team_key === matchupId || m.teams[1].team_key === matchupId)
      await setMatchup(foundMatchup)
    }
  }
  
  async function setRosterData(teamId: string, teamNumber: number) {
    if(!teamNumber || !teamId) return

    await fetchIndividualTeamRoster(teamId).then(async data => {
      if(teamNumber === 1) {
        await setRosterOne(() => data)
      } else if (teamNumber === 2) {
        await setRosterTwo(() => data)
      }
    })
  }

  useEffect(() => {
    setMatchupState()
  },[])

  useEffect(() => {
    setRosterData(matchup?.teams[0].team_key, 1)
    setRosterData(matchup?.teams[1].team_key, 2)
  },[matchup])

   return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className={styles.page}>
        <main className={styles.main}>
          
          <div className={styles.content}>
            <section className={styles.headToHead}>
              <article className={styles.roster}>
                <div className={styles.teamHeader}>
                  <img src={matchup?.teams[0].logo} alt="" /><h2>{matchup?.teams[0].name}</h2>
                </div>

                <ul>
                  {rosterOne?.map((player: any) => (
                    player.selected_position.position !== "BN" && player.selected_position.position !== "IR" && (
                    <li key={player.player_id}>
                      <span className={styles.playerPosition}>{player.selected_position.position}</span>
                      <img className={styles.headshot} src={player.headshot.url} alt="" />
                      <span className={styles.playerName}>{player.name.full}</span>
                    </li>
                  )))}
                  <hr />
                  {rosterOne?.map((player: any) => (
                    player.selected_position.position === "BN" && (
                    <li key={player.player_id}>
                      <span className={styles.playerPosition}>{player.selected_position.position}</span>
                      <img className={styles.headshot} src={player.headshot.url} alt="" />
                      <span className={styles.playerName}>{player.name.full}</span>
                    </li>
                  )))}
                  {rosterOne?.map((player: any) => (
                    player.selected_position.position === "IR" && (
                    <li key={player.player_id}>
                      <span className={styles.playerPosition}>{player.selected_position.position}</span>
                      <img className={styles.headshot} src={player.headshot.url} alt="" />
                      <span className={styles.playerName}>{player.name.full}</span>
                    </li>
                  )))}
                </ul>
              </article>
              <div className={styles.versus}>VS</div>
              <article className={`${styles.roster} ${styles.right}`}>
                <div className={styles.teamHeader}>
                <h2>{matchup?.teams[1].name}</h2>
                  <img src={matchup?.teams[1].logo} alt="" />
                </div>
                <ul>
                  {rosterTwo?.map((player: any) => (
                    player.selected_position.position !== "BN" && player.selected_position.position !== "IR" && (
                    <li key={player.player_id}>
                      <span className={styles.playerName}>{player.name.full}</span>
                      <img className={styles.headshot} src={player.headshot.url} alt="" />
                      <span className={styles.playerPosition}>{player.selected_position.position}</span>
                    </li>
                  )))}
                  <hr />
                  {rosterTwo?.map((player: any) => (
                    player.selected_position.position === "BN" && (
                    <li key={player.player_id}>
                      <span className={styles.playerName}>{player.name.full}</span>
                      <img className={styles.headshot} src={player.headshot.url} alt="" />
                      <span className={styles.playerPosition}>{player.selected_position.position}</span>
                    </li>
                  )))}
                  {rosterTwo?.map((player: any) => (
                    player.selected_position.position === "IR" && (
                    <li key={player.player_id}>
                      <span className={styles.playerName}>{player.name.full}</span>
                      <img className={styles.headshot} src={player.headshot.url} alt="" />
                      <span className={styles.playerPosition}>{player.selected_position.position}</span>
                    </li>
                  )))}
                </ul>
              </article>

            </section>
          </div>
        </main>
      </div>
    </Suspense>
   )
}