import { NextRequest, NextResponse } from 'next/server';
import { Team } from '../../../types';
import {eliminateEmptyValues} from '../../../composables/useFormatYahooData';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const accessToken = searchParams.get('access_token');
    
  if (!accessToken) return NextResponse.json({ error: 'Missing access_token' }, { status: 400 })

  try {
    // Yahoo Fantasy API returns XML by default, but you can request JSON
    const url = 'https://fantasysports.yahooapis.com/fantasy/v2/league/461.l.146891/standings?format=json';
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }).then(data => data.json());

    const leagueData = response.fantasy_content.league[0]
    const teams = response.fantasy_content.league[1]?.standings[0]?.teams;
    const standingsTeams = Object.keys(teams).map(teamKey => teams[teamKey].team).filter(team => team)

    const teamsData: Team[] = standingsTeams.map((team) => {
        const propzero = eliminateEmptyValues(team[0])
        return { ...propzero, ...team[1], ...team[2] }
    })
    return NextResponse.json({leagueData, teamsData}, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message, details: err.response?.data }, { status: 500 })

  }
}


