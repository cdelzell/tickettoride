import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "@mui/joy/Button";
import Box from "@mui/joy/Box";
import CssBaseline from "@mui/joy/CssBaseline";
import Alert from "@mui/joy/Alert";
import { useTheme, useMediaQuery } from "@mui/material";
import FirebaseLobbyWrite, { Player, Lobby as LobbyType } from "../Firebase/FirebaseLobbyWrite";
import "./lobby.css";

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
  
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  

  useEffect(() => {
    const initializeLobby = async () => {
      try {
        setIsLoading(true);
        
        let code = sessionStorage.getItem("lobbyCode");
        
        if (!code && !isJoining && username) {
          code = await FirebaseLobbyWrite.createLobby(username);
          sessionStorage.setItem("lobbyCode", code);
        } else if (isJoining && username && code) {
          const userId = state?.userKey;
          await FirebaseLobbyWrite.joinLobby(code, username, userId);
        }
        
        if (code) {
          setLobbyCode(code);
        } else {
          setError("No lobby code found");
        }
      } catch (err) {
        console.error("Lobby initialization error:", err);
        setError(`Failed to ${isJoining ? 'join' : 'create'} lobby. ${err instanceof Error ? err.message : ''}`);
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
    
    const unsubscribe = FirebaseLobbyWrite.onLobbyUpdate(lobbyCode, (updatedLobby) => {
      setLobby(updatedLobby);
      
      if (updatedLobby.players) {
        setPlayers(Object.values(updatedLobby.players));
      }
      
      // did game start?
      if (updatedLobby.status === "started") {
        setGameStarting(true);
        
        navigate("/main_game_page", { 
          state: { 
            players: Object.values(updatedLobby.players), 
            lobbyCode,
            userProfile 
          } 
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
        await FirebaseLobbyWrite.startGame(lobbyCode);
        
        // nav will happen via the lobby status change listener
      } else {
        setError("Need at least 2 players to start the game");
      }
    } catch (err) {
      console.error("Failed to start game:", err);
      setError("Failed to start game");
      setGameStarting(false);
    }
  };
  
  const handleCopyCode = () => {
    navigator.clipboard.writeText(lobbyCode);
    alert("Lobby code copied to clipboard!");
  };
  
  const handleLeave = async () => {
    try {
      if (username && lobbyCode) {
        await FirebaseLobbyWrite.leaveLobby(lobbyCode, username);
        sessionStorage.removeItem("lobbyCode");
      }
      
      navigate("/profile", { state: { userProfile } });
    } catch (err) {
      console.error("Failed to leave lobby:", err);
      setError("Failed to leave lobby");
    }
  };

  if (isLoading) {
    return (
      <div className="lobby-container">
        <Box sx={{ textAlign: 'center', padding: 4 }}>
          <h2>Loading lobby...</h2>
        </Box>
      </div>
    );
  }

  //  added to make sure game doesn't start immediatly 
  if (gameStarting) {
    return (
      <div className="lobby-container">
        <Box sx={{ textAlign: 'center', padding: 4 }}>
          <h2>Game starting...</h2>
          <p>Please wait while the game is being prepared.</p>
        </Box>
      </div>
    );
  }

  if (error) {
    return (
      <div className="lobby-container">
        <Box sx={{ textAlign: 'center', padding: 4 }}>
          <h2>Error</h2>
          <p>{error}</p>
          <Button onClick={() => navigate("/profile", { state: { userProfile } })}>
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
          width: isSmallScreen ? "80vw" : 500,
          backgroundColor: "white",
          maxWidth: 500,
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
        <h1>Game Lobby</h1>
        <div className="lobby-code-container">
          <h2 className="lobby-code">Lobby Code: {lobbyCode}</h2>
          <Button onClick={handleCopyCode} className="copy-button">
            Copy Code
          </Button>
        </div>
        <p>Share this code with your friends to join!</p>
        
        <h3>Players ({players.length}/4)</h3>
        <ul className="player-list">
          {players.map((player, index) => (
            <li key={index}>
              {player.username} {player.isHost ? "(Host)" : ""}
            </li>
          ))}
        </ul>
        
        <div className="button-container">
          {players.some(p => p.username === username && p.isHost) && (
            <Button 
              onClick={handleStartGame} 
              className="start-button"
              disabled={players.length < 2} 
              sx={{
                bgcolor: players.length < 2 ? 'gray' : 'primary',
                "&:hover": {
                  color: "white",
                },
              }}
            >
              Start Game {players.length < 2 ? "(Need more players)" : ""}
            </Button>
          )}
          
          <Button 
            onClick={handleLeave} 
            className="leave-button"
            sx={{
              bgcolor: 'error.main',
              "&:hover": {
                color: "white",
              },
            }}
          >
            Leave Lobby
          </Button>
        </div>
      </Box>
    </div>
  );
}

export default Lobby;