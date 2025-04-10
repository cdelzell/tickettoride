import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import CssBaseline from "@mui/joy/CssBaseline";
import { useTheme, useMediaQuery } from "@mui/material";
import TextField from "@mui/material/TextField";
import FirebaseLobbyWrite from "../Firebase/FirebaseLobbyWrite";
import "./join_game.css";

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
      const exists = await FirebaseLobbyWrite.checkLobbyExists(code);
      if (!exists) {
        setError("Lobby not found");
        setIsLoading(false);
        return;
      }
      

      await FirebaseLobbyWrite.joinLobby(code, username);
      
      sessionStorage.setItem("lobbyCode", code);
      
      const userProfile: UserProfile = { username };
      sessionStorage.setItem("userProfile", JSON.stringify(userProfile));
      
      // nav to the lobby as a joining player
      navigate("/lobby", {
        state: {
          userProfile,
          isJoining: true
        }
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
        sx={{
          width: isSmallScreen ? "80vw" : 400,
          backgroundColor: "white",
          maxWidth: 400,
          mx: "auto",
          my: 4,
          py: 3,
          px: 2,
          display: "flex",
          flexDirection: "column",
          gap: 2,
          borderRadius: "sm",
          boxShadow: "md",
        }}
      >
        <CssBaseline />
        <h1>Join Game</h1>
        
        <TextField
          label="Username"
          variant="outlined"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          margin="normal"
          fullWidth
          disabled={!!location?.state?.userProfile?.username}
        />
        
        <TextField
          label="Lobby Code"
          variant="outlined"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          margin="normal"
          fullWidth
          helperText={error}
          error={!!error}
        />
        
        <Button 
          onClick={handleJoin} 
          className="join-button"
          disabled={isLoading}
          sx={{
            mt: 2,
            "&:hover": {
              color: "white",
            },
          }}
        >
          {isLoading ? "Joining..." : "Join Game"}
        </Button>
        
        <Button 
          onClick={() => navigate("/profile", { state: location?.state })} 
          className="back-button"
          disabled={isLoading}
          sx={{
            mt: 1,
            "&:hover": {
              color: "white",
            },
          }}
        >
          Back to Profile
        </Button>
      </Box>
    </div>
  );
}

export default JoinGame;