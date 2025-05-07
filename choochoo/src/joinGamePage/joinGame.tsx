/**
 * JoinGame Component
 * This component allows users to join an existing game lobby by entering:
 * - Their username
 * - A lobby code
 * It handles validation and navigation to the lobby upon successful join.
 */

import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import CssBaseline from "@mui/joy/CssBaseline";
import Typography from "@mui/joy/Typography";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";
import FormHelperText from "@mui/joy/FormHelperText";
import CircularProgress from "@mui/joy/CircularProgress";
import { useTheme } from "@mui/joy/styles";
import { useMediaQuery } from "@mui/material";
import {
  checkLobbyExists,
  joinLobby,
} from "../firebase/FirebaseLobbyManagment";
import "./joinGame.css";

/**
 * Interface for user profile data
 */
interface UserProfile {
  username: string;
  wins?: number;
  total_score?: number;
  profile_picture?: string;
}

function JoinGame() {
  // State management for form inputs and loading states
  const [code, setCode] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  // Navigation and responsive design hooks
  const navigate = useNavigate();
  const { state } = useLocation();
  const location = useLocation();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  // User profile state management
  const [userProfile, setUserProfile] = useState<any>(null);

  /**
   * Effect hook to initialize user profile from state or session storage
   */
  useEffect(() => {
    const stateUserProfile = state?.userProfile;
    const storedProfile = JSON.parse(
      sessionStorage.getItem("userProfile") || "{}"
    );

    if (stateUserProfile) {
      setUserProfile(stateUserProfile);
      setUsername(stateUserProfile.username);
      sessionStorage.setItem("userProfile", JSON.stringify(stateUserProfile));
    } else if (storedProfile) {
      setUserProfile(storedProfile);
    }
  }, [state]);

  /**
   * Handles joining a game lobby
   * Validates inputs and attempts to join the specified lobby
   */
  const handleJoin = async () => {
    // Validate inputs
    if (!code) {
      setError("Please enter a lobby code");
      return;
    }

    if (!username) {
      setError("Please enter a username");
      return;
    }

    try {
      setIsLoading(true);
      setError("");

      // Check if lobby exists
      const exists = await checkLobbyExists(code);
      if (!exists) {
        setError("Lobby not found");
        setIsLoading(false);
        return;
      }

      // Join the lobby
      await joinLobby(code, username);
      sessionStorage.setItem("lobbyCode", code);
      sessionStorage.setItem("userProfile", JSON.stringify(userProfile));

      // Navigate to lobby as a joining player
      navigate("/lobby", {
        state: {
          userProfile,
          isJoining: true,
        },
      });
    } catch (err) {
      console.error("Failed to join lobby:", err);
      setError(err instanceof Error ? err.message : "Failed to join lobby");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="join-container">
      {/* Main join game form container */}
      <Box
        className="join-card"
        sx={{
          width: isSmallScreen ? "90vw" : 400,
          maxWidth: 400,
          mx: "auto",
          my: 4,
          py: 4,
          px: 3,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <CssBaseline />
        {/* Header */}
        <Typography className="join-header" level="h2">
          Join Game
        </Typography>

        {/* Join game form */}
        <div className="join-form">
          {/* Username input field */}
          <FormControl>
            <FormLabel>Username</FormLabel>
            <Input
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={!!location?.state?.userProfile?.username}
            />
          </FormControl>

          {/* Lobby code input field */}
          <FormControl error={!!error}>
            <FormLabel>Lobby Code</FormLabel>
            <Input
              placeholder="Enter lobby code"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
            />
            {error && <FormHelperText>{error}</FormHelperText>}
          </FormControl>

          {/* Join game button */}
          <Button
            onClick={handleJoin}
            className="join-button"
            loading={isLoading}
            disabled={isLoading}
            color="primary"
          >
            {isLoading ? "Joining..." : "Join Game"}
          </Button>

          {/* Back to profile button */}
          <Button
            onClick={() => navigate("/profile", { state: location?.state })}
            className="back-button"
            disabled={isLoading}
            variant="outlined"
            color="neutral"
          >
            Back to Profile
          </Button>
        </div>
      </Box>
    </div>
  );
}

export default JoinGame;
