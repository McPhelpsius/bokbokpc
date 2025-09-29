import React, { useEffect, useState } from 'react'
import {
    getTeamStats
} from '../../composables/frontEndData'

export const TeamStats: React.FC<{teamId: string}> = (props) => {
    const [teamStats, setTeamStats] = useState(null)
    
    useEffect(() => {
        if(!teamStats) {
            getTeamStats(Number(props.teamId)).then(data => {
                console.log('team stats', data);
                setTeamStats(data)
            })
        }
        
    })
    
   return (
   <section>
       <h2>Stats</h2>
       <pre>{JSON.stringify(teamStats, null, 2)}</pre>
   </section>
   )
}