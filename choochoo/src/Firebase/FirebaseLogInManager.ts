import {get, query, equalTo, orderByChild } from 'firebase/database'
import {userDataPath} from './FirebaseCredentials'

export async function handleLogIn(username: string, enteredPassword: string): Promise<boolean | null> {
    const userQuery = query(userDataPath, orderByChild('username'), equalTo(username));

    try {
        const snapshot = await get(userQuery);
        if(snapshot.exists()){
            const userData = snapshot.val();
            console.log(userData);
            const database_password = userData.password;
            console.log(database_password);
            if(userData.password === enteredPassword){
                // Call successful login function
                console.log("Worked");
                return true;
            } else {
                // Call failed login function
                console.log("Failed");
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