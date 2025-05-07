/**
 * Lobby Component
 * This component manages the game lobby functionality, including:
 * - Creating and joining lobbies
 * - Managing player list
 * - Starting games
 * - Handling lobby state updates
 */

import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "@mui/joy/Button";
import Box from "@mui/joy/Box";
import CssBaseline from "@mui/joy/CssBaseline";
import Alert from "@mui/joy/Alert";
import Typography from "@mui/joy/Typography";
import CircularProgress from "@mui/joy/CircularProgress";
import { useTheme } from "@mui/joy/styles";
import { useMediaQuery } from "@mui/material";

import {
  type Lobby as LobbyType,
  type LobbyPlayer as Player,
} from "../firebase/FirebaseInterfaces";
import {
  createLobby,
  joinLobby,
  leaveLobby,
  onLobbyUpdate,
  startGame,
} from "../firebase/FirebaseLobbyManagment";

import "./lobby.css";
import GameRunner from "../backend/gameRunner";

/**
 * Interface for user profile data
 */
interface UserProfile {
  username: string;
  wins?: number;
  total_score?: number;
  profile_picture?: string;
}

function Lobby() {
  // Navigation and routing hooks
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;
  const isJoining = state?.isJoining;

  // Initialize user profile from navigation state or session storage
  const [userProfile, setUserProfile] = useState<UserProfile | null>(() => {
    const fromState = location?.state?.userProfile;
    const fromStorage = sessionStorage.getItem("userProfile");
    return fromState || (fromStorage ? JSON.parse(fromStorage) : null);
  });

  const username = userProfile?.username;

  // State management for lobby functionality
  const [players, setPlayers] = useState<Player[]>([]);
  const [lobby, setLobby] = useState<LobbyType | null>(null);
  const [lobbyCode, setLobbyCode] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [gameStarting, setGameStarting] = useState<boolean>(false);
  const [copySuccess, setCopySuccess] = useState<boolean>(false);

  // Responsive design hooks
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  /**
   * Helper function to get the host's username from the player list
   * @param players - Array of players in the lobby
   * @returns The host's username or null if not found
   */
  function getHostUsername(players: Player[]): string | null {
    const host = players.find((player) => player.isHost);
    return host ? host.username : null;
  }

  /**
   * Effect hook to initialize lobby (create or join)
   */
  useEffect(() => {
    const initializeLobby = async () => {
      try {
        setIsLoading(true);

        let code = sessionStorage.getItem("lobbyCode");

        // Create new lobby if not joining, else join existing one
        if (!code && !isJoining && username) {
          code = await createLobby(username);
          sessionStorage.setItem("lobbyCode", code);
        } else if (isJoining && username && code) {
          const userId = state?.userKey;
          await joinLobby(code, username, userId);
        }

        if (code) {
          setLobbyCode(code);
        } else {
          setError("No lobby code found");
        }
      } catch (err) {
        console.error("Lobby initialization error:", err);
        setError(
          `Failed to ${isJoining ? "join" : "create"} lobby. ${
            err instanceof Error ? err.message : ""
          }`
        );
      } finally {
        setIsLoading(false);
      }
    };

    if (username) {
      initializeLobby();
    }
  }, [isJoining, username]);

  /**
   * Effect hook to listen for lobby updates and handle game start
   */
  useEffect(() => {
    if (!lobbyCode) return;

    const unsubscribe = onLobbyUpdate(lobbyCode, (updatedLobby) => {
      setLobby(updatedLobby);

      if (updatedLobby.players) {
        setPlayers(Object.values(updatedLobby.players));
      }

      // Navigate to game page when lobby status changes to started
      if (updatedLobby.status === "started") {
        setGameStarting(true);

        const updatedPlayers = Object.values(updatedLobby.players);
        const player_usernames = updatedPlayers.map(
          (player) => player.username
        );
        const isHost = getHostUsername(updatedPlayers) === username;

        // Initialize game if user is the host
        if (isHost) {
          const gamerunner = new GameRunner(
            player_usernames,
            parseInt(lobbyCode)
          );
          gamerunner.sendToDatabase();
        }

        navigate("/main_game_page", {
          state: {
            players: Object.values(updatedLobby.players),
            lobbyCode,
            userProfile,
          },
        });
      }
    });

    return () => {
      unsubscribe();
    };
  }, [lobbyCode, username, navigate, userProfile]);

  /**
   * Handles starting the game if there are enough players
   */
  const handleStartGame = async () => {
    try {
      if (players.length == 4) {
        setGameStarting(true);
        await startGame(lobbyCode);
      } else {
        setError("Need at least 4 players to start the game");
      }
    } catch (err) {
      console.error("Failed to start game:", err);
      setError("Failed to start game");
      setGameStarting(false);
    }
  };

  /**
   * Handles leaving the current lobby
   */
  const handleLeave = async () => {
    try {
      if (username && lobbyCode) {
        await leaveLobby(lobbyCode, username);
        sessionStorage.removeItem("lobbyCode");
      }

      navigate("/profile", { state: { userProfile } });
    } catch (err) {
      console.error("Failed to leave lobby:", err);
      setError("Failed to leave lobby");
    }
  };

  /**
   * Handles copying the lobby code to clipboard
   */
  const handleCopyCode = () => {
    if (lobbyCode) {
      navigator.clipboard
        .writeText(lobbyCode)
        .then(() => {
          setCopySuccess(true);
          setTimeout(() => setCopySuccess(false), 2000); // Reset after 2 seconds
        })
        .catch((err) => {
          console.error("Failed to copy lobby code:", err);
          setError("Failed to copy lobby code");
        });
    }
  };

  // Loading screen while lobby initializes
  if (isLoading) {
    return (
      <div className="lobby-container">
        <Box sx={{ textAlign: "center", padding: 4 }}>
          <CircularProgress size="lg" />
          <Typography level="h4" sx={{ mt: 2 }}>
            Loading lobby...
          </Typography>
        </Box>
      </div>
    );
  }

  // Loading screen while game is starting
  if (gameStarting) {
    return (
      <div className="lobby-container">
        <Box sx={{ textAlign: "center", padding: 4 }}>
          <CircularProgress size="lg" />
          <Typography level="h4" sx={{ mt: 2 }}>
            Game starting...
          </Typography>
          <Typography level="body-md" sx={{ mt: 1 }}>
            Please wait while the game is being prepared.
          </Typography>
        </Box>
      </div>
    );
  }

  // Error screen
  if (error) {
    return (
      <div className="lobby-container">
        <Box sx={{ textAlign: "center", padding: 4 }}>
          <Typography level="h4" color="danger">
            Error
          </Typography>
          <Typography level="body-md" sx={{ mt: 1 }}>
            {error}
          </Typography>
          <Button
            onClick={() => navigate("/profile", { state: { userProfile } })}
            sx={{ mt: 2 }}
          >
            Return to Profile
          </Button>
        </Box>
      </div>
    );
  }

  // Main lobby UI
  return (
    <div className="lobby-container">
      <CssBaseline />
      <Box sx={{ maxWidth: 600, mx: "auto", p: 2 }}>
        {/* Lobby header */}
        <Typography level="h2" sx={{ mb: 2 }}>
          Game Lobby
        </Typography>

        {/* Lobby code section */}
        <Box sx={{ mb: 3 }}>
          <Typography level="h4">Lobby Code</Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography level="body-lg">{lobbyCode}</Typography>
            <Button
              size="sm"
              variant="outlined"
              onClick={handleCopyCode}
              disabled={copySuccess}
            >
              {copySuccess ? "Copied!" : "Copy"}
            </Button>
          </Box>
        </Box>

        {/* Player list */}
        <Box sx={{ mb: 3 }}>
          <Typography level="h4">Players ({players.length}/4)</Typography>
          {players.map((player) => (
            <Box
              key={player.username}
              sx={{
                p: 1,
                mb: 1,
                borderRadius: 1,
                bgcolor: "background.level1",
              }}
            >
              <Typography>
                {player.username}
                {player.isHost && " (Host)"}
              </Typography>
            </Box>
          ))}
        </Box>

        {/* Action buttons */}
        <Box sx={{ display: "flex", gap: 2 }}>
          {getHostUsername(players) === username && (
            <Button
              color="primary"
              onClick={handleStartGame}
              disabled={players.length < 4}
            >
              Start Game
            </Button>
          )}
          <Button color="neutral" onClick={handleLeave}>
            Leave Lobby
          </Button>
        </Box>
      </Box>
    </div>
  );
}

export default Lobby;
