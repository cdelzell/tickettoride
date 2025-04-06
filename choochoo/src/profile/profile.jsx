import { Avatar } from "@mui/material";
import Box from "@mui/joy/Box";
import CssBaseline from "@mui/joy/CssBaseline";
import { useTheme, useMediaQuery } from "@mui/material";
import Button from "@mui/joy/Button";
import { Grid2 } from "@mui/material";
import { useEffect, useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";

import "./profile.css";
import firebase from "firebase/compat/app";

function App() {
  return <Profile />;
}

function Profile() {
  const navigate = useNavigate();
  const { state } = useLocation(); // Use location to get the state passed from navigate
  const { userKey, userProfile } = state || {}; // Fallback to empty object if state is undefined

  const handleNavGame = () => {
    navigate("/main_game_page", { state: { userProfile } });
  };

  const handleJoinGame = () => {
    navigate("/lobby", { state: { userProfile } }); // Navigate to the Lobby with userProfile state
  };

  // const [profileData, setProfileData] = useState(() => {
  //   // Try to load profile data from sessionStorage if it exists
  //   const storedProfile = sessionStorage.getItem("userProfile");
  //   return storedProfile ? JSON.parse(storedProfile) : userProfile;
  // });

  // Destructure only from profileData, which will contain either sessionStorage data or userProfile from location
  const { username, wins, total_score, profile_picture } = userProfile || {};
  console.log(userProfile);
  console.log(userKey);

  // useEffect(() => {
  //   // Save userProfile data to sessionStorage whenever it changes
  //   if (profileData) {
  //     sessionStorage.setItem("userProfile", JSON.stringify(profileData));
  //   }
  // }, [profileData]);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const isMediumScreen = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <main className="background_set_up">
      <CssBaseline />
      <Box
        sx={{
          width: isSmallScreen ? "40vw" : isMediumScreen ? "55vw" : 500,
          height: isSmallScreen ? "50vw" : isMediumScreen ? "60vw" : 550,
          backgroundColor: "white",
          maxHeight: 700,
          maxWidth: 500,
          mx: "auto", // margin left & right
          my: 4, // margin top & bottom
          py: 3, // padding top & bottom
          px: 2, // padding left & right
          display: "flex",
          flexDirection: "column",
          gap: 2,
          borderRadius: "sm",
          boxShadow: "md",
          // overflowY: "scroll",
          minHeight: 50,
        }}
      >
        <Grid2 container spacing={2} rowSpacing={"3vw"}>
          <Grid2 size={5}>
            <Avatar
              alt={username || "User Profile"}
              src={profile_picture || "./src/assets/trains/thomas_train.jpg"}
              sx={{
                width: isSmallScreen ? "13vw" : isMediumScreen ? "20vw" : 170,
                height: isSmallScreen ? "13vw" : isMediumScreen ? "20vw" : 170,
                ml: "2vw",
              }}
            />
          </Grid2>
          <Grid2 size={7}>
            <div className="profile_name">
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
              <p
                style={{
                  fontSize: isSmallScreen
                    ? "1.5vw"
                    : isMediumScreen
                    ? "clamp(15px, 3vw, 18px)"
                    : "clamp(19px, 4vw, 23px)",
                }}
              >
                Total wins: {wins}
              </p>
              <p
                style={{
                  fontSize: isSmallScreen
                    ? "1.5vw"
                    : isMediumScreen
                    ? "clamp(15px, 3vw, 18px)"
                    : "clamp(19px, 4vw, 23px)",
                }}
              >
                All time points: {total_score}
              </p>
            </div>
          </Grid2>
          <Grid2 size={12}>
            <span></span>
          </Grid2>
          <Grid2 size={12}>
            <span></span>
          </Grid2>
          <Grid2
            size={12}
            display={"flex"}
            justifyContent={"space-between"}
            marginX={"1vw"}
          >
            <Button
              className="button"
              onClick={handleNavGame}
              sx={{
                "&:hover": {
                  color: "white",
                },
              }}
            >
              Make Game
            </Button>
            <Button
              className="button"
              onClick={handleJoinGame}
              sx={{
                "&:hover": {
                  color: "white",
                },
              }}
            >
              Join Game
            </Button>
            <Button
              className="button"
              component={Link}
              to={{
                pathname: "/edit_profile",
                state: {
                  userKey,
                  userProfile,
                },
              }}
              sx={{
                "&:hover": {
                  color: "white",
                },
              }}
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
