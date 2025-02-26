import { initializeApp } from 'firebase/app';
import { getDatabase, ref, push } from 'firebase/database';

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
  username: "john_doe",
  email: "john.doe@example.com",
  passowrd: "Password123",
  wins: 0,
  losses: 0,
  total_score: 0,
  profile_picture: "url/to/profile_pic.jpg",
  status: true
};

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
  game_ID: "57322",
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

writeDataToDatabase(userDataPath, userData);
writeDataToDatabase(gameDataPath, gameData);