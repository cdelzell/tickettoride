class User {
    username: string;

    constructor(username: string) {
        this.username = username;
    }

    getUsername(): string {
        return this.username;
    }
}

export default User;