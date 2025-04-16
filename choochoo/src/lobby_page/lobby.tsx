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
} from "../Firebase/FirebaseInterfaces";
import {
  createLobby,
  joinLobby,
  leaveLobby,
  onLobbyUpdate,
  startGame,
} from "../Firebase/FirebaseLobbyManagment";
import "./lobby.css";
import GameRunner from "../backend/game-runner";

// Your existing interface for UserProfile
interface UserProfile {
  username: string;
  wins?: number;
  total_score?: number;
  profile_picture?: string;
}

function Lobby() {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;
  const isJoining = state?.isJoining;

  const [userProfile, setUserProfile] = useState<UserProfile | null>(() => {
    const fromState = location?.state?.userProfile;
    const fromStorage = sessionStorage.getItem("userProfile");
    return fromState || (fromStorage ? JSON.parse(fromStorage) : null);
  });

  const username = userProfile?.username;

  const [players, setPlayers] = useState<Player[]>([]);
  const [lobby, setLobby] = useState<LobbyType | null>(null);
  const [lobbyCode, setLobbyCode] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [gameStarting, setGameStarting] = useState<boolean>(false);
  const [copySuccess, setCopySuccess] = useState<boolean>(false);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  function getHostUsername(players: Player[]): string | null {
    const host = players.find((player) => player.isHost);
    return host ? host.username : null;
  }

  useEffect(() => {
    const initializeLobby = async () => {
      try {
        setIsLoading(true);

        let code = sessionStorage.getItem("lobbyCode");

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

  useEffect(() => {
    if (!lobbyCode) return;

    const unsubscribe = onLobbyUpdate(lobbyCode, (updatedLobby) => {
      setLobby(updatedLobby);

      if (updatedLobby.players) {
        setPlayers(Object.values(updatedLobby.players));
      }

      if (updatedLobby.status === "started") {
        setGameStarting(true);

        const updatedPlayers = Object.values(updatedLobby.players);
        const player_usernames = updatedPlayers.map(
          (player) => player.username
        );
        const isHost = getHostUsername(updatedPlayers) === username;

        if (isHost) {
          console.log("gamerunner");
          const gamerunner = new GameRunner(
            player_usernames,
            parseInt(lobbyCode)
          );
          gamerunner.sendToDatabase(gamerunner);
          console.log(gamerunner);
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

  const handleStartGame = async () => {
    try {
      if (players.length >= 2) {
        setGameStarting(true);
        await startGame(lobbyCode);
      } else {
        setError("Need at least 2 players to start the game");
      }
    } catch (err) {
      console.error("Failed to start game:", err);
      setError("Failed to start game");
      setGameStarting(false);
    }
  };

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

  // Handle copying the lobby code to clipboard
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
            Back to Profile
          </Button>
        </Box>
      </div>
    );
  }

  return (
    <div className="lobby-container">
      <Box
        sx={{
          width: isSmallScreen ? "100vw" : 700,
          backgroundColor: "white",
          maxWidth: 600,
          mx: "auto",
          my: 4,
          py: 4,
          px: 4,
          display: "flex",
          flexDirection: "column",
          gap: 3,
          borderRadius: "16px",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
        }}
      >
        <CssBaseline />
        <Typography
          level="h2"
          sx={{ textAlign: "center", color: "black", mb: 2 }}
        >
          Game Lobby
        </Typography>

        <div className="lobby-code-container">
          <h2 className="lobby-code">Lobby Code: {lobbyCode}</h2>
          <Button
            onClick={handleCopyCode}
            className="copy-button"
            variant={copySuccess ? "soft" : "solid"}
            color={copySuccess ? "success" : "primary"}
          >
            {copySuccess ? "Copied!" : "Copy Code"}
          </Button>
        </div>

        <Typography level="body-md" sx={{ mb: 2 }}>
          Share this code with your friend to join!
        </Typography>

        <Typography
          level="title-md"
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 1,
          }}
        >
          Players ({players.length}/4)
          <Typography
            level="body-sm"
            sx={{
              color: players.length < 2 ? "warning.500" : "success.500",
              fontWeight: "bold",
            }}
          >
            {players.length < 2 ? "Need more players..." : "Ready to start!"}
          </Typography>
        </Typography>

        <ul className="player-list">
          {players.map((player, index) => (
            <li
              key={index}
              style={{ display: "flex", justifyContent: "space-between" }}
            >
              <Typography>
                {player.username}
                {player.username === username && " (You)"}
              </Typography>
              {player.isHost && <span className="player-host-badge">Host</span>}
            </li>
          ))}
          {players.length === 0 && (
            <li>
              <Typography
                level="body-sm"
                sx={{ fontStyle: "italic", color: "neutral.500" }}
              >
                Waiting for players to join...
              </Typography>
            </li>
          )}
        </ul>

        <div className="button-container">
          {players.some((p) => p.username === username && p.isHost) && (
            <Button
              onClick={handleStartGame}
              className="start-button"
              disabled={players.length < 2 || gameStarting}
              color="success"
              variant="solid"
            >
              {gameStarting ? "Starting..." : "Start Game"}
            </Button>
          )}

          <Button
            onClick={handleLeave}
            className="leave-button"
            color="danger"
            variant="soft"
            disabled={gameStarting}
          >
            Leave Lobby
          </Button>
        </div>
      </Box>
    </div>
  );
}

export default Lobby;
