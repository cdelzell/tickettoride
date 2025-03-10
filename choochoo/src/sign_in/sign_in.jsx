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
import { createRoot } from "react-dom/client";
import { StrictMode } from "react";
import { useState } from "react";
import { handleLogIn } from "../Firebase/FirebaseLogInManager";
import { writeUserToDatabase} from "../Firebase/FirebaseWriteUserData.ts";

import "./sign_in.css";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const isMediumScreen = useMediaQuery(theme.breakpoints.down("md"));

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Assuming handleLogIn returns a promise
      const firebaseData = await handleLogIn(username, password);
      const success = firebaseData[0]; // boolean value for if username and password were correct
      const userKey = firebaseData[1];
      const userProfile = firebaseData[2];
      if (success) {
        // Redirect to profile on successful login 
        // and passing the userKey onto the profile page
        // to allow for loading of stats
        navigate("/profile", {state: {userKey, userProfile}});
      } else {
        // Handle failed login attempt
        setError("Error: Username or password incorrect");
      }
    } catch (err) {
      // Catch any unexpected errors (e.g., network issues)
      setError("Error: Something went wrong. Please try again.");
    }
  };

  const isFormValid = username.trim() !== "" && password.trim() !== ""; // Check if both inputs are filled

  return (
    <main className="loginPage">
      <CssBaseline />
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
        <div>
          <Typography level="h1" component="h1">
            <b>Welcome!</b>
          </Typography>
          <Typography level="body-med">Sign in to continue.</Typography>
        </div>
        <form onSubmit={handleSubmit}>
          <FormControl>
            <FormLabel>Email</FormLabel>
            <Input
              name="username"
              type="text"
              placeholder="thomasthetrain"
              value={username}
              onChange={(e) => setUsername(e.target.value)} // Update state when input changes
            />
          </FormControl>
          <FormControl>
            <FormLabel>Password</FormLabel>
            <Input
              name="password"
              type="password"
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)} // Update state when input changes
            />
          </FormControl>
          {error && (
            <Typography sx={{ color: "red", fontSize: "sm" }}>
              {error}
            </Typography>
          )}
          <Button
            type="submit"
            disabled={!isFormValid} // Disable button if form is invalid
            sx={{
              mt: 1,
            }}
          >
            Log in
          </Button>
        </form>
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
