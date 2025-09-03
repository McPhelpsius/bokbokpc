import type { Team } from "../types"


export const LeagueStandings: React.FC<{teams: Team[] | null}> = (props) => {

    return (
        <div id="teams-list">
            {props.teams?.map((team) => (
                <div className="team-display">

                    <img src={team.team_logos[0].team_logo.url} alt="" />
                    <h2>{team.name} </h2>
                    <h3>{team.managers[0].manager.nickname}</h3>
                    <ul>
                        <li>Draft Grade: {team.draft_grade}</li>
                        <li>Standing: {team.team_standings.rank || 'N/A'}</li>
                        <li>Record: {team.team_standings.outcome_totals.wins} - {team.team_standings.outcome_totals.losses} - {team.team_standings.outcome_totals.ties}</li>
                        <li>Total Points: {team.team_standings.points_for} - {team.team_standings.points_against}</li>
                    </ul>
                </div>

            ))}
        </div>
    )
}