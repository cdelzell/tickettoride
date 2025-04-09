import { ref, update, get, push } from "firebase/database";
import { database, userDataPath } from "./FirebaseCredentials";
import { UserData } from "./FirebaseInterfaces";

type UserDataFormat = UserData;

/**
 * Function that finds a user using their object ID, then updates their username in the Firebase database
 * @param {string} objectId - The objectID of the user that you are looking for
 * @param {string} username - The username to replace the current username with
 * @param {boolean} print - Variable to determine if the program should print the data received to the console (true prints, false does not)
 * @returns {Promise<Object|null>} - Returns the updated user data, or null if not found or an error occurs
 * @throws {Error} - Throws an error if there is an issue while updating the username or retrieving user data from the database.
 */
export async function setUsername(
  objectId: string,
  username: string,
  print: boolean
): Promise<Object | null> {
  try {
    const userData = await updateUserProperty(objectId, "username", username);

    if (userData) {
      if (print) {
        console.log("Updated user data:", userData); // Print the updated user data if print is true
      }
      return userData;
    } else {
      console.log(`No user found with ID: ${objectId}`);
      return null; // Return null if no user data is found
    }
  } catch (error) {
    console.error("Error handling user data:", error);
    return null; // Return null on error
  }
}

/**
 * Function that finds a user using their object ID, then updates their email in the Firebase database
 * @param {string} objectId - The objectID of the user that you are looking for
 * @param {string} email - The email to replace the current email with
 * @param {boolean} print - Variable to determine if the program should print the data received to the console (true prints, false does not)
 * @returns {Promise<Object|null>} - Returns the updated user data, or null if not found or an error occurs
 * @throws {Error} - Throws an error if there is an issue while updating the email or retrieving user data from the database.
 */
export async function setEmail(
  objectId: string,
  email: string,
  print: boolean
): Promise<Object | null> {
  try {
    const userData = await updateUserProperty(objectId, "email", email);

    if (userData) {
      if (print) {
        console.log("Updated user data:", userData); // Print the updated user data if print is true
      }
      return userData;
    } else {
      console.log(`No user found with ID: ${objectId}`);
      return null; // Return null if no user data is found
    }
  } catch (error) {
    console.error("Error handling user data:", error);
    return null; // Return null on error
  }
}

/**
 * Function that finds a user using their object ID, then updates their password in the Firebase database
 * @param {string} objectId - The objectID of the user that you are looking for
 * @param {string} password - The password to replace the current password with
 * @param {boolean} print - Variable to determine if the program should print the data received to the console (true prints, false does not)
 * @returns {Promise<Object|null>} - Returns the updated user data, or null if not found or an error occurs
 * @throws {Error} - Throws an error if there is an issue while updating the password or retrieving user data from the database.
 */
export async function setPassword(
  objectId: string,
  password: string,
  print: boolean
): Promise<Object | null> {
  try {
    const userData = await updateUserProperty(objectId, "password", password);

    if (userData) {
      if (print) {
        console.log("Updated user data:", userData); // Print the updated user data if print is true
      }
      return userData;
    } else {
      console.log(`No user found with ID: ${objectId}`);
      return null; // Return null if no user data is found
    }
  } catch (error) {
    console.error("Error handling user data:", error);
    return null; // Return null on error
  }
}

/**
 * Function that finds a user using their object ID, then updates their wins in the Firebase database
 * @param {string} objectId - The objectID of the user that you are looking for
 * @param {number} wins - The wins to replace the current wins with
 * @param {boolean} print - Variable to determine if the program should print the data received to the console (true prints, false does not)
 * @returns {Promise<Object|null>} - Returns the updated user data, or null if not found or an error occurs
 * @throws {Error} - Throws an error if there is an issue while updating the wins or retrieving user data from the database.
 */
export async function setWins(
  objectId: string,
  wins: number,
  print: boolean
): Promise<Object | null> {
  try {
    const userData = await updateUserProperty(objectId, "wins", wins);

    if (userData) {
      if (print) {
        console.log("Updated user data:", userData); // Print the updated user data if print is true
      }
      return userData;
    } else {
      console.log(`No user found with ID: ${objectId}`);
      return null; // Return null if no user data is found
    }
  } catch (error) {
    console.error("Error handling user data:", error);
    return null; // Return null on error
  }
}

/**
 * Function that finds a user using their object ID, then updates their losses in the Firebase database
 * @param {string} objectId - The objectID of the user that you are looking for
 * @param {number} losses - The losses to replace the current losses with
 * @param {boolean} print - Variable to determine if the program should print the data received to the console (true prints, false does not)
 * @returns {Promise<Object|null>} - Returns the updated user data, or null if not found or an error occurs
 * @throws {Error} - Throws an error if there is an issue while updating the losses or retrieving user data from the database.
 */
export async function setLoss(
  objectId: string,
  losses: number,
  print: boolean
): Promise<Object | null> {
  try {
    const userData = await updateUserProperty(objectId, "losses", losses);

    if (userData) {
      if (print) {
        console.log("Updated user data:", userData); // Print the updated user data if print is true
      }
      return userData;
    } else {
      console.log(`No user found with ID: ${objectId}`);
      return null; // Return null if no user data is found
    }
  } catch (error) {
    console.error("Error handling user data:", error);
    return null; // Return null on error
  }
}

/**
 * Function that finds a user using their object ID, then updates their total score in the Firebase database
 * @param {string} objectId - The objectID of the user that you are looking for
 * @param {number} total_score - The total score to replace the current total score with
 * @param {boolean} print - Variable to determine if the program should print the data received to the console (true prints, false does not)
 * @returns {Promise<Object|null>} - Returns the updated user data, or null if not found or an error occurs
 * @throws {Error} - Throws an error if there is an issue while updating the total score or retrieving user data from the database.
 */
export async function setTotalScore(
  objectId: string,
  total_score: number,
  print: boolean
): Promise<Object | null> {
  try {
    const userData = await updateUserProperty(
      objectId,
      "total_score",
      total_score
    );

    if (userData) {
      if (print) {
        console.log("Updated user data:", userData); // Print the updated user data if print is true
      }
      return userData;
    } else {
      console.log(`No user found with ID: ${objectId}`);
      return null; // Return null if no user data is found
    }
  } catch (error) {
    console.error("Error handling user data:", error);
    return null; // Return null on error
  }
}

/**
 * Function that finds a user using their object ID, then updates their profile picture in the Firebase database
 * @param {string} objectId - The objectID of the user that you are looking for
 * @param {string} profile_picture - The URL of the new profile picture to replace the current profile picture
 * @param {boolean} print - Variable to determine if the program should print the data received to the console (true prints, false does not)
 * @returns {Promise<Object|null>} - Returns the updated user data, or null if not found or an error occurs
 * @throws {Error} - Throws an error if there is an issue while updating the profile picture or retrieving user data from the database.
 */
export async function setProfilePicture(
  objectId: string,
  profile_picture: string,
  print: boolean
): Promise<Object | null> {
  try {
    const userData = await updateUserProperty(
      objectId,
      "profile_picture",
      profile_picture
    );

    if (userData) {
      if (print) {
        console.log("Updated user data:", userData); // Print the updated user data if print is true
      }
      return userData;
    } else {
      console.log(`No user found with ID: ${objectId}`);
      return null; // Return null if no user data is found
    }
  } catch (error) {
    console.error("Error handling user data:", error);
    return null; // Return null on error
  }
}

/**
 * Function that finds a user using their object ID, then updates their status in the Firebase database
 * @param {string} objectId - The objectID of the user that you are looking for
 * @param {boolean} status - The status to replace the current status with
 * @param {boolean} print - Variable to determine if the program should print the data received to the console (true prints, false does not)
 * @returns {Promise<Object|null>} - Returns the updated user data, or null if not found or an error occurs
 * @throws {Error} - Throws an error if there is an issue while updating the status or retrieving user data from the database.
 */
export async function setStatus(
  objectId: string,
  status: boolean,
  print: boolean
): Promise<Object | null> {
  try {
    const userData = await updateUserProperty(objectId, "status", status);

    if (userData) {
      if (print) {
        console.log("Updated user data:", userData); // Print the updated user data if print is true
      }
      return userData;
    } else {
      console.log(`No user found with ID: ${objectId}`);
      return null; // Return null if no user data is found
    }
  } catch (error) {
    console.error("Error handling user data:", error);
    return null; // Return null on error
  }
}

/**
 * Function to update a user property
 * @param {string} objectId - The objectID of the user whose property is to be updated. This is typically the unique identifier for the user in the Firebase database.
 * @param {string} property - The property of the user object to update. This is the name of the field (e.g., 'username', 'email', 'wins', etc.).
 * @param {string | number | boolean} newValue - The new value for the property. This value can be of type `string`, `number`, or `boolean`, depending on the property being updated.
 * @returns {Promise<any>} - A promise that resolves to the updated user data from the database after the property has been updated.
 * @throws {Error} - Throws an error if the update operation fails or if an error occurs during the retrieval of updated data.
 */
export async function updateUserProperty(
  objectId: string,
  property: string,
  newValue: string | number | boolean
): Promise<any> {
  // Use the correct reference from the initialized database object
  const userRef = ref(database, "users/" + objectId);

  try {
    // Perform the update
    await update(userRef, {
      [property]: newValue,
    });

    // Get and return the updated user data
    const snapshot = await get(userRef);
    const updatedUserData = snapshot.val();

    return updatedUserData;
  } catch (error) {
    console.error("Error updating user property:", error);
    throw new Error("Failed to update user property");
  }
}

/**
 * Function to write data to Firebase Database
 * @param {Object} data - The data to be written to the users in the database.
 * @throws {Error} - Throws an error if there is an issue while updating or retrieving an entry from the database.
 */
export function writeUserToDatabase(data: UserDataFormat): void {
  push(userDataPath, data)
    .then((newUserRef) => {
      const userKey = newUserRef.key; // This is the unique key of the newly added user
      console.log(`Data written successfully with user key: ${userKey}`);
      return userKey; // Return the key of the new user
    })
    .catch((error) => {
      console.error(`Error writing data to ${ref}:`, error);
    });
}

// Function to check if a user with a given username or email already exists
export async function doesUserExist(
  username: string,
  email: string
): Promise<boolean> {
  try {
    const snapshot = await get(userDataPath);
    if (snapshot.exists()) {
      const users = snapshot.val();
      return Object.values(users).some(
        (user: any) => user.username === username || user.email === email
      );
    }
    return false;
  } catch (error) {
    console.error("Error checking if user exists:", error);
    throw new Error("Failed to check if user exists");
  }
}
