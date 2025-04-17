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
import "./edit_profile.css";

// Static image imports from Profile_Images
import arthur from "@/assets/Profile_Images/arthur.jpg";
import buddy from "@/assets/Profile_Images/buddy.webp";
import clifford from "@/assets/Profile_Images/clifford.jpg";
import defaultImg from "@/assets/Profile_Images/Default_pfp.jpg";
import dw from "@/assets/Profile_Images/dw.webp";
import emily from "@/assets/Profile_Images/emily_train.webp";
import george from "@/assets/Profile_Images/george.jpg";
import gordon from "@/assets/Profile_Images/gordon_train.webp";
import henry from "@/assets/Profile_Images/henry_train.webp";
import james from "@/assets/Profile_Images/james_train.webp";
import shiny from "@/assets/Profile_Images/shiny.webp";
import thomas from "@/assets/Profile_Images/thomas_train.jpg";

// Build the PROFILE_IMAGES object using imported images
export const PROFILE_IMAGES = {
  arthur,
  buddy,
  clifford,
  default: defaultImg,
  dw,
  emily,
  george,
  gordon,
  henry,
  james,
  shiny,
  thomas,
};

function Render_Page() {
  return <Sign_In />;
}

function Sign_In() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const isMediumScreen = useMediaQuery(theme.breakpoints.down("md"));

  const [error, setError] = useState("");
  const { state } = useLocation();
  const { userKey, userProfile } = state || {};
  const { player_username, wins, total_score, profile_picture } = userProfile || {};

  const [username, setUsernameState] = useState("");
  const [password, setPasswordState] = useState("");
  const [image, setImage] = useState<string | null>(null);
  // Initialize with the default image from PROFILE_IMAGES object.
  const [selectedImageUrl, setSelectedImageUrl] = useState(PROFILE_IMAGES.default);

  // Debug log for monitoring the selected image URL
  console.log("Selected Image URL:", selectedImageUrl);

  const handleImageChange = (imageUrl: string) => {
    setSelectedImageUrl(imageUrl);
    setImage(imageUrl);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (username !== "" && await doesUserExist(username, "")) {
        await setUsername(userKey, username, true);
      }
      if (password !== "") {
        await setPassword(userKey, password, true);
      }
      if (selectedImageUrl !== PROFILE_IMAGES.default) {
        await setProfilePicture(userKey, selectedImageUrl, true);
      }

      const updatedUserProfile = {
        ...userProfile,
        username: username.trim() !== "" ? username : userProfile.username,
        wins,
        total_score,
        profile_picture:
          selectedImageUrl !== PROFILE_IMAGES.default ? selectedImageUrl : profile_picture,
      };

      navigate("/profile", {
        state: { userKey, userProfile: updatedUserProfile },
      });
    } catch (err) {
      setError("Error: Issues changing profile data at this time. Please try again later!");
    }
  };

  const handleUpload = async () => {
    if (!selectedImageUrl) return alert("Please select an image!");

    try {
      await setProfilePicture(userKey, selectedImageUrl, true);
      alert("Profile picture updated successfully!");
    } catch (error) {
      console.error("Update failed:", error);
      alert("Failed to update profile picture.");
    }
  };

  // Filter out the default image from the list of profile images
  const predefinedImagesProfile = Object.values(PROFILE_IMAGES).filter(
    (url) => url !== PROFILE_IMAGES.default
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
            If you would like to change your username, password, or both, please fill out the
            appropriate fields! If you would not like to change something, please leave the field
            blank.
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
            {/* Avatar uses a fallback: if selectedImageUrl is falsey, it falls back to PROFILE_IMAGES.default */}
            <Avatar
              src={selectedImageUrl || PROFILE_IMAGES.default}
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
              {predefinedImagesProfile.map((imageUrl, index) => (
                <Avatar
                  key={index}
                  src={imageUrl}
                  alt={`PFP ${index + 1}`}
                  sx={{
                    width: 50,
                    height: 50,
                    cursor: "pointer",
                    border:
                      selectedImageUrl === imageUrl ? "2px solid blue" : "none",
                  }}
                  onClick={() => handleImageChange(imageUrl)}
                />
              ))}
            </div>
            <Button
              onClick={handleUpload}
              variant="solid"
              sx={{
                mt: 1,
                backgroundColor: "ButtonFace",
                fontWeight: "normal",
              }}
            >
              Save Profile Picture
            </Button>
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
              placeholder="confirm password"
              value={password}
              onChange={(e) => setPasswordState(e.target.value)}
            />
          </FormControl>

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