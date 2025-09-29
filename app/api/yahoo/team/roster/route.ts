import { NextRequest, NextResponse } from "next/server";
import { filterOnlyValidObjects } from '../../../../composables/useFormatYahooData';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const accessToken = searchParams.get('access_token');
    

	if (!accessToken) return NextResponse.json({ error: 'Missing access_token' }, { status: 400 });
	try {
		const url = `https://fantasysports.yahooapis.com/fantasy/v2/team/461.l.146891.t.${req.query.teamId}//roster?format=json`;
		const response = await fetch(url, {
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
		});

		const team = response.json().then((data) => data. fantasy_content.team);
		const playersFlattenedArray = filterOnlyValidObjects(Object.values(team[1].roster[0].players)).map(player => ({...eliminateEmptyValues(player?.player[0]), ...player.player[1]}))
    
		return NextResponse.json(playersFlattenedArray, { status: 200 });
	} catch (err) {
		return NextResponse.json({ error: err.message, details: err.response?.data }, { status: 500 })
	}
}