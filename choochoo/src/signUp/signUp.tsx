/**
 * SignUp Component
 * This component handles user registration functionality.
 * It provides a form for new users to create an account and manages the signup process.
 */

import Sheet from "@mui/joy/Sheet";
import CssBaseline from "@mui/joy/CssBaseline";
import Typography from "@mui/joy/Typography";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";
import Button from "@mui/joy/Button";
import { useTheme, useMediaQuery } from "@mui/material";
import {
  doesUserExist,
  writeUserToDatabase,
} from "../firebase/FirebaseWriteUserData";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "./signUp.css";
import { findUserByUsername } from "@/firebase/FirebaseReadUser";

/**
 * Wrapper component for the SignUp page
 */
function Render_Page() {
  return <Sign_Up />;
}

/**
 * Main SignUp component that handles user registration
 */
function Sign_Up() {
  // Navigation and responsive design hooks
  const navigate = useNavigate();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const isMediumScreen = useMediaQuery(theme.breakpoints.down("md"));

  // State management for form inputs and error handling
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  /**
   * Handles form submission and user registration
   * @param e - Form event object
   */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      // Validate form inputs
      if (!username || !password || !email) {
        setError("Error: Please fill out all fields!");
        return;
      }

      // Check if user already exists
      const exists = await doesUserExist(username, email);
      if (exists) {
        setError("Error: Username or email already exists!");
        return;
      }

      // Create new user object with default values
      const user = {
        username,
        email,
        password,
        wins: 0,
        losses: 0,
        total_score: 0,
        profile_picture: "default",
        status: false,
        active_game_id: null,
      };

      // Write user data to database
      writeUserToDatabase(user);
      
      // Fetch user data to get the generated key
      const results = await findUserByUsername(user.username, true);
      const { userKey, userData } = results || {};

      // Store user data in session storage
      sessionStorage.setItem("userProfile", JSON.stringify(user));
      
      // Navigate to profile page with user data
      navigate("/profile", { state: { userKey: userKey, userProfile: user } });
    } catch (err) {
      setError("Error: Something went wrong. Try again soon!");
    }
  };

  return (
    <main className="loginPage">
      <CssBaseline />
      {/* Main signup form container */}
      <Sheet
        sx={{
          width: isSmallScreen ? "60%" : isMediumScreen ? "60%" : 500,
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
          minHeight: 50,
        }}
        variant="outlined"
      >
        {/* Header section */}
        <div>
          <Typography level="h1" component="h1">
            <b>Welcome!</b>
          </Typography>
          <Typography level="body-md">Sign up to continue.</Typography>
        </div>

        {/* Registration form */}
        <form onSubmit={handleSubmit}>
          {/* Username input field */}
          <FormControl>
            <FormLabel>Username</FormLabel>
            <Input
              name="username"
              type="text"
              placeholder="Thomas-the-train"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </FormControl>

          {/* Email input field */}
          <FormControl>
            <FormLabel>Email</FormLabel>
            <Input
              name="email"
              type="email"
              placeholder="thomas@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </FormControl>

          {/* Password input field */}
          <FormControl>
            <FormLabel>Password</FormLabel>
            <Input
              name="password"
              type="password"
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </FormControl>

          {/* Error message display */}
          {error && (
            <Typography sx={{ color: "red", fontSize: "sm" }}>
              {error}
            </Typography>
          )}

          {/* Submit button */}
          <Button type="submit" sx={{ mt: 1 }}>
            Sign Up
          </Button>
        </form>
      </Sheet>
    </main>
  );
}

export default Render_Page;
