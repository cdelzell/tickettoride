import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sign_In from "/src/sign_in/sign_in.jsx";
import Sign_Up from "/src/sign_up/sign_up.jsx";
import Main_Game_Page from "/src/main_game_page/main_game_page.jsx";
import Profile from "/src/profile/profile.jsx";
import Lobby from "/src/lobby_page/lobby.jsx"
import Edit_Profile from "/src/edit_profile/edit_profile.jsx";
import "./index.css";
import GameRunner from "./backend/game-runner.js";

const gameRunner = new GameRunner(["Billy", "Bob", "Joe"]);
console.log("GameRunner Instance:", gameRunner);

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
      </Routes>
    </BrowserRouter>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
export default App;

// createRoot(document.getElementById("root")).render(
//   <StrictMode>
//     <App />
//   </StrictMode>
// );
