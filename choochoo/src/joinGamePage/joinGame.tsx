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

interface UserProfile {
  username: string;
  wins?: number;
  total_score?: number;
  profile_picture?: string;
}

function JoinGame() {
  const [code, setCode] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    const userProfile = location?.state?.userProfile as UserProfile | undefined;
    if (userProfile?.username) {
      setUsername(userProfile.username);
    }
  }, [location]);

  const handleJoin = async () => {
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

      await joinLobby(code, username);
      sessionStorage.setItem("lobbyCode", code);

      const userProfile: UserProfile = { username };
      sessionStorage.setItem("userProfile", JSON.stringify(userProfile));

      // nav to the lobby as a joining player
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
        <Typography className="join-header" level="h2">
          Join Game
        </Typography>

        <div className="join-form">
          <FormControl>
            <FormLabel>Username</FormLabel>
            <Input
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={!!location?.state?.userProfile?.username}
            />
          </FormControl>

          <FormControl error={!!error}>
            <FormLabel>Lobby Code</FormLabel>
            <Input
              placeholder="Enter lobby code"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
            />
            {error && <FormHelperText>{error}</FormHelperText>}
          </FormControl>

          <Button
            onClick={handleJoin}
            className="join-button"
            loading={isLoading}
            disabled={isLoading}
            color="primary"
          >
            {isLoading ? "Joining..." : "Join Game"}
          </Button>

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
