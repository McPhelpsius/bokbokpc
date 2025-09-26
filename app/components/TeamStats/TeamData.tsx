import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import {
    getTeamData,
} from '../../services/frontEndData'

export const TeamData: React.FC = () => {
    const {id} = useParams();
    const [teamData, setTeamData] = useState(null)
    
    useEffect(() => {
        if(!teamData) {
            getTeamData(Number(id)).then(data => {
                console.log('team Data', data);
                setTeamData(data)
            })
        }
        
    })
    
   return (
   <section>
    <img src={teamData?.team_logos[0]?.team_logo.url} alt="" />
       <h2>{teamData?.name}</h2>
       <pre>{JSON.stringify(teamData, null, 2)}</pre>
   </section>
   )
}