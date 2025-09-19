import React from 'react'
import { useParams } from 'react-router-dom'

import {TeamStats} from '../components/TeamStats/TeamStats'
import {TeamMatchups} from '../components/TeamStats/TeamMatchups'
import {TeamRoster} from '../components/TeamStats/TeamRoster'
import {TeamData} from '../components/TeamStats/TeamData'

export const Team: React.FC = () => {
    const {id} = useParams();
    
    
   return (
   <section>
    {/* <TeamData />
    <TeamStats />
    <TeamMatchups /> */}
    <TeamRoster />
   </section>
   )
}