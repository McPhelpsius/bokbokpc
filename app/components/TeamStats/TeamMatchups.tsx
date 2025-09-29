import React, { useEffect, useState } from 'react'

import {
    fetchIndividualTeamMatchups,
} from '../../composables/useYahooApi';

export const TeamMatchups: React.FC = () => {
    const {id} = useParams();
    const [teamMatchups, setTeamMatchups] = useState(null)
    
    useEffect(() => {
        if(!teamMatchups) {
            fetchIndividualTeamMatchups(Number(id)).then(data => {
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