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
import "./sign_up.css";

function Render_Page() {
  return <Sign_Up />;
}

function Sign_Up() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const isMediumScreen = useMediaQuery(theme.breakpoints.down("md"));

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      if (!username || !password || !email) {
        setError("Error: Please fill out all fields!");
        return;
      }

      const exists = await doesUserExist(username, email);
      if (exists) {
        setError("Error: Username or email already exists!");
        return;
      }

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

      const userKey = await writeUserToDatabase(user,user.username);
      sessionStorage.setItem("userProfile", JSON.stringify(user));
      navigate("/profile", { state: { userKey, userProfile: user } });
    } catch (err) {
      setError("Error: Something went wrong. Try again soon!");
    }
  };

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
          <Typography level="body-md">Sign up to continue.</Typography>
        </div>

        <form onSubmit={handleSubmit}>
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

          {error && (
            <Typography sx={{ color: "red", fontSize: "sm" }}>
              {error}
            </Typography>
          )}

          <Button type="submit" sx={{ mt: 1 }}>
            Sign Up
          </Button>
        </form>
      </Sheet>
    </main>
  );
}

export default Render_Page;
