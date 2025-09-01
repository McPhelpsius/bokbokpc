import type { League } from "."

export type StandingsResponse = {
    fantasy_content: {
    "xml:lang": string
    "yahoo:uri": string
    league : [
        League
    ]
}}

export type StandingsResponseLeague = {
    league_key: string
        league_id: string
        name: string
        url: string
        logo_url: string
        draft_status: string
        num_teams: number
        edit_key: string
        weekly_deadline: string
        league_update_timestamp: string | null,
        scoring_type: string
        league_type: string
        renew: string
        renewed: string
        felo_tier: string
        matchup_week: 1,
        iris_group_chat_id: string
        allow_add_to_dl_extra_pos: number,
        is_pro_league: string
        is_cash_league: string
        current_week: number,
        start_week: string
        start_date: string
        end_week: string
        end_date: string
        is_plus_league: string
        game_code: string
        season: string
}