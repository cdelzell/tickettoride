import { get, query, equalTo, orderByChild } from "firebase/database";
import { userDataPath } from "./FirebaseCredentials";
import { setStatus } from "./FirebaseWriteUserData";
import { UserData } from "./FirebaseInterfaces";

export async function handleLogIn(
  enteredUsername: string,
  enteredPassword: string
): Promise<[boolean, string, UserData] | [boolean, string] | null> {
  const userQuery = query(
    userDataPath,
    orderByChild("username"),
    equalTo(enteredUsername)
  );

  try {
    const snapshot = await get(userQuery);
    if (snapshot.exists()) {
      const userEntry = snapshot.val();
      const userKey = Object.keys(userEntry)[0];
      const userData = Object.values(userEntry)[0] as UserData;
      const database_password = userData["password"];

      if (database_password === enteredPassword) {
        //setStatus(userData, true)
        // Call successful login function
        console.log("Log in successed");
        //setStatus(snapshot.val()[0],true, false);
        return [true, userKey, userData];
      } else {
        // Call failed login function
        console.log("Log in failed");
        return [false, userKey]; // User failed to log in
      }
    } else {
      console.log(`No user found with username = ${enteredUsername}`);
      return null;
    }
  } catch (error) {
    console.error("Error searching for user:", error);
    return null;
  }
}
