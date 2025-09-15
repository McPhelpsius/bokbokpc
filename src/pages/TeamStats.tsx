import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'

export const TeamStats: React.FC = () => {
    const {id} = useParams();
    
    useEffect(() => {
        console.log('something', id);
    })
    
   return (
   <section>
       <h2>Matchups</h2>
        {/* {props.matchups?.map((matchup)=>
            <h3 className="matchups-display">
                <img src={matchup.teams[0].logo}/> {matchup.teams[0].name} vs {matchup.teams[1].name}<img src={matchup.teams[1].logo}/>
            </h3>
        )} */}
   </section>
   )
}