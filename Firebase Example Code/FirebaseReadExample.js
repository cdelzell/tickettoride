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
const userDataPath = database.ref("users/1");
const gameDataPath = database.ref("activeGames/1");


