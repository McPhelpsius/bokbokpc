'use client';

import React from 'react'
import type { Matchup } from '../types'
import styles from './matchups.module.css'

export const Matchups: React.FC<{matchups: Matchup[] | null}> = (props) => {
    
   return (
   <section>
        {props.matchups?.map((matchup)=>
            <a href={`matchup/${matchup.teams[0].team_key}`} key={matchup.teams[0].name} className={styles.matchupDisplay}>
                <img src={matchup.teams[0].logo}/> 
                <p>
                    <span>
                        {matchup.teams[0].name}
                    </span>
                    <span className={styles.vs}>
                        vs
                    </span>
                    <span>
                        {matchup.teams[1].name}
                    </span>
                </p>
                <img src={matchup.teams[1].logo}/>
            </a>
        )}
   </section>
   )
}