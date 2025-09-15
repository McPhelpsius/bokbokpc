import React from 'react'

export const TeamStats: React.FC<{teamId: number | null}> = (props) => {
    
   return (
   <section>
       <h2>Matchups</h2>
        {props.matchups?.map((matchup)=>
            <h3 className="matchups-display">
                <img src={matchup.teams[0].logo}/> {matchup.teams[0].name} vs {matchup.teams[1].name}<img src={matchup.teams[1].logo}/>
            </h3>
        )}
   </section>
   )
}