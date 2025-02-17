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

const gameData = {
}

userRef.set(userData)
  .then(() => {
    console.log("Data written successfully!");
  })
  .catch((error) => {
    console.error("Error writing data: ", error);
  });
