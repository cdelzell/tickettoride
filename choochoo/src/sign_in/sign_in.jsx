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
import { useWebSocket } from "../web_socket";
import { useState } from "react";

import "./sign_in.css";

function Login() {
  const { message, setMessage, sendMessage, receivedMessage } = useWebSocket(
    "ws://localhost:5173"
  );

  const handleSubmit = (e) => {
    e.preventDefault();

    // Send both email and password to the backend via WebSocket
    sendMessage({
      type: "login", // Custom message type for login
      email: email,
      password: password,
    });

    setEmail(""); // Clear the email field
    setPassword(""); // Clear the password field
    console.log("Sent credentials to backend:", email, password); // Optionally log the credentials (be careful with production!)
  };

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const isMediumScreen = useMediaQuery(theme.breakpoints.down("md"));

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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
        <FormControl>
          <FormLabel>Email</FormLabel>
          <Input
            // html input attribute
            name="email"
            type="email"
            placeholder="thomasthetrain@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Password</FormLabel>
          <Input
            // html input attribute
            name="password"
            type="password"
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </FormControl>
        <Button
          component="a"
          href="/profile"
          type="submit"
          onClick={handleSubmit}
          sx={{
            mt: 1,
            "&:hover": {
              backgroundColor: "primary.dark",
              color: "white",
            },
          }}
        >
          Log in
        </Button>
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
