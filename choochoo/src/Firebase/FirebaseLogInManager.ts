import {get, query, equalTo, orderByChild } from 'firebase/database'
import {userDataPath} from './FirebaseCredentials'

async function handleLogIn(username: string, enteredPassword: string): Promise<boolean | null> {
    const userQuery = query(userDataPath, orderByChild('username'), equalTo('username'));

    try {
        const snapshot = await get(userQuery);

        if(snapshot.exists()){
            const userData = snapshot.val();
            const database_password = userData.password;
            if(userData.password === enteredPassword){
                // Call successful login function
                return true;
            } else {
                // Call failed login function
                return false; // User failed to log in
            }
        }  else {
            console.log(`No user found with username = ${username}`);
            return null;
        }
    } catch (error) {
        console.error("Error searching for user:", error);
        return null;
    }
}