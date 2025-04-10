import { database } from "./FirebaseCredentials";
import {
  ref,
  set,
  push,
  get,
  update,
  remove,
  onValue,
  off,
  serverTimestamp,
  DataSnapshot,
} from "firebase/database";

export interface Player {
  username: string;
  isHost: boolean;
  joinedAt: object | number;
  userId?: string;
}

export interface Lobby {
  host: string;
  createdAt: object | number;
  players: Record<string, Player>;
  status?: string;
  pendingPlayers?: Record<string, boolean>; 
}

// lobby service
const FirebaseLobbyWrite = {
  createLobby: async (
    hostUsername: string,
    userId?: string
  ): Promise<string> => {
    const lobbyCode = Math.floor(100000 + Math.random() * 900000).toString();

    const lobbyRef = ref(database, `lobbies/${lobbyCode}`);

    const lobbyData: Lobby = {
      host: hostUsername,
      createdAt: serverTimestamp(),
      players: {
        [hostUsername]: {
          username: hostUsername,
          isHost: true,
          joinedAt: serverTimestamp(),
          ...(userId ? { userId } : {}),
        },
      },
      status: "waiting", 
    };

    await set(lobbyRef, lobbyData);

    return lobbyCode;
  },

  joinLobby: async (
    lobbyCode: string,
    username: string,
    userId?: string
  ): Promise<boolean> => {
    const lobbyRef = ref(database, `lobbies/${lobbyCode}`);
    const snapshot = await get(lobbyRef);

    if (!snapshot.exists()) {
      throw new Error("Lobby does not exist");
    }

    const lobbyData = snapshot.val() as Lobby;
    

    if (lobbyData.status === "started") {
      throw new Error("Game has already started");
    }

    const players = lobbyData.players || {};
    console.log("Current players in lobby:", Object.keys(players));
    console.log("Player count:", Object.keys(players).length);


    if (Object.keys(players).length >= 4 && !players[username]) {

      throw new Error("Lobby is full");
    }


    await update(lobbyRef, {
      [`pendingPlayers/${username}`]: true
    });
    

    const updatedSnapshot = await get(lobbyRef);
    const updatedLobbyData = updatedSnapshot.val() as Lobby;
    const updatedPlayers = updatedLobbyData.players || {};

    if (Object.keys(updatedPlayers).length >= 4 && !updatedPlayers[username]) {
      await update(lobbyRef, {
        [`pendingPlayers/${username}`]: null
      });
      throw new Error("Lobby is full");
    }

    if (updatedPlayers[username]) {
      console.log("Player already in lobby, updating entry");
    }

    const playerData: Player = {
      username,
      isHost: false,
      joinedAt: serverTimestamp(),
      ...(userId ? { userId } : {}),
    };

  
    await update(lobbyRef, {
      [`players/${username}`]: playerData,
      [`pendingPlayers/${username}`]: null 
    });

    return true;
  },

  leaveLobby: async (lobbyCode: string, username: string): Promise<void> => {
    const lobbyRef = ref(database, `lobbies/${lobbyCode}`);
    const playerRef = ref(database, `lobbies/${lobbyCode}/players/${username}`);

    const snapshot = await get(playerRef);
    if (snapshot.exists()) {
      const playerData = snapshot.val() as Player;
      const isHost = playerData.isHost;

      await remove(playerRef);

      if (isHost) {
        const playersSnapshot = await get(
          ref(database, `lobbies/${lobbyCode}/players`)
        );
        const players = playersSnapshot.val() as Record<string, Player>;

        if (players && Object.keys(players).length > 0) {
          const nextHost = Object.keys(players)[0];

          const updates: Record<string, any> = {
            [`lobbies/${lobbyCode}/players/${nextHost}/isHost`]: true,
            [`lobbies/${lobbyCode}/host`]: nextHost,
          };

          await update(ref(database), updates);
        } else {
          await remove(lobbyRef);
        }
      }
    }
  },

  onLobbyUpdate: (
    lobbyCode: string,
    callback: (lobby: Lobby) => void
  ): (() => void) => {
    const lobbyRef = ref(database, `lobbies/${lobbyCode}`);

    const handleValueChange = (snapshot: DataSnapshot) => {
      if (snapshot.exists()) {
        const lobbyData = snapshot.val() as Lobby;
        callback(lobbyData);
      } else {
        callback({
          host: "",
          createdAt: 0,
          players: {},
          status: "closed"
        });
      }
    };

    onValue(lobbyRef, handleValueChange);

    return () => off(lobbyRef, "value", handleValueChange);
  },

  // start game
  startGame: async (lobbyCode: string): Promise<boolean> => {
    const lobbyRef = ref(database, `lobbies/${lobbyCode}`);
    
    // update lobby status first
    await update(lobbyRef, {
      status: "started",
    });

    const gameRef = ref(database, `games/${lobbyCode}`);
    const playersSnapshot = await get(
      ref(database, `lobbies/${lobbyCode}/players`)
    );
    const players = playersSnapshot.val() as Record<string, Player>;

    await set(gameRef, {
      lobbyCode,
      startedAt: serverTimestamp(),
      players: players,
      status: "active",
    });

    return true;
  },

  // does lobby exist?
  checkLobbyExists: async (lobbyCode: string): Promise<boolean> => {
    const snapshot = await get(ref(database, `lobbies/${lobbyCode}`));
    return snapshot.exists();
  },

  // lobby details
  getLobbyDetails: async (lobbyCode: string): Promise<Lobby | null> => {
    const snapshot = await get(ref(database, `lobbies/${lobbyCode}`));

    if (snapshot.exists()) {
      return snapshot.val() as Lobby;
    }

    return null;
  },
};

export default FirebaseLobbyWrite;