import { NextRequest, NextResponse } from "next/server";
import { filterOnlyValidObjects, eliminateEmptyValues } from '../../../../composables/useFormatYahooData';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const accessToken = searchParams.get('access_token');
  const teamId = searchParams.get('teamId');

	if (!accessToken) return NextResponse.json({ error: 'Missing access_token' }, { status: 400 });
	if (!teamId) return NextResponse.json({ error: 'Missing teamId' }, { status: 400 });
	try {
		const url = `https://fantasysports.yahooapis.com/fantasy/v2/team/${teamId}/roster?format=json`;
		const response = await fetch(url, {
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
		});

		const team = await response.json().then((data) => data.fantasy_content.team);
		const playersFlattenedArray = filterOnlyValidObjects(Object.values(team[1].roster[0].players))
			.map(player => ({...eliminateEmptyValues(player?.player[0]), ...player.player[1]}))
			.map(player => ({
				...player,
				selected_position: {...player.selected_position.map(pos => pos).reduce((acc, curr) => ({...acc, ...curr}), {})}
			}));
    
		return NextResponse.json(playersFlattenedArray, { status: 200 });
	} catch (err) {
		return NextResponse.json({ error: err.message, details: err.response?.data }, { status: 500 })
	}
}