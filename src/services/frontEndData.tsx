import { type Team } from '../types';
import { fetchLeagueData } from './yahooApi';


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
        const propzero = team[0].reduce((accumulator, current) => {
            if (current) {
                return { ...accumulator, ...current }
            }
        }, {})
        return { ...propzero, ...team[1], ...team[2] }
    })

    return {leagueData, teamsData}
}

