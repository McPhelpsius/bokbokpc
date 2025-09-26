export interface Player {
    player_key:                  string;
    player_id:                   string;
    name:                        Name;
    url:                         string;
    editorial_player_key:        string;
    editorial_team_key:          string;
    editorial_team_full_name:    string;
    editorial_team_abbr:         string;
    editorial_team_url:          string;
    bye_weeks:                   ByeWeeks;
    is_keeper:                   IsKeeper;
    uniform_number:              string;
    display_position:            string;
    headshot:                    Headshot;
    image_url:                   string;
    is_undroppable:              string;
    position_type:               string;
    primary_position:            string;
    eligible_positions:          EligiblePosition[];
    eligible_positions_to_add:   any[];
    has_player_notes:            number;
    player_notes_last_timestamp: number;
    selected_position:           SelectedPosition[];
}

export interface ByeWeeks {
    week: string;
}

export interface EligiblePosition {
    position: string;
}

export interface Headshot {
    url:  string;
    size: string;
}

export interface IsKeeper {
    status: boolean;
    cost:   boolean;
    kept:   boolean;
}

export interface Name {
    full:        string;
    first:       string;
    last:        string;
    ascii_first: string;
    ascii_last:  string;
}

export interface SelectedPosition {
    coverage_type?: string;
    week?:          string;
    position?:      string;
    is_flex?:       number;
}
