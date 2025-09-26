import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import {
    getTeamStats
} from '../../services/frontEndData'

export const TeamStats: React.FC = () => {
    const {id} = useParams();
    const [teamStats, setTeamStats] = useState(null)
    
    useEffect(() => {
        if(!teamStats) {
            getTeamStats(Number(id)).then(data => {
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