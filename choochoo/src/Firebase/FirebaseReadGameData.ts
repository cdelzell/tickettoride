import { ref, query, orderByChild, equalTo, get } from "firebase/database";
import { database, gameDataPath } from './FirebaseCredentials'
import { GameData } from "./FirebaseInterfaces";

export async function checkForChaneInTurn(params:type) {
    
}

/**
 * Function to retrieve the turn number of a game in the Firebase database with a specified gameID 
 * @param {string} gameID - The game ID of the game that you are looking for
 * @param {boolean} print - Variable to determine if the program should print the data received to the console (true prints, false does not)
 */
export async function findTurnByGameID(game_ID: number, print: boolean): Promise<number | null>  {
    try {
      const gameData = await findGameByField('game_ID', game_ID);
  
      if (gameData) {
        const turn = gameData.currentPlayer;  // Extract the 'turn' field
        
        if (print) {
          console.log(`Current Turn: ${turn}`);  // Print the turn if print is true
        }
        
        return turn;  // Return only the turn field
      } else {
        console.log(`No game found with game ID: ${game_ID}`);
        return null;  // Return null if no game data is found
      }
    } catch (error) {
      console.error("Error handling game data:", error);
      return null;  // Return null on error
    }
}


/**
 * Function to search for games in the Firebase database with a specified gameID
 * @param {string} gameID - The game ID of the game that you are looking for
 * @param {boolean} print - Variable to determine if the program should print the data received to the console (true prints, false does not)
 */
export async function findGameByGameID(game_ID: number, print: boolean): Promise<GameData | null>  {
    try {
      const gameData = await findGameByField('game_ID', game_ID);
  
      if (gameData) {
        if (print) {
          printGameQueryResults(gameData);  // Print the game data if print is true
        }
        return gameData;  // Return the resolved data (game data) if found
      } else {
        console.log(`No game found with game ID: ${game_ID}`);
        return null;  // Return null if no game data is found
      }
    } catch (error) {
      console.error("Error handling game data:", error);
      return null;  // Return null on error
    }
}

/**
 * Function to search for a game in the Firebase database by a specific field and value.
 * It queries the "game" database and looks for entries where the specified field matches the given value.
 * The function returns the game data if found, otherwise returns null.
 * 
 * @param {string} field - The field name in the game data to search by (e.g., "gameID", "player1ID", "playerhand").
 * @param {string|number|boolean} value - The value that the specified field should match. This can be a string (e.g., "john_doe"), 
 *                                        a number (e.g., 5), or a boolean (e.g., true/false), depending on the field.
 * @returns {Object|null} The user data matching the given field and value, or null if no matching user is found.
 */
function findGameByField(field: string, value: string | number | boolean): Promise <GameData | null> {
  const gameQuery = query(gameDataPath, orderByChild(field), equalTo(value));

  // Perform the query and return the result
  return get(gameQuery)  // This returns a Promise.
    .then(snapshot => {
      if (snapshot.exists()) {
        return snapshot.val();  // Return the game data from the snapshot if found
      } else {
        console.log(`No game found with ${field}:`, value);
        return null;  // Return null if no data is found
      }
    })
    .catch(error => {
      console.error("Error retrieving data:", error);
      return null;  // Return null on error
    });
}

/**
 * Function to print the details of a given object (typically user data) to the console in a readable format.
 * It recursively traverses the object, printing each key-value pair in a hierarchical structure.
 * This is useful for inspecting deeply nested data or objects with multiple properties.
 *
 * @param {Object} obj - The object containing data to be printed (e.g., user data retrieved from Firebase).
 * @param {string} [indent=''] - The indentation string used to format the printed output. It is used to represent the depth of the nested properties for better readability.
 * It starts as an empty string and is added to as the recursion goes deeper.
 */
function printGameQueryResults(obj: any, indent: string = ''): void {
  if (typeof obj === 'object' && obj !== null) {
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (typeof obj[key] === 'object' && obj[key] !== null) {
          console.log(`${indent}${key}:`);
          printGameQueryResults(obj[key], indent + '  ');
        } else {
          console.log(`${indent}${key}: ${obj[key]}`);
        }
      }
    }
  }
}