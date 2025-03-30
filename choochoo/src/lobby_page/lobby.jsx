import { useLocation } from "react-router-dom";
import React from "react";

function Lobby() {
  const { state } = useLocation(); // Get userProfile state from the navigation

  const { username } = state || {}; // Fallback to empty object if state is undefined

  return (
    <div>
      <h1>Welcome to the Lobby, {username}!</h1>
      {/* You can add more components for the lobby here, like a list of available games */}
    </div>
  );
}

export default Lobby;
