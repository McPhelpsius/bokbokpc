import { NextRequest, NextResponse } from 'next/server';
import { filterOnlyValidObjects } from '../../../composables/useFormatYahooData';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const accessToken = searchParams.get('access_token');
    
  if (!accessToken) return NextResponse.json({ error: 'Missing access_token' }, { status: 400 })

  try {
    // Yahoo Fantasy API returns XML by default, but you can request JSON
    const url = 'https://fantasysports.yahooapis.com/fantasy/v2/league/461.l.146891/scoreboard?format=json';
		const response = await fetch(url, {
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
		}).then(data => data.json()) as {fantasy_content: { league: Array<any>}} ;
    
    function extractTeam(teamWrapper: any) {
      const team = teamWrapper.team;
      const propzero = team[0].reduce((accumulator: any, current: any) => {
          if (current) {
              return { ...accumulator, ...current }
          }
      }, {})
      const {name, team_logos, managers} = propzero

      return   { name, logo: team_logos[0].team_logo.url, manager: managers[0].manager.nickname, ...team[1] }
    }

    const dataObjects = filterOnlyValidObjects(Object.values(response.fantasy_content.league[1].scoreboard[0].matchups))
    const simpleData = dataObjects.map((matchup: any) => {
        
        return ({
        is_matchup_of_the_week: matchup.matchup.is_matchup_of_the_week,
        teams: filterOnlyValidObjects(Object.values(matchup.matchup[0].teams)).map((teamWrapper: any) => extractTeam(teamWrapper))
    })})

    return NextResponse.json(simpleData, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message, details: err.response?.data }, { status: 500 })

  }
}
