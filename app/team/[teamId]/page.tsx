import {Context, use} from 'react'

// import {TeamStats} from '../components/TeamStats/TeamStats'
import {TeamMatchups} from '../../components/TeamStats/TeamMatchups'
// import {TeamRoster} from '../../components/TeamStats/TeamRoster'
// import {TeamData} from '../components/TeamStats/TeamData'

export default function Team ({searchParams}: {searchParams: Context<{teamId?: string}>}) {
    const params = use(searchParams) as {access_token?: string, refresh_token?: string};
    const teamId = params.teamId ? parseInt(params.teamId) : null;
    
   return (
   <section>
    {/* <TeamData />
    <TeamStats />
    {/* <TeamRoster teamId={teamId}/> */}
    <TeamMatchups teamId={teamId} />
   </section>
   )
}