/**
 * EditProfile Component
 * This component allows users to modify their profile information including:
 * - Username
 * - Password
 * - Profile picture
 * It handles form submission and updates the user's data in Firebase.
 */

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
} from "../firebase/FirebaseWriteUserData";

import { useTheme, useMediaQuery } from "@mui/material";
import "./editProfile.css";

import { profileImages as PROFILE_IMAGES } from "@/imageImports";

/**
 * Wrapper component for the EditProfile page
 */
function Render_Page() {
  return <EditProfile />;
}

/**
 * Main EditProfile component that handles profile modifications
 */
function EditProfile() {
  // Navigation and responsive design hooks
  const navigate = useNavigate();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const isMediumScreen = useMediaQuery(theme.breakpoints.down("md"));

  // State management for form inputs and error handling
  const [error, setError] = useState("");
  const { state } = useLocation();
  const { userKey, userProfile } = state || {};
  const { player_username, wins, total_score, profile_picture } =
    userProfile || {};

  // Form state management
  const [username, setUsernameState] = useState("");
  const [password, setPasswordState] = useState("");
  const [selectedImageKey, setSelectedImageKey] = useState(
    profile_picture || "default"
  );

  /**
   * Handles profile picture selection
   * @param imageUrl - URL of the selected profile picture
   */
  const handleImageChange = (imageUrl: string) => {
    const fileName = imageUrl.split("/").pop()?.split(".")[0] || "default";
    const key = fileName.split("_")[0];
    const cleanKey = key.split("_")[0];
    setSelectedImageKey(cleanKey);
  };

  /**
   * Handles form submission and profile updates
   * @param e - Form event object
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Update username if provided and not already taken
      if (username !== "" && !(await doesUserExist(username, ""))) {
        await setUsername(userKey, username, true);
      }

      // Update password if provided
      if (password !== "") {
        await setPassword(userKey, password, true);
      }

      // Update profile picture if changed
      if (selectedImageKey !== profile_picture) {
        await setProfilePicture(userKey, selectedImageKey, true);
      }

      // Prepare updated user profile data
      const updatedUserProfile = {
        ...userProfile,
        username: username.trim() !== "" ? username : userProfile.username,
        wins,
        total_score,
        profile_picture: selectedImageKey,
      };

      // Update session storage with new profile data
      sessionStorage.setItem("userProfile", JSON.stringify(updatedUserProfile));
      
      // Navigate back to profile page with updated data
      navigate("/profile", {
        state: { userKey, userProfile: updatedUserProfile },
      });
    } catch (err) {
      setError(
        "Error: Issues changing profile data at this time. Please try again later!"
      );
    }
  };

  // Filter out default image from available profile pictures
  const predefinedImagesProfile = Object.entries(PROFILE_IMAGES).filter(
    ([key]) => key !== "default"
  );

  return (
    <main className="loginPage">
      <CssBaseline />
      {/* Main edit profile form container */}
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
            <b>Hello!</b>
          </Typography>
          <Typography level="body-md">
            If you would like to change your username, password, or both, please
            fill out the appropriate fields! If you would not like to change
            something, please leave the field blank.
          </Typography>
        </div>

        {/* Profile edit form */}
        <form onSubmit={handleSubmit}>
          {/* Profile picture selection section */}
          <div
            style={{
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {/* Current profile picture display */}
            <Avatar
              src={PROFILE_IMAGES[selectedImageKey] || PROFILE_IMAGES.default}
              alt="Profile Picture"
              sx={{
                width: 100,
                height: 100,
                margin: "auto",
                mb: "2vw",
                mt: "2vw",
              }}
            />
            {/* Profile picture selection grid */}
            <div
              className="image-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(5, 1fr)",
                gap: ".5vw",
                width: "100%",
                marginBottom: "2vw",
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

          {/* Username input field */}
          <FormControl>
            <FormLabel>New Username</FormLabel>
            <Input
              placeholder="Thomas-the-train"
              value={username}
              onChange={(e) => setUsernameState(e.target.value)}
            />
          </FormControl>

          {/* Password input field */}
          <FormControl>
            <FormLabel sx={{ mt: "1vw" }}>New Password</FormLabel>
            <Input
              placeholder="Confirm password"
              value={password}
              onChange={(e) => setPasswordState(e.target.value)}
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
              mt: "2vw",
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
