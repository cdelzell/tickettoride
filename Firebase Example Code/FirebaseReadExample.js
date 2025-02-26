import firebase from "firebase/app";
import "firebase/database";

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

firebase.initializeApp(firebaseConfig);

//Database location
const database = firebase.database();

// Setting path to user data
const userDataPath = database.ref("users");
const gameDataPath = database.ref("activeGames");

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

function findUserByUsername(username){
  findUserByField('username', username);
}
function findUserByEmail(email){
  findUserByField('email', email);
}
// Should Probably not ever use this func or encrpyt to be not plain text
function findUserByPassword(password){
  findUserByField('password', password);
}
function findUserByWins(wins){
  findUserByField('wins', wins);
}
function findUserByLosses(losses){
  findUserByField('losses', losses);
}
function findUserByTotalScore(total_score){
  findUserByField('total_score', total_score);
}
function findUserByProfilePicture(profile_picture){
  findUserByField('profile_picture', profile_picture);
}
function findUserByStatus(status){
  findUserByField('status', status);
}

function findUserByField(field, value) {

  // Query for the user by the given field and value
  userDataPath.orderByChild(field).equalTo(value).once('value', snapshot => {
    if (snapshot.exists()) {
      const usersData = snapshot.val();
      const userIds = Object.keys(usersData); // Get the keys (user IDs)

      console.log(`Found ${userIds.length} user(s) with ${field}:`, value);
      
      // Loop through each matching user and log their data
      userIds.forEach(userId => {
        console.log(`User ID: ${userId}, Data:`, usersData[userId]);
      });
    } else {
      console.log(`No user found with ${field}:`, value);
    }
  });
}

function findGameByGameID(gameID) {
  // Query for the user by the given field and value
  gameDataPath.orderByChild('game_ID').equalTo(gameID).once('value', snapshot => {
    if (snapshot.exists()) {
      const gameData = snapshot.val();
      console.log(`Game found with game_ID ${gameID}:`, gameData);
    } else {
      console.log(`No game found with game_ID: ${gameID}`);
    }
  });
}



