import { initializeApp } from "firebase/app";
import { getDatabase, ref, push, DatabaseReference } from "firebase/database";

// Firebase Credentials, linked to local .env file
export const firebaseConfig = {
  apiKey: process.env.apiKey,
  authDomain: process.env.authDomain,
  databaseURL: process.env.databaseURL,
  projectId: process.env.projectID,
  storageBucket: process.env.storageBucket,
  messagingSenderId: process.env.messagingSenderId,
  appId: process.env.appId,
  measurementId: process.env.measurementId,
};

export const app = initializeApp(firebaseConfig);

//Database location
export const database = getDatabase(app);

// Setting path to user data
export const userDataPath: DatabaseReference = ref(database, "users/");
export const gameDataPath: DatabaseReference = ref(database, "activeGames/");
export const lobbyDataPath: DatabaseReference = ref(database, "lobbies/");
