import { initializeApp } from 'firebase/app';
import { getDatabase} from 'firebase/database';

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