import { ref, push, update, get, DatabaseReference } from 'firebase/database';
import { gameDataPath } from './FirebaseCredentials'

//GAME OBJECT INTERFACES
interface Player {
  player_ID: string;
  hand: PlayerHand;
  claimed_route: [string, string][];
  score: number;
}

interface PlayerHand {
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

interface Game {
  game_ID: string;
  player_one: Player;
  player_two: Player;
  player_three: Player;
  player_four: Player;
  destination_cars_drawn: number[];
}

/**
 * Function to write data to Firebase Database
 * @param {Object} data - The data to be written to the games in the database. IE userData & gameData
 * @throws {Error} - Throws an error if there is an issue while updating or retrieving an entry from the database.
 */
function writeGameToDatabase(data: Game): void {
  push(gameDataPath, data)
    .then(() => {
      console.log(`Data written successfully to ${ref}`);
    })
    .catch((error) => {
      console.error(`Error writing data to ${ref}:`, error);
    });
};