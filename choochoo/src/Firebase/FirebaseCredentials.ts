import { initializeApp } from 'firebase/app';
import { getDatabase, ref, push, DatabaseReference } from 'firebase/database';

// Firebase Credentials, do not post or share, Ty likes not owing google money
export const firebaseConfig = {
  apiKey: "AIzaSyCno9yVTIHQUzvciQs5tnjvWSnX-JewSYQ",
  authDomain: "the-conductors.firebaseapp.com",
  databaseURL: "https://the-conductors-default-rtdb.firebaseio.com",
  projectId: "the-conductors",
  storageBucket: "the-conductors.firebasestorage.app",
  messagingSenderId: "552591104221",
  appId: "1:552591104221:web:12d6209a67fbb26caf2334",
  measurementId: "G-VZ49VGKG0X"
};

export const app = initializeApp(firebaseConfig);

//Database location
export const database = getDatabase(app);

// Setting path to user data
export const userDataPath: DatabaseReference = ref(database, "users");
export const gameDataPath: DatabaseReference = ref(database, "activeGames");

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