import type { Team } from "../types"


export const LeagueStandings: React.FC<{teams: Team[] | null}> = (props) => {

    return (
        <div id="teams-list">
            <h2>League Standings</h2>
            {props.teams?.map((team) => (
                <a key={team.team_id} href={`team/${team.team_id}`} className="team-display">
                    <span className="standing">#{team.team_standings.rank}</span>
                    <img src={team.team_logos[0].team_logo.url} alt="" />
                    
                    <div>
                        <h2>{team.name} - {team.managers[0].manager.nickname}</h2>
                        <ul>
                            <li>Record: {team.team_standings.outcome_totals.wins} - {team.team_standings.outcome_totals.losses} - {team.team_standings.outcome_totals.ties}</li>
                            <li>Total Points: {team.team_standings.points_for} - {team.team_standings.points_against}</li>
                        </ul>
                    </div>
                </a>

            ))}
        </div>
    )
}