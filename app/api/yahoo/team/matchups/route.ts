import { NextRequest, NextResponse } from 'next/server';
import { filterOnlyValidObjects } from '../../../../composables/useFormatYahooData';
import type { Matchup } from  '../../../..//types'

export async function GET(request: NextRequest): Promise<Matchup[] | NextResponse> {

const { searchParams } = new URL(request.url);
  const accessToken = searchParams.get('access_token');
	if (!accessToken) return NextResponse.json({ error: 'Missing access_token' }, { status: 400 })
	try {
		const url = `https://fantasysports.yahooapis.com/fantasy/v2/team/461.l.146891.t.${req.query.teamId}/matchups?format=json`;
		const response = await fetch(url, {
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
		});
		
		const team = response.json().then((data) => data. fantasy_content.team);
		const matchupsFlattenedArray = filterOnlyValidObjects(Object.values(team[1].matchups)).map(matchup => matchup?.matchup)

		return NextResponse.json(matchupsFlattenedArray, { status: 200 });
	} catch (err) {
    return NextResponse.json({ error: err.message, details: err.response?.data }, { status: 500 })

  }

}
