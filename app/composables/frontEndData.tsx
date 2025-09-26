import { type Team } from '../types';
import {
    fetchLeagueData,
    fetchMatchupsData,
    fetchIndividualTeamData,
    fetchIndividualTeamStats,
    fetchIndividualTeamMatchups,
    fetchIndividualTeamRoster
} from './useYahooApi';

import {
    eliminateEmptyValues,
    filterOnlyValidObjects
} from './useFormatYahooData';
import type { Player } from '../components/TeamStats/types';

    
export async function getTeamsAndLeagueData() {

    try {
        console.log('Fetching Yahoo games data...');
        const data = await fetchLeagueData();
        if (!data) throw new Error('No data returned from fetchLeagueData');

        return { leagueData: data.leagueData, teamsData: data.teamsData }
    } catch (error: any) {
        console.error('Error fetching data:', error.message);
    }    
}

export async function getMatchupsData() {
    return fetchMatchupsData().then(data => {
        if (!data) return

        return data
    })

}

export function getTeamData(teamId: number) {
    return fetchIndividualTeamData(teamId).then(data => {
        if (!data) return
        const team = data.fantasy_content.team;
        const teamWithValidValues = eliminateEmptyValues(team[0])
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
        const playersFlattenedArray = filterOnlyValidObjects(Object.values(team[1].roster[0].players)).map(player => ({...eliminateEmptyValues(player?.player[0]), ...player.player[1]}))
        return playersFlattenedArray;
    })
}

