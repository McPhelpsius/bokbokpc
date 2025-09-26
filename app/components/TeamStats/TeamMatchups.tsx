import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import {
    getTeamMatchups
} from '../../services/frontEndData'

export const TeamMatchups: React.FC = () => {
    const {id} = useParams();
    const [teamMatchups, setTeamMatchups] = useState(null)
    
    useEffect(() => {
        if(!teamMatchups) {
            getTeamMatchups(Number(id)).then(data => {
                console.log('team Matchups', data);
                setTeamMatchups(data)
            })
        }
        
    })
    
   return (
   <section>
       <h2>Matchups</h2>
       <pre>{JSON.stringify(teamMatchups, null, 2)}</pre>
   </section>
   )
}