import {ref, push, update, get, DatabaseReference} from 'firebase/database';
import {database} from './FirebaseCredentials'

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
}


/**
 * Function to write data to Firebase Database
 * @param {string} path - Path where the data should be written in the database. IE userDataPath & gameDataPath
 * @param {Object} data - The data to be written to the given path. IE userData & gameData
 * @throws {Error} - Throws an error if there is an issue while updating or retrieving an entry from the database.
 */
function writeDataToDatabase(ref: DatabaseReference, data: any): void{
  push(ref, data)
    .then(() => {
      console.log(`Data written successfully to ${ref}`);
    })
    .catch((error) => {
      console.error(`Error writing data to ${ref}:`, error);
    });
};

/**
 * Function that finds a user using their object ID, then updates their username in the Firebase database
 * @param {string} objectId - The objectID of the user that you are looking for
 * @param {string} username - The username to replace the current username with
 * @param {boolean} print - Variable to determine if the program should print the data received to the console (true prints, false does not)
 * @returns {Promise<Object|null>} - Returns the updated user data, or null if not found or an error occurs
 * @throws {Error} - Throws an error if there is an issue while updating the username or retrieving user data from the database.
 */
async function updateUsername(objectId: string, username: string, print: boolean): Promise<Object | null> {
  try {
    const userData = await updateUserProperty(objectId, 'username', username);

    if (userData) {
      if (print) {
        console.log("Updated user data:", userData);  // Print the updated user data if print is true
      }
      return userData;
    } else {
      console.log(`No user found with ID: ${objectId}`);
      return null;  // Return null if no user data is found
    }
  } catch (error) {
    console.error("Error handling user data:", error);
    return null;  // Return null on error
  }
}

async function updateEmail(objectId: string, email: string, print: boolean): Promise<Object | null> {
  try {
    const userData = await updateUserProperty(objectId, 'email', email);

    if (userData) {
      if (print) {
        console.log("Updated user data:", userData);  // Print the updated user data if print is true
      }
      return userData;
    } else {
      console.log(`No user found with ID: ${objectId}`);
      return null;  // Return null if no user data is found
    }
  } catch (error) {
    console.error("Error handling user data:", error);
    return null;  // Return null on error
  }
}

async function updatePassword(objectId: string, password: string, print: boolean): Promise<Object | null> {
  try {
    const userData = await updateUserProperty(objectId, 'password', password);

    if (userData) {
      if (print) {
        console.log("Updated user data:", userData);  // Print the updated user data if print is true
      }
      return userData;
    } else {
      console.log(`No user found with ID: ${objectId}`);
      return null;  // Return null if no user data is found
    }
  } catch (error) {
    console.error("Error handling user data:", error);
    return null;  // Return null on error
  }
}

async function updateWins(objectId: string, wins: number, print: boolean): Promise<Object | null> {
  try {
    const userData = await updateUserProperty(objectId, 'wins', wins);

    if (userData) {
      if (print) {
        console.log("Updated user data:", userData);  // Print the updated user data if print is true
      }
      return userData;
    } else {
      console.log(`No user found with ID: ${objectId}`);
      return null;  // Return null if no user data is found
    }
  } catch (error) {
    console.error("Error handling user data:", error);
    return null;  // Return null on error
  }
}

async function updateLoss(objectId: string, losses: number, print: boolean): Promise<Object | null> {
  try {
    const userData = await updateUserProperty(objectId, 'losses', losses);

    if (userData) {
      if (print) {
        console.log("Updated user data:", userData);  // Print the updated user data if print is true
      }
      return userData;
    } else {
      console.log(`No user found with ID: ${objectId}`);
      return null;  // Return null if no user data is found
    }
  } catch (error) {
    console.error("Error handling user data:", error);
    return null;  // Return null on error
  }
}

async function updateTotalScore(objectId: string, total_score: number, print: boolean): Promise<Object | null> {
  try {
    const userData = await updateUserProperty(objectId, 'total_score', total_score);

    if (userData) {
      if (print) {
        console.log("Updated user data:", userData);  // Print the updated user data if print is true
      }
      return userData;
    } else {
      console.log(`No user found with ID: ${objectId}`);
      return null;  // Return null if no user data is found
    }
  } catch (error) {
    console.error("Error handling user data:", error);
    return null;  // Return null on error
  }
}

async function updateProfilePicture(objectId: string, profile_picture: string, print: boolean): Promise<Object | null> {
  try {
    const userData = await updateUserProperty(objectId, 'profile_picture', profile_picture);

    if (userData) {
      if (print) {
        console.log("Updated user data:", userData);  // Print the updated user data if print is true
      }
      return userData;
    } else {
      console.log(`No user found with ID: ${objectId}`);
      return null;  // Return null if no user data is found
    }
  } catch (error) {
    console.error("Error handling user data:", error);
    return null;  // Return null on error
  }
}

async function updateStatus(objectId: string, status: boolean, print: boolean): Promise<Object | null> {
  try {
    const userData = await updateUserProperty(objectId, 'status', status);

    if (userData) {
      if (print) {
        console.log("Updated user data:", userData);  // Print the updated user data if print is true
      }
      return userData;
    } else {
      console.log(`No user found with ID: ${objectId}`);
      return null;  // Return null if no user data is found
    }
  } catch (error) {
    console.error("Error handling user data:", error);
    return null;  // Return null on error
  }
}


/**
 * Function to update a user property
 * @param {string} objectId - The objectID of the user whose property is to be updated. This is typically the unique identifier for the user in the Firebase database.
 * @param {string} property - The property of the user object to update. This is the name of the field (e.g., 'username', 'email', 'wins', etc.).
 * @param {string | number | boolean} newValue - The new value for the property. This value can be of type `string`, `number`, or `boolean`, depending on the property being updated.
 * @returns {Promise<any>} - A promise that resolves to the updated user data from the database after the property has been updated.
 * @throws {Error} - Throws an error if the update operation fails or if an error occurs during the retrieval of updated data.
 */
async function updateUserProperty(objectId: string, property: string, newValue: string | number | boolean): Promise<any> {
  // Use the correct reference from the initialized database object
  const userRef = ref(database, 'users/' + objectId);

  try {
    // Perform the update
    await update(userRef, {
      [property]: newValue
    });

    // Get and return the updated user data
    const snapshot = await get(userRef);
    const updatedUserData = snapshot.val();

    return updatedUserData;
  } catch (error) {
    console.error("Error updating user property:", error);
    throw new Error("Failed to update user property");
  }
}

/**
 * Function to print the details of a given object (typically user data) to the console in a readable format.
 * It recursively traverses the object, printing each key-value pair in a hierarchical structure.
 * This is useful for inspecting deeply nested data or objects with multiple properties.
 *
 * @param {Record<string, any>} obj - The object containing data to be printed (e.g., user data retrieved from Firebase).
 * @param {string} [indent=''] - The indentation string used to format the printed output. It is used to represent the depth of the nested properties for better readability.
 * It starts as an empty string and is added to as the recursion goes deeper.
 */
function printUserQueryResults(obj: Record<string, any>, indent = '') {
  if (typeof obj === 'object' && obj !== null) {
    // Loop through each key in the object
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        // If the property is an object, call the function recursively with increased indentation
        if (typeof obj[key] === 'object' && obj[key] !== null) {
          console.log(`${indent}${key}:`);
          printUserQueryResults(obj[key], indent + '  ');  // Recursively print nested properties
        } else {
          // Otherwise, print the key-value pair
          console.log(`${indent}${key}: ${obj[key]}`);
        }
      }
    }
  }
}