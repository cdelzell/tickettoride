import { initializeApp } from 'firebase/app';
import { getDatabase, ref, push, update, get } from 'firebase/database';


// Firebase Credentials, do not post or share, Ty likes not owing google money
const firebaseConfig = {
  apiKey: "AIzaSyCno9yVTIHQUzvciQs5tnjvWSnX-JewSYQ",
  authDomain: "the-conductors.firebaseapp.com",
  databaseURL: "https://the-conductors-default-rtdb.firebaseio.com",
  projectId: "the-conductors",
  storageBucket: "the-conductors.firebasestorage.app",
  messagingSenderId: "552591104221",
  appId: "1:552591104221:web:12d6209a67fbb26caf2334",
  measurementId: "G-VZ49VGKG0X"
};

const app = initializeApp(firebaseConfig);

//Database location
const database = getDatabase(app);

// Setting path to user data
const userDataPath = ref(database, "users");
const gameDataPath = ref(database, "activeGames");

// Example user data to write
const userData = {
  username: "Nacy_Gren",
  email: "john.doe@example.com",
  passowrd: "Password123",
  wins: 0,
  losses: 0,
  total_score: 0,
  profile_picture: "url/to/profile_pic.jpg",
  status: true
};

const player_IDs = {  //Will be firebase Keys
  player1: "",
  player2: "",
  player3: "",
  player4: ""
}

const mapStatus = {
  trains_claimed: "SDASD", // List of object
  train_price: "dSADASD", // List of object
  trains_open: "SDADASD" // List of object
}

const playerHand = {
  card_count: "SDASD", // List of objects
  route_cards: "dSADASD", // List of objects
  score: "SDADASD" // Numerical Value
}

const drawableCards = {
  train_cards: "SDASD", // List of objects
  route_cards: "dSADASD", // List of objects
}

const gameData = {
  game_ID: "232222", // Use as game code for joinning?
  player_IDs: player_IDs,
  map_status: mapStatus,
  player_hand_1: playerHand,
  player_hand_2: playerHand,
  player_hand_3: playerHand,
  player_hand_4: playerHand,
  draw_cards: drawableCards
}

/**
 * Function to write data to Firebase Database
 * @param {string} path - Path where the data should be written in the database. IE userDataPath & gameDataPath
 * @param {Object} data - The data to be written to the given path. IE userData & gameData
 */
function writeDataToDatabase(ref, data){
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
 */
async function updateUsername(objectId, username, print) {
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


/**
 * Function to update a user property
 * @param {string} objectId - The objectID of the user
 * @param {string} property - The property to update
 * @param {string} newValue - The new value for the property
 * @returns {Promise<Object>} - Returns the updated user data
 */
async function updateUserProperty(objectId, property, newValue) {
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
 * @param {Object} obj - The object containing data to be printed (e.g., user data retrieved from Firebase).
 * @param {string} [indent=''] - The indentation string used to format the printed output. It is used to represent the depth of the nested properties for better readability.
 * It starts as an empty string and is added to as the recursion goes deeper.
 */
function printUserQueryResults(obj, indent = '') {
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

const objectId = "-OK3P6udMXA7WPpL6lwD"; // Replace with actual object ID
const newUsername = "YEAH"; // New username to set
const printResults = true; // Set to true to print data to console

updateUsername(objectId, newUsername, printResults);