import { type Team } from '../types';
import { fetchLeagueData, fetchMatchupsData } from './yahooApi';

function filterOnlyValidObjects (array: any[]) {
   return array.filter((matchup: any) => typeof matchup === "object");
}

async function fetchStandings() {
    try {
        console.log('Fetching Yahoo games data...');
        const data = await fetchLeagueData();
        return data;
    } catch (error: any) {
        console.error('Error fetching data:', error.message);
    }
};
    
export async function getTeamsAndLeagueData() {

    const data = await fetchStandings()
    if (!data) return

    const leagueData = data.fantasy_content.league[0]

    const teams = data.fantasy_content.league[1]?.standings[0]?.teams;
    const standingsTeams = Object.keys(teams).map(teamKey => teams[teamKey].team).filter(team => team)

    const teamsData: Team[] = standingsTeams.map((team) => {
        const propzero = team[0].reduce((accumulator: any, current: any) => {
            if (current) {
                return { ...accumulator, ...current }
            }
        }, {})
        return { ...propzero, ...team[1], ...team[2] }
    })

    return {leagueData, teamsData}
}

export async function getMatchupsData() {
    return fetchMatchupsData().then(data => {
        if (!data) return

        function extractTeam(teamWrapper: any) {
            const team = teamWrapper.team;
            const propzero = team[0].reduce((accumulator: any, current: any) => {
                if (current) {
                    return { ...accumulator, ...current }
                }
            }, {})
            const {name, team_logos, managers} = propzero

            return { name, logo: team_logos[0].team_logo.url, manager: managers[0].manager.nickname, ...team[1] }
        }

        const dataObjects = filterOnlyValidObjects(Object.values(data.fantasy_content.league[1].scoreboard[0].matchups))
        const simpleData = dataObjects.map((matchup: any) => {
            
            return ({
            is_matchup_of_the_week: matchup.matchup.is_matchup_of_the_week,
            teams: filterOnlyValidObjects(Object.values(matchup.matchup[0].teams)).map((teamWrapper: any) => extractTeam(teamWrapper))
        })})

        return simpleData
    })

}

