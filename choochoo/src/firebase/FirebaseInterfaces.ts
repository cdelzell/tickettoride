import DestinationCard from "@/backend/destinationCard";
import GameBoard from "../backend/gameBoard";
import TrainCard from "@/backend/trainCard";

/**
 * Interface representing user data stored in Firebase
 * Contains all user-related information and statistics
 */
export interface UserData {
  /** User's display name */
  username: string;
  /** User's email address */
  email: string;
  /** User's hashed password */
  password: string;
  /** Number of games won */
  wins: number;
  /** Number of games lost */
  losses: number;
  /** Total points accumulated across all games */
  total_score: number;
  /** URL or identifier for user's profile picture */
  profile_picture: string;
  /** Whether the user is currently online */
  status: boolean;
  /** ID of the game the user is currently in, null if not in a game */
  active_game_id: string | null;
}

/**
 * Interface representing a player in a game lobby
 * Contains player-specific information within a lobby context
 */
export interface LobbyPlayer {
  /** Player's display name */
  username: string;
  /** Whether the player is the host of the lobby */
  isHost: boolean;
  /** Timestamp when the player joined the lobby */
  joinedAt: any;
  /** Optional user ID for authentication */
  userId?: string;
}

/**
 * Interface representing a game lobby
 * Contains all information about a lobby and its players
 */
export interface Lobby {
  /** Username of the lobby host */
  host: string;
  /** Timestamp when the lobby was created */
  createdAt: any;
  /** Map of players in the lobby, keyed by username */
  players: { [key: string]: LobbyPlayer };
  /** Current status of the lobby (waiting, in-progress, etc.) */
  status: string;
}

export interface GamePlayer {
  destinationCardHand: DestinationCard[];
  id: string;
  scoredPoints: number;
  trainAmount: number;
  trainCardHand: TrainCard[];
  username: string;
}

//GAME OBJECT INTERFACES

//--Whether or not the game is over (boolean)
//--The current player
//--The faceup cards
//--The state of the draw pile (number of train cards of each color)
//--The state of the discard pile (number of train cards of each color)
//--The state of the destination card draw pile (which ones are left)
//--game-boards' board-graphs' routes' claimers
//--Every player's train cards
//--Every player's destination cards
//--Every player's trains left
//--The index of the current player
