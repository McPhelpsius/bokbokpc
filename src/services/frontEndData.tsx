import { type Team } from '../types';
import {
    fetchLeagueData,
    fetchMatchupsData,
    fetchIndividualTeamData,
    fetchIndividualTeamStats,
    fetchIndividualTeamMatchups,
    fetchIndividualTeamRoster
} from './yahooApi';

import {
    useEliminateEmptyValues,
    filterOnlyValidObjects
} from '../composables/useFormatYahooData';
import type { Player } from '../components/TeamStats/types';

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

export function getTeamData(teamId: number) {
    return fetchIndividualTeamData(teamId).then(data => {
        if (!data) return
        const team = data.fantasy_content.team;
        const teamWithValidValues = useEliminateEmptyValues(team[0])
        return teamWithValidValues
    })
}

export function getTeamStats(teamId: number) {
    return fetchIndividualTeamStats(teamId).then(data => {
        if (!data) return
        return data.fantasy_content.team[1];
    })
}

export function getTeamMatchups(teamId: number) {
    return fetchIndividualTeamMatchups(teamId).then(data => {
        if (!data) return
        const team = data.fantasy_content.team;
        const matchupsFlattenedArray = filterOnlyValidObjects(Object.values(team[1].matchups)).map(matchup => matchup?.matchup)
        return matchupsFlattenedArray
    })
}
export async function getTeamRoster(teamId: number): Promise<Player[]>{
    return fetchIndividualTeamRoster(teamId).then(data => {
        if (!data) return
        const team = data.fantasy_content.team;    
        const playersFlattenedArray = filterOnlyValidObjects(Object.values(team[1].roster[0].players)).map(player => ({...useEliminateEmptyValues(player?.player[0]), ...player.player[1]}))
        return playersFlattenedArray;
    })
}

