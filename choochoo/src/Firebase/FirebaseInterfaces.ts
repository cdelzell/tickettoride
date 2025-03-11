export interface UserData {
    username: string;                       // String
    email: string;                          // String
    password: string;                       // String
    wins: number;                           // Int
    losses: number;                           // Int
    total_score: number;                    // Int
    profile_picture: string;                // String
    status: boolean;                        // Bool
    active_game_id: string | null;          // String or null
}

//GAME OBJECT INTERFACES
export interface Player {
  player_ID: string;
  hand: PlayerHand;
  claimed_route: [string, string][];
  score: number;
}

export interface PlayerHand {
  black_trains: number;
  blue_trains: number;
  brown_trains: number;
  green_trains: number;
  purple_trains: number;
  red_trains: number;
  white_trains: number;
  wild_trains: number;
  yellow_trains: number;
  destination_card_IDs: number[];
}

export interface GameData {
  game_ID: string;
  current_turn: number;
  player_one: Player;
  player_two: Player;
  player_three: Player;
  player_four: Player;
  destination_cars_drawn: number[];
}