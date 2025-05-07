/**
 * SignIn Component
 * This component handles user authentication and login functionality.
 * It provides a form for users to enter their credentials and manages the login process.
 */

import { useTheme, useMediaQuery } from "@mui/material";
import Sheet from "@mui/joy/Sheet";
import CssBaseline from "@mui/joy/CssBaseline";
import Typography from "@mui/joy/Typography";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";
import Button from "@mui/joy/Button";
import Link from "@mui/joy/Link";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { handleLogIn } from "../firebase/FirebaseLogInManager";

import "./signIn.css";

function Login() {
  // State management for form inputs and error handling
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // Stores error messages for display

  // Responsive design hooks
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const isMediumScreen = useMediaQuery(theme.breakpoints.down("md"));

  const navigate = useNavigate(); // Hook for programmatic navigation

  /**
   * Handles form submission and user authentication
   * @param e - Form event object
   */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      // Attempt to log in user with provided credentials
      const result = await handleLogIn(username, password);

      if (result === null) {
        setError("Error: Username not found");
        return;
      }

      const [isSuccessful, userKey, userData] = result;

      if (isSuccessful && userData) {
        // Process and normalize profile picture data
        const rawPic =
          userData.profile_picture?.split("/").pop()?.split(".")[0] ||
          "default";
        const normalizedPic = rawPic.split("-")[0];

        // Clean and prepare user data for storage
        const cleanedUserData = {
          ...userData,
          profile_picture: normalizedPic,
        };

        // Store user data in session storage
        sessionStorage.setItem("userProfile", JSON.stringify(cleanedUserData));
        
        // Navigate to profile page with user data
        navigate("/profile", {
          state: { userKey: userKey, userProfile: cleanedUserData },
        });
      }
    } catch (err) {
      // Handle authentication errors
      setError("Error: Username or password incorrect");
    }
  };

  return (
    <main className="loginPage">
      <CssBaseline />
      {/* Main login form container */}
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
          <Typography level="body-md">Sign in to continue.</Typography>
        </div>

        {/* Login form */}
        <form onSubmit={handleSubmit}>
          {/* Username input field */}
          <FormControl>
            <FormLabel>Username</FormLabel>
            <Input
              name="username"
              type="text"
              placeholder="thomasthetrain"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </FormControl>

          {/* Password input field */}
          <FormControl>
            <FormLabel
              sx={{
                mt: 1,
              }}
            >
              Password
            </FormLabel>
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
          <Button
            type="submit"
            sx={{
              mt: 3.5,
            }}
          >
            Log in
          </Button>
        </form>

        {/* Sign up link */}
        <Typography
          endDecorator={<Link href="/sign_up">Sign up</Link>}
          sx={{ fontSize: "sm", alignSelf: "center" }}
        >
          Don&apos;t have an account?
        </Typography>
      </Sheet>
    </main>
  );
}

export default Login;
