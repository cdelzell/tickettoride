import { ref, query, orderByChild, equalTo, get } from "firebase/database";
import { userDataPath, gameDataPath } from "./FirebaseCredentials";
import { UserData } from "./FirebaseInterfaces";

/**
 * Function to search for users in the Firebase database with a specified username
 * @param {string} username - The username of the user that you are looking for
 * @param {boolean} print - Variable to determine if the program should print the data received to the console (true prints, false does not)
 */
export async function findUserByUsername(
  username: string,
  print: boolean
): Promise<UserData | null> {
  try {
    const userData = (await findUserByField("username", username)) as UserData;

    if (userData) {
      if (print) {
        printUserQueryResults(userData); // Print the user data if print is true
      }
      return userData; // Return the resolved data (user data) if found
    } else {
      console.log(`No user found with username: ${username}`);
      return null; // Return null if no user data is found
    }
  } catch (error) {
    console.error("Error handling user data:", error);
    return null; // Return null on error
  }
}

/**
 * Function to search for users in the Firebase database with a specified email
 * @param {string} email - The email of the user that you are looking for
 * @param {boolean} print - Variable to determine if the program should print the data received to the console (true prints, false does not)
 */
async function findUserByEmail(
  email: string,
  print: boolean
): Promise<Object | null> {
  try {
    const userData = await findUserByField("email", email);

    if (userData) {
      if (print) {
        printUserQueryResults(userData); // Print the user data if print is true
      }
      return userData; // Return the resolved data (user data) if found
    } else {
      console.log(`No user found with email: ${email}`);
      return null; // Return null if no user data is found
    }
  } catch (error) {
    console.error("Error handling user data:", error);
    return null; // Return null on error
  }
}

/**
 * Function to search for users in the Firebase database with a specified password
 * @param {string} password - The password of the user that you are looking for
 * @param {boolean} print - Variable to determine if the program should print the data received to the console (true prints, false does not)
 */
async function findUserByPassword(
  password: string,
  print: boolean
): Promise<Object | null> {
  try {
    const userData = await findUserByField("password", password);

    if (userData) {
      if (print) {
        printUserQueryResults(userData); // Print the user data if print is true
      }
      return userData; // Return the resolved data (user data) if found
    } else {
      console.log(`No user found with password: ${password}`);
      return null; // Return null if no user data is found
    }
  } catch (error) {
    console.error("Error handling user data:", error);
    return null; // Return null on error
  }
}

/**
 * Function to search for users in the Firebase database with a specified wins value
 * @param {number} wins - The number of wins of the user that you are looking for
 * @param {boolean} print - Variable to determine if the program should print the data received to the console (true prints, false does not)
 */
async function findUserByWins(
  wins: number,
  print: boolean
): Promise<Object | null> {
  try {
    const userData = await findUserByField("wins", wins);

    if (userData) {
      if (print) {
        printUserQueryResults(userData); // Print the user data if print is true
      }
      return userData; // Return the resolved data (user data) if found
    } else {
      console.log(`No user found with wins: ${wins}`);
      return null; // Return null if no user data is found
    }
  } catch (error) {
    console.error("Error handling user data:", error);
    return null; // Return null on error
  }
}

/**
 * Function to search for users in the Firebase database with a specified losses value
 * @param {number} losses - The number of losses of the user that you are looking for
 * @param {boolean} print - Variable to determine if the program should print the data received to the console (true prints, false does not)
 */
async function findUserByLosses(
  losses: number,
  print: boolean
): Promise<Object | null> {
  try {
    const userData = await findUserByField("losses", losses);

    if (userData) {
      if (print) {
        printUserQueryResults(userData); // Print the user data if print is true
      }
      return userData; // Return the resolved data (user data) if found
    } else {
      console.log(`No user found with losses: ${losses}`);
      return null; // Return null if no user data is found
    }
  } catch (error) {
    console.error("Error handling user data:", error);
    return null; // Return null on error
  }
}

/**
 * Function to search for users in the Firebase database with a specified total score
 * @param {number} total_score - The total score of the user that you are looking for
 * @param {boolean} print - Variable to determine if the program should print the data received to the console (true prints, false does not)
 */
async function findUserByTotalScore(
  total_score: number,
  print: boolean
): Promise<Object | null> {
  try {
    const userData = await findUserByField("total_score", total_score);

    if (userData) {
      if (print) {
        printUserQueryResults(userData); // Print the user data if print is true
      }
      return userData; // Return the resolved data (user data) if found
    } else {
      console.log(`No user found with total_score: ${total_score}`);
      return null; // Return null if no user data is found
    }
  } catch (error) {
    console.error("Error handling user data:", error);
    return null; // Return null on error
  }
}

/**
 * Function to search for users in the Firebase database with a specified profile picture
 * @param {string} profile_picture - The profile picture URL of the user that you are looking for
 * @param {boolean} print - Variable to determine if the program should print the data received to the console (true prints, false does not)
 */
async function findUserByProfilePicture(
  profile_picture: string,
  print: boolean
): Promise<Object | null> {
  try {
    const userData = await findUserByField("profile_picture", profile_picture);

    if (userData) {
      if (print) {
        printUserQueryResults(userData); // Print the user data if print is true
      }
      return userData; // Return the resolved data (user data) if found
    } else {
      console.log(`No user found with profile_picture: ${profile_picture}`);
      return null; // Return null if no user data is found
    }
  } catch (error) {
    console.error("Error handling user data:", error);
    return null; // Return null on error
  }
}

/**
 * Function to search for users in the Firebase database with a specified status
 * @param {boolean} status - The status of users that you are looking for (true or false)
 * @param {boolean} print - Variable to determine if the program print the data received to console (true prints, false does not)
 */
async function findUserByStatus(
  status: boolean,
  print: boolean
): Promise<Object | null> {
  try {
    // Await the result of findUserByStatus
    const userData = await findUserByField("status", status);

    // Print the user data if it exists
    if (userData) {
      if (print) {
        printUserQueryResults(userData); // Pass resolved data to print
      }
      return userData;
    } else {
      console.log("No user found with status:", status);
    }
  } catch (error) {
    console.error("Error retrieving user data by status:", error);
  }
  return null;
}

/**
 * Function to search for a user in the Firebase database by a specific field and value.
 * It queries the "users" database and looks for entries where the specified field matches the given value.
 * The function returns the user data if found, otherwise returns null.
 *
 * @param {string} field - The field name in the user data to search by (e.g., "username", "email", "wins").
 * @param {string|number|boolean} value - The value that the specified field should match. This can be a string (e.g., "john_doe"),
 *                                        a number (e.g., 5), or a boolean (e.g., true/false), depending on the field.
 * @returns {Object|null} The user data matching the given field and value, or null if no matching user is found.
 */
function findUserByField(
  field: string,
  value: string | number | boolean
): Promise<Object | null> {
  const userQuery = query(userDataPath, orderByChild(field), equalTo(value));

  // Perform the query and return the result
  return get(userQuery) // This returns a Promise.
    .then((snapshot) => {
      if (snapshot.exists()) {
        return snapshot.val(); // Return the user data from the snapshot if found
      } else {
        console.log(`No user found with ${field}:`, value);
        return null; // Return null if no data is found
      }
    })
    .catch((error) => {
      console.error("Error retrieving data:", error);
      return null; // Return null on error
    });
}

/**
 * Function to print the details of a given object (typically user data) to the console in a readable format.
 * It recursively traverses the object, printing each key-value pair in a hierarchical structure.
 * This is useful for inspecting deeply nested data or objects with multiple properties.
 *
 * @param {Object} obj - The object containing data to be printed (e.g., user data retrieved from Firebase).
 * @param {string} [indent=''] - The indentation string used to format the printed output. It is used to represent the depth of the nested properties for better readability.
 * It starts as an empty string and is added to as the recursion goes deeper.
 */
function printUserQueryResults(obj: any, indent: string = ""): void {
  if (typeof obj === "object" && obj !== null) {
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (typeof obj[key] === "object" && obj[key] !== null) {
          console.log(`${indent}${key}:`);
          printUserQueryResults(obj[key], indent + "  ");
        } else {
          console.log(`${indent}${key}: ${obj[key]}`);
        }
      }
    }
  }
}
