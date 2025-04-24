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

function App() {
  return <Profile />;
}

function Profile() {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const isMediumScreen = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();
  const { state } = useLocation();

  const [userKey, setUserKey] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<any>(null);

  // On mount, grab user data from state or sessionStorage
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

  const { username, wins, total_score, profilePicture } = userProfile;
  const resolvedProfilePic =
    profileImages[profilePicture as keyof typeof profileImages] ??
    profileImages.default;

  const updatedUserProfile = { ...userProfile, resolvedProfilePic };
  console.log(updatedUserProfile);

  const handleNavGame = () => {
    sessionStorage.setItem("userProfile", JSON.stringify(userProfile));
    navigate("/lobby", { state: { userProfile } });
  };

  const handleJoinGame = () => {
    sessionStorage.setItem("userProfile", JSON.stringify(userProfile));
    navigate("/join_game", { state: { userProfile } });
  };

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
                Total wins: {wins === undefined ? 0 : wins}
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
                All time points: {total_score === undefined ? 0 : total_score}
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
              sx={{ "&:hover": { color: "white" } }}
            >
              Make Game
            </Button>
            <Button
              className="button"
              onClick={handleJoinGame}
              sx={{ "&:hover": { color: "white" } }}
            >
              Join Game
            </Button>
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
