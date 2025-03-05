import {ref, push, update, get, DatabaseReference} from 'firebase/database';
import {database} from './FirebaseCredentials'

// USER DATA INTERFACE
interface UserDataFormat {
    username: string;
    email: string;
    password: string;
    wins: number;
    losses: number;
    total_score: number;
    profile_picture: string;
    status: boolean;
}

// USER DATA OBJECT
const userData: UserDataFormat = {
    username: "Nacy_Gren",
    email: "john.doe@example.com",
    password: "Password123",
    wins: 0,
    losses: 0,
    total_score: 0,
    profile_picture: "url/to/profile_pic.jpg",
    status: true
};