/**
 * User Class
 * Represents a user in the Ticket to Ride game system.
 * Stores basic user information and provides methods to access it.
 */
class User {
    /** The username of the user */
    username: string;

    /**
     * Creates a new User instance
     * @param username - The username for the new user
     */
    constructor(username: string) {
        this.username = username;
    }

    /**
     * Gets the username of the user
     * @returns The user's username
     */
    getUsername(): string {
        return this.username;
    }
}

export default User;