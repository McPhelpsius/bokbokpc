export type Team = {
  team_key: string
  team_id: string
  name: string
  url: string
  team_logos: [
    {
      team_logo: {
        size: string
        url: string
      }
    }
  ],
  previous_season_team_rank: number,
  waiver_priority: number,
  number_of_moves: number,
  number_of_trades: number,
  roster_adds: {
    coverage_type: string
    coverage_value: 1,
    value: string
  },
  league_scoring_type: string
  has_draft_grade: number,
  draft_grade: string
  draft_recap_url: string
  managers: [
    {
      manager: {
        manager_id: string
        nickname: string
        guid: string
        is_commissioner: string
        image_url: string
        felo_score: string
        felo_tier: string
      }
    }
  ],
  team_points: {
    coverage_type: string
    season: string
    total: string
  },
  team_standings: {
    rank: string
    outcome_totals: {
      wins: number,
      losses: number,
      ties: number,
      percentage: string
    },
    points_for: string
    points_against: number
  }
}