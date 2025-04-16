import { ref, push, update, get, DatabaseReference } from "firebase/database";
import { gameDataPath } from "./FirebaseCredentials";
import GameRunner from "../backend/game-runner";

/**
 * Function to write data to Firebase Database
 * @param {Object} data - The data to be written to the games in the database. IE userData & gameData
 * @throws {Error} - Throws an error if there is an issue while updating or retrieving an entry from the database.
 */
export function writeGameToDatabase(data: GameRunner): void {
  push(gameDataPath, data)
    .then(() => {
      console.log(`Data written successfully to ${ref}`);
    })
    .catch((error) => {
      console.error(`Error writing data to ${ref}:`, error);
    });
}
