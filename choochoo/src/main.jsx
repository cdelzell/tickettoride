import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sign_In from "/src/signIn/signIn.jsx";
import Sign_Up from "/src/signUp/signUp.jsx";
import Main_Game_Page from "/src/mainGamePage/mainGamePage.jsx";
import Profile from "/src/profile/profile.jsx";
import Lobby from "/src/lobbyPage/lobby.jsx";
import JoinGame from "/src/joinGamePage/joinGame.jsx";
import Edit_Profile from "/src/editProfile/editProfile.jsx";
import "./index.css";
import GameRunner from "./backend/gameRunner.js";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Sign_In />} />
        <Route path="Sign_Up" element={<Sign_Up />} />
        <Route path="Main_Game_Page" element={<Main_Game_Page />} />
        <Route path="Profile" element={<Profile />} />
        <Route path="Lobby" element={<Lobby />} />
        <Route path="Edit_Profile" element={<Edit_Profile />} />
        <Route path="Join_Game" element={<JoinGame />} />
      </Routes>
    </BrowserRouter>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
export default App;
