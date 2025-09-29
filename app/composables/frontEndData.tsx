import { type Team } from '../types';
import {
    fetchLeagueData,
    fetchMatchupsData,
    fetchIndividualTeamData,
    fetchIndividualTeamStats,
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
        if (!data) return null
        
        return data
    })
}

export function getTeamStats(teamId: number) {
    return fetchIndividualTeamStats(teamId).then(data => {
        if (!data) return
        return data.fantasy_content.team[1];
    })
}


