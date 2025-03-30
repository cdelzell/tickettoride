import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "@mui/joy/Button";
import "./lobby.css";

function Lobby() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const storedProfile = sessionStorage.getItem("userProfile");
  const userProfile = state?.userProfile || (storedProfile ? JSON.parse(storedProfile) : null);
  const username = userProfile?.username || `Guest${Math.floor(1000 + Math.random() * 9000)}`;

  const [players, setPlayers] = useState([]);
  const [lobbyCode, setLobbyCode] = useState("");


  useEffect(() => {
    let code = sessionStorage.getItem("lobbyCode");
    if (!code) {
      code = Math.floor(100000000 + Math.random() * 900000000).toString();
      sessionStorage.setItem("lobbyCode", code);
    }
    setLobbyCode(code);
  }, []);


  useEffect(() => {
    const storedPlayers = sessionStorage.getItem("players");
    if (storedPlayers) {
      setPlayers(JSON.parse(storedPlayers));
    }
  }, []);

  useEffect(() => {
    if (username && !players.some((p) => p.username === username)) {
      const updatedPlayers = [...players, { username }];
      setPlayers(updatedPlayers);
      sessionStorage.setItem("players", JSON.stringify(updatedPlayers));
    }
  }, [username, players]);

  const handleStartGame = () => {
    if (players.length === 4) {
      navigate("/main_game_page", { state: { players, lobbyCode } });
    }
  };

  return (
    <div className="lobby-container">
      <div className="lobby-card">
        <h1>Welcome to the Lobby, {username}!</h1>
        <br></br>
        <br></br>
        <h2 className="lobby-code">Lobby Code: {lobbyCode}</h2>
        <p>Share this code with your friends to join!</p>
        <br></br>
        <br></br>
        <h3>Players Joined:</h3>
        <ul className="player-list">
          {players.map((player, index) => (
            <li key={index}>{player.username}</li>
          ))}
        </ul>

        {players.length < 4 ? (
          <p>Waiting for more players to join... ({players.length}/4)</p>
        ) : (
          <Button onClick={handleStartGame} className="start-button">
            Start Game
          </Button>
        )}
      </div>
    </div>
  );
}

export default Lobby;
