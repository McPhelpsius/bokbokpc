'use client';
import {fetchIndividualTeamMatchups} from '../../composables/useYahooApi'
import React, { useEffect, useState } from 'react'




export const TeamMatchups: React.FC<{teamId: string}> = (props) => {
    const [teamMatchups, setTeamMatchups] = useState(null)
    
    useEffect(() => {
        if(!teamMatchups) {
            fetchIndividualTeamMatchups(Number(props.teamId)).then(data => {
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