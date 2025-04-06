import Sheet from "@mui/joy/Sheet";
import CssBaseline from "@mui/joy/CssBaseline";
import Typography from "@mui/joy/Typography";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";
import Button from "@mui/joy/Button";
import { writeUserToDatabase } from "../Firebase/FirebaseWriteUserData";
import { useLocation, useNavigate, Link } from "react-router-dom";

import "./sign_up.css";

function Render_Page() {
  return <Sign_In className="Login" />;
}

import { useTheme, useMediaQuery } from "@mui/material";

function Sign_In() {
  const navigate = useNavigate();

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const isMediumScreen = useMediaQuery(theme.breakpoints.down("md"));

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // To store the error message

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if ((username == "") | (password == "") | (email == "")) {
        setError("Error: Please fill out all fields!");
      } else {
        user = {
          username: { username }, // String
          email: { email }, // String
          password: { password }, // String
          wins: 0, // Int
          losses: 0, // Int
          total_score: 0, // Int
          profile_picture: "", // String
          status: false, // Bool
        };

        userKey = writeUserToDatabase(user);

        navigate("/profile", {
          state: { userKey, userProfile: user },
        });
      }

      // Rebuild the updated user profile (excluding password)
      const updatedUserProfile = {
        ...userProfile, // Spread the current userProfile to retain existing fields
        username: username.trim() !== "" ? username : userProfile.username, // Update username if new one is provided
        wins: wins,
        total_score: total_score,
        profile_picture:
          selectedImageUrl !== PROFILE_IMAGES.default
            ? selectedImageUrl
            : profile_picture, // Update profile picture if new one is selected
      };

      console.log("userProfile" + updatedUserProfile);

      navigate("/profile", {
        state: { userKey, userProfile: updatedUserProfile },
      });
      // Redirect to profile on successful login
      // navigate("/profile", { state: { userKey, userProfile } });
    } catch (err) {
      // Catch any unexpected errors (e.g., network issues)
      setError("Error: Something went wrong, try again soon!");
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
          <Typography level="body-med">Sign up to continue.</Typography>
        </div>
        <form onSubmit={handleSubmit}>
          <FormControl>
            <FormLabel>Username</FormLabel>
            <Input
              // html input attribute
              name="username"
              type="username"
              placeholder="Thomas-the-train"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </FormControl>
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
          {error && (
            <Typography sx={{ color: "red", fontSize: "sm" }}>
              {error}
            </Typography>
          )}
          <Button
            type="submit"
            sx={{
              mt: 1,
            }}
          >
            Log in
          </Button>
        </form>
      </Sheet>
    </main>
  );
}

export default Render_Page;
