import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sign_In from "/src/sign_in/sign_in.jsx";
import Sign_Up from "/src/sign_up/sign_up.jsx";
import Profile from "/src/profile/profile.jsx";
import "./index.css";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Sign_In />} />
        <Route path="Sign_Up" element={<Sign_Up />} />
        <Route path="Profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
