import type { Team } from "../types"
import styles from './standings.module.css'


export const LeagueStandings: React.FC<{teams: Team[] | null}> = (props) => {

    return (
        <div id="teams-list">
            {props.teams?.map((team) => (
                // <a key={team.team_id} href={`team/${team.team_id}`} className={styles.teamDisplay}>
                <div key={team.team_id} className={styles.teamDisplay}>
                    <span className={styles.standing}>#{team.team_standings.rank}</span>
                    <img src={team.team_logos[0].team_logo.url} alt="" />
                    
                    <div>
                        <h4>{team.name} - {team.managers[0].manager.nickname}</h4>
                        <ul className={styles.list}>
                            <li>Record: {team.team_standings.outcome_totals.wins} - {team.team_standings.outcome_totals.losses} - {team.team_standings.outcome_totals.ties}</li>
                            <li>Total Points: {Number(team.team_standings.points_for).toFixed(2)} - {Number(team.team_standings.points_against).toFixed(2)}</li>
                        </ul>
                    </div>
                </div>

            ))}
        </div>
    )
}