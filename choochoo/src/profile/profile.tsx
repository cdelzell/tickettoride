/**
 * Profile Component
 * This component displays the user's profile information and provides navigation to:
 * - Create a new game
 * - Join an existing game
 * - Edit profile information
 * It handles user data persistence and profile picture display.
 */

import { Avatar } from "@mui/material";
import Box from "@mui/joy/Box";
import CssBaseline from "@mui/joy/CssBaseline";
import { useTheme, useMediaQuery } from "@mui/material";
import Button from "@mui/joy/Button";
import { Grid2 } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./profile.css";
import { profileImages } from "@/imageImports";

/**
 * Wrapper component for the Profile page
 */
function App() {
  return <Profile />;
}

/**
 * Main Profile component that displays user information and navigation options
 */
function Profile() {
  // Responsive design hooks
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const isMediumScreen = useMediaQuery(theme.breakpoints.down("md"));
  
  // Navigation and state management
  const navigate = useNavigate();
  const { state } = useLocation();

  // User data state management
  const [userKey, setUserKey] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<any>(null);

  /**
   * Effect hook to initialize user data from state or session storage
   */
  useEffect(() => {
    const stateUserKey = state?.userKey;
    const stateUserProfile = state?.userProfile;
    const storedProfile = JSON.parse(
      sessionStorage.getItem("userProfile") || "{}"
    );

    if (stateUserProfile && stateUserKey) {
      setUserKey(stateUserKey);
      setUserProfile(stateUserProfile);
      sessionStorage.setItem("userProfile", JSON.stringify(stateUserProfile));
    } else if (storedProfile) {
      setUserProfile(storedProfile);
    }
  }, [state]);

  // Early return if profile isn't loaded yet
  if (!userProfile) return null;

  // Extract user data from profile
  const { username, wins, total_score, profile_picture } = userProfile;
  const resolvedProfilePic =
    profileImages[profile_picture as keyof typeof profileImages] ??
    profileImages.default;

  const updatedUserProfile = { ...userProfile, resolvedProfilePic };

  /**
   * Handles navigation to create a new game
   */
  const handleNavGame = () => {
    sessionStorage.setItem("userProfile", JSON.stringify(userProfile));
    navigate("/lobby", { state: { userProfile: updatedUserProfile } });
  };

  /**
   * Handles navigation to join an existing game
   */
  const handleJoinGame = () => {
    sessionStorage.setItem("userProfile", JSON.stringify(userProfile));
    navigate("/join_game", { state: { userProfile: updatedUserProfile } });
  };

  return (
    <main className="background_set_up">
      <CssBaseline />
      {/* Main profile container */}
      <Box
        sx={{
          width: isSmallScreen ? "40vw" : isMediumScreen ? "55vw" : 500,
          height: isSmallScreen ? "50vw" : isMediumScreen ? "60vw" : 550,
          backgroundColor: "white",
          maxHeight: 700,
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
      >
        <Grid2 container spacing={2} rowSpacing={"3vw"}>
          {/* Profile picture section */}
          <Grid2 size={5}>
            <Avatar
              alt={username || "User Profile"}
              src={resolvedProfilePic}
              sx={{
                width: isSmallScreen ? "13vw" : isMediumScreen ? "20vw" : 170,
                height: isSmallScreen ? "13vw" : isMediumScreen ? "20vw" : 170,
                ml: "2vw",
              }}
            />
          </Grid2>

          {/* User information section */}
          <Grid2 size={7}>
            <div className="profile_name">
              {/* Username display */}
              <h3
                style={{
                  fontSize: isSmallScreen
                    ? "3vw"
                    : isMediumScreen
                    ? "clamp(30px, 7vw, 34px)"
                    : "clamp(35px, 8vw, 39px)",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {username}
              </h3>
              {/* Wins display */}
              <p
                style={{
                  fontSize: isSmallScreen
                    ? "1.5vw"
                    : isMediumScreen
                    ? "clamp(15px, 3vw, 18px)"
                    : "clamp(19px, 4vw, 23px)",
                }}
              >
                Total wins: {wins === undefined ? 0 : wins}
              </p>
              {/* Total score display */}
              <p
                style={{
                  fontSize: isSmallScreen
                    ? "1.5vw"
                    : isMediumScreen
                    ? "clamp(15px, 3vw, 18px)"
                    : "clamp(19px, 4vw, 23px)",
                }}
              >
                All time points: {total_score === undefined ? 0 : total_score}
              </p>
            </div>
          </Grid2>

          {/* Spacer grid items */}
          <Grid2 size={12}>
            <span></span>
          </Grid2>
          <Grid2 size={12}>
            <span></span>
          </Grid2>

          {/* Action buttons section */}
          <Grid2
            size={12}
            display={"flex"}
            justifyContent={"space-between"}
            marginX={"1vw"}
          >
            {/* Create game button */}
            <Button
              className="button"
              onClick={handleNavGame}
              sx={{ "&:hover": { color: "white" } }}
            >
              Make Game
            </Button>
            {/* Join game button */}
            <Button
              className="button"
              onClick={handleJoinGame}
              sx={{ "&:hover": { color: "white" } }}
            >
              Join Game
            </Button>
            {/* Edit profile button */}
            <Button
              className="button"
              onClick={() => {
                navigate("/edit_profile", {
                  state: { userKey, userProfile },
                });
              }}
              sx={{ "&:hover": { color: "white" } }}
            >
              Edit Profile
            </Button>
          </Grid2>
        </Grid2>
      </Box>
    </main>
  );
}

export default App;
