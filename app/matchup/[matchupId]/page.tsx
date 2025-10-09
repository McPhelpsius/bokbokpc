'use client'

import { use, useState, useEffect, Suspense } from 'react';
import { fetchMatchupsData } from '../../composables/useYahooApi';
import { Matchup } from '../../types';

export default function Team ({ params }: { params: { matchupId: string } }) {
  const { matchupId } = use(params);

  const [matchup, setMatchup] = useState<Matchup>({} as Matchup);

  useEffect(() => {
      const storedMatchups = localStorage.getItem("matchups")
      
      if(!storedMatchups) {
        fetchMatchupsData().then(data => {
          if(!data) return
          localStorage.setItem("matchups", JSON.stringify(data))
          localStorage.setItem("matchupDate", JSON.stringify(new Date().toJSON()))
console.log(data)
          setMatchup(data.find((m: Matchup) => m.teams[0].team_key === matchupId || m.teams[1].team_key === matchupId) || [])
        })
      }
      else {
        const storedMatchupsObject = JSON.parse(storedMatchups)
        const foundMatchup = storedMatchupsObject.find((m: Matchup) => 
          {
            console.log(m.teams[0].team_key === matchupId || m.teams[1].team_key === matchupId)
            console.log(m)
            return m
          })
        setMatchup(foundMatchup)
      }
      console.log(matchup)
    }, [])

   return (
    <Suspense fallback={<div>Loading...</div>}>
   <section>
     <div key={matchup?.teams[0].name}>

          <h1>{matchup?.teams[0].name} vs {matchup?.teams[1].name}</h1>
        </div>
   </section>
   </Suspense>
   )
}