import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sign_In from "/src/sign_in/sign_in.jsx";
import Sign_Up from "/src/sign_up/sign_up.jsx";
import Main_Game_Page from "/src/main_game_page/main_game_page.jsx";
import "./index.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Sign_In />} />
        <Route path="Sign_Up" element={<Sign_Up />} />
        <Route path="Main_Game_Page" element={<Main_Game_Page />} />
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
