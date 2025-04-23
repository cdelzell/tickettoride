import { useState } from "react";
import Sheet from "@mui/joy/Sheet";
import CssBaseline from "@mui/joy/CssBaseline";
import Typography from "@mui/joy/Typography";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";
import Button from "@mui/joy/Button";
import Avatar from "@mui/material/Avatar";
import { useLocation, useNavigate } from "react-router-dom";
import {
  setUsername,
  setPassword,
  setProfilePicture,
  doesUserExist,
} from "../firebase-temp/FirebaseWriteUserData";

import { useTheme, useMediaQuery } from "@mui/material";
import "./editProfile.css";

import { profileImages as PROFILE_IMAGES } from "@/image_imports";

function Render_Page() {
  return <EditProfile />;
}

function EditProfile() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const isMediumScreen = useMediaQuery(theme.breakpoints.down("md"));

  const [error, setError] = useState("");
  const { state } = useLocation();
  const { userKey, userProfile } = state || {};
  const { player_username, wins, total_score, profile_picture } =
    userProfile || {};

  const [username, setUsernameState] = useState("");
  const [password, setPasswordState] = useState("");
  const [selectedImageKey, setSelectedImageKey] = useState(
    profile_picture || "default"
  );

  const handleImageChange = (imageUrl: string) => {
    const fileName = imageUrl.split("/").pop()?.split(".")[0] || "default";
    const cleanKey = fileName.split("-")[0];
    setSelectedImageKey(cleanKey);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (username !== "" && (await doesUserExist(username, ""))) {
        await setUsername(userKey, username, true);
      }
      if (password !== "") {
        await setPassword(userKey, password, true);
      }

      if (selectedImageKey !== profile_picture) {
        await setProfilePicture(userKey, selectedImageKey, true);
      }

      const updatedUserProfile = {
        ...userProfile,
        username: username.trim() !== "" ? username : userProfile.username,
        wins,
        total_score,
        profile_picture: selectedImageKey,
      };

      sessionStorage.setItem("userProfile", JSON.stringify(updatedUserProfile));
      navigate("/profile", {
        state: { userKey, userProfile: updatedUserProfile },
      });
    } catch (err) {
      setError(
        "Error: Issues changing profile data at this time. Please try again later!"
      );
    }
  };

  const predefinedImagesProfile = Object.entries(PROFILE_IMAGES).filter(
    ([key]) => key !== "default"
  );

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
            <b>Hello!</b>
          </Typography>
          <Typography level="body-md">
            If you would like to change your username, password, or both, please
            fill out the appropriate fields! If you would not like to change
            something, please leave the field blank.
          </Typography>
        </div>

        <form onSubmit={handleSubmit}>
          <div
            style={{
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Avatar
              src={PROFILE_IMAGES[selectedImageKey] || PROFILE_IMAGES.default}
              alt="Profile Picture"
              sx={{ width: 100, height: 100, margin: "auto", mb: 2 }}
            />
            <div
              className="image-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: ".5vw",
                width: "100%",
                marginBottom: "1vw",
                justifyItems: "center",
                alignItems: "center",
              }}
            >
              {predefinedImagesProfile.map(([key, url], index) => (
                <Avatar
                  key={index}
                  src={url}
                  alt={`PFP ${key}`}
                  sx={{
                    width: 50,
                    height: 50,
                    cursor: "pointer",
                    border:
                      selectedImageKey === key ? "2px solid blue" : "none",
                  }}
                  onClick={() => handleImageChange(url)}
                />
              ))}
            </div>
          </div>

          <FormControl>
            <FormLabel>New Username</FormLabel>
            <Input
              placeholder="Thomas-the-train"
              value={username}
              onChange={(e) => setUsernameState(e.target.value)}
            />
          </FormControl>

          <FormControl>
            <FormLabel>New Password</FormLabel>
            <Input
              placeholder="Confirm password"
              value={password}
              onChange={(e) => setPasswordState(e.target.value)}
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
              "&:hover": {
                color: "white",
              },
            }}
          >
            Save Changes
          </Button>
        </form>
      </Sheet>
    </main>
  );
}

export default Render_Page;
