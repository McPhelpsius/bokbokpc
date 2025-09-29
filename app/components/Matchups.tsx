'use client';

import React from 'react'
import type { Matchup } from '../types'

export const Matchups: React.FC<{matchups: Matchup[] | null}> = (props) => {
    
   return (
   <section>
       <h2>Matchups</h2>
        {props.matchups?.map((matchup)=>
            <h3 key={matchup.teams[0].name} className="matchups-display">
                <img src={matchup.teams[0].logo}/> {matchup.teams[0].name} vs {matchup.teams[1].name}<img src={matchup.teams[1].logo}/>
            </h3>
        )}
   </section>
   )
}