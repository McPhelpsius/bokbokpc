'use client'

import React, { useEffect, useState } from 'react'


import {
    fetchIndividualTeamRoster,
} from '../../composables/useYahooApi';

import './team-stats.scss'

import type { Player } from '../../components/TeamStats/types';

export const TeamRoster: React.FC<{teamId: string}> = (props) => {
    const [teamRoster, setTeamRoster] = useState<Player[] | null>(null)
    const [inactiveTeamRoster, setInactiveTeamRoster] = useState<Player[] | null>(null)
    const [activeTeamRoster, setActiveTeamRoster] = useState<Player[] | null>(null)
    
    useEffect(() => {
        if(!teamRoster) {
         
    fetchIndividualTeamRoster(Number(props.teamId)).then(data => {
        setTeamRoster(data)
        setActiveTeamRoster(data.filter(player => !['BN', 'IR'].includes(player.selected_position[1].position)))
        setInactiveTeamRoster(data.filter(player => ['BN', 'IR'].includes(player.selected_position[1].position)))
    })
  }}, [props.teamId, teamRoster])
    
   return (
   <section>
       <h2>Starting Roster</h2>
       {activeTeamRoster?.map(player => (
        <div className="roster-item" key={player?.player_id}>
          <h3>{player.selected_position[1].position}</h3>
          <img className="player-img" src={player?.image_url} alt={player?.name?.full} />
          <div>
            <a className="player-name" href={player?.url}>{player?.name?.full}</a>,
            <a className="player-team" href={player?.editorial_team_url}>{player.editorial_team_abbr}</a>
          </div>
            
        </div>
       ))}
       <h2>Bench</h2>
       {inactiveTeamRoster?.map(player => (
        <div className="roster-item" key={player?.player_id}>
          <h3>{player.display_position}</h3>
          <img className="player-img" src={player?.image_url} alt={player?.name?.full} />
          <div>
            <a className="player-name" href={player?.url}>{player?.name?.full}</a>,
            <a className="player-team" href={player?.editorial_team_url}>{player.editorial_team_abbr}</a>
          </div>
            
        </div>
       ))}
       <pre>{JSON.stringify(teamRoster, null, 2)}</pre>
   </section>
   )
}