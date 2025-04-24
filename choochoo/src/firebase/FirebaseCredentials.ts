import { initializeApp } from "firebase/app";
import { getDatabase, ref } from "firebase/database";
import type { DatabaseReference } from "firebase/database";

// Firebase Credentials, linked to local .env file
export const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_DATABASE_URL,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID,
  measurementId: import.meta.env.VITE_MEASUREMENT_ID,
};

export const app = initializeApp(firebaseConfig);

//Database location
export const database = getDatabase(app);

// Setting path to user data
export const userDataPath: DatabaseReference = ref(database, "users/");
export const gameDataPath: DatabaseReference = ref(database, "activeGames/");
export const lobbyDataPath: DatabaseReference = ref(database, "lobbies/");
