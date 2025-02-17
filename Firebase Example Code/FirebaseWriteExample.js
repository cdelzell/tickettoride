import firebase from "firebase/app";
import "firebase/database";

// Firebase Credentials, do not post or share, Ty likes not owing google money
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  databaseURL: "YOUR_DATABASE_URL",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

firebase.initializeApp(firebaseConfig);

//Database location
const database = firebase.database();

// Setting path to user data
const userDataRefLocation = database.ref("users/1");
const gameDataRefLocation = database.ref("activeGames/1");

// Example user data to write
const userData = {
  username: "john_doe",
  email: "john.doe@example.com",
  passowrd: "Password123",
  wins: 0,
  loss: 0,
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
  map_status: mapStatus,
  player_hand_1: playerHand,
  player_hand_2: playerHand,
  player_hand_3: playerHand,
  player_hand_4: playerHand,
  draw_cards: drawableCards

}

userRef.set(userData)
  .then(() => {
    console.log("Data written successfully!");
  })
  .catch((error) => {
    console.error("Error writing data: ", error);
  });

  userRef.set(gameData)
  .then(() => {
    console.log("Data written successfully!");
  })
  .catch((error) => {
    console.error("Error writing data: ", error);
  });
