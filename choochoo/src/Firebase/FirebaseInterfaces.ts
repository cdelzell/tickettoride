import GameBoard from "../backend/game-board";

import Player from "../backend/player";


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


//--Whether or not the game is over (boolean)
  //--The current player
  //--The faceup cards
  //--The state of the draw pile (number of train cards of each color)
  //--The state of the discard pile (number of train cards of each color)
  //--The state of the destination card draw pile (which ones are left)
  //--game-boards' board-graphs' routes' claimers
  //--Every player's train cards
  //--Every player's destination cards
  //--Every player's trains left
  //--The index of the current player