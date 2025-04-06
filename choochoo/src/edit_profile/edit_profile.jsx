import { useState } from "react";
import Sheet from "@mui/joy/Sheet";
import CssBaseline from "@mui/joy/CssBaseline";
import Typography from "@mui/joy/Typography";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";
import Button from "@mui/joy/Button";
import Avatar from "@mui/material/Avatar";
import { useLocation, useNavigate, Link } from "react-router-dom";
import {
  setUsername,
  setPassword,
  setProfilePicture,
} from "../Firebase/FirebaseWriteUserData";

import { useTheme, useMediaQuery } from "@mui/material";
import "./edit_profile.css";

// import thomasImg from "../assets/trains/thomas_train.jpg";
// import gordonImg from "../assets/trains/gordon_train.webp";
// import jamesImg from "../assets/trains/james_train.webp";
// import percyImg from "../assets/trains/percy_train.webp";
// import arthurImg from "../assets/trains/arthur.jpg";
// import buddyImg from "../assets/trains/buddy.webp";
// import dwImg from "../assets/trains/dw.webp";
// import cliffordImg from "../assets/trains/clifford.jpg";
// import emilyImg from "../assets/trains/emily_train.webp";
// import henryImg from "../assets/trains/henry_train.webp";
// import shinyImg from "../assets/trains/shiny.webp";
// import georgeImg from "../assets/trains/george.jpg";
// import defaultImg from "../assets/trains/Default_pfp.jpg";

export const PROFILE_IMAGES = {
  thomas: "/assets/thomasthetrain.jpg",
  gordon: "/assets/trains/gordon_train.webp",
  james: "/assets/trains/james_train.webp",
  percy: "/assets/trains/percy_train.webp",
  arthur: "/assets/trains/arthur.jpg",
  buddy: "/assets/trains/buddy.webp",
  dw: "/assets/trains/dw.webp",
  clifford: "/assets/trains/clifford.jpg",
  emily: "/assets/trains/emily_train.webp",
  henry: "/assets/trains/henry_train.webp",
  shiny: "/assets/trains/shiny.webp",
  george: "/assets/trains/george.jpg",
  default: "/assets/Default-pfp.png",
};

function Render_Page() {
  return <Sign_In className="Login" />;
}

function Sign_In() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const isMediumScreen = useMediaQuery(theme.breakpoints.down("md"));

  const [error, setError] = useState(""); // To store the error message
  const { state } = useLocation(); // Use location to get the state passed from navigate
  const { userKey, userProfile } = state || {}; // Fallback to empty object if state is undefined
  const { player_username, wins, total_score, profile_picture } =
    userProfile || {};

  const [username, setUsernameState] = useState("");
  const [password, setPasswordState] = useState("");
  let userData1, userData2, userData;

  const [image, setImage] = useState(null);
  const [selectedImageUrl, setSelectedImageUrl] = useState(
    PROFILE_IMAGES.default
  );

  const handleImageChange = (imageUrl) => {
    setSelectedImageUrl(imageUrl);
    setImage(imageUrl);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("here!");
    try {
      if (username != "") {
        userData2 = await setUsername(userKey, username, true);
      }
      if (password != "") {
        userData1 = await setPassword(userKey, password, true);
      }
      if (selectedImageUrl != PROFILE_IMAGES.default) {
        userData = await setProfilePicture(userKey, selectedImageUrl);
      }

      console.log(userData);
      console.log(userData1);
      console.log(userData2);

      console.log("userProfile" + userProfile);

      // Redirect to profile on successful login
      navigate("/profile", { state: { userKey, userProfile } });
    } catch (err) {
      // Catch any unexpected errors (e.g., network issues)
      setError(
        "Error: Issues changing profile data at this time. Please try again later!"
      );
    }
  };

  const handleUpload = async () => {
    if (!selectedImageUrl) return alert("Please select an image!");

    try {
      // TYSON - SEND TO FIREBASE HERE I THINK
      alert("Profile picture updated successfully!");
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  // const predefinedImagesProfile = [
  //   thomasImg,
  //   gordonImg,
  //   jamesImg,
  //   percyImg,
  //   arthurImg,
  //   buddyImg,
  //   dwImg,
  //   cliffordImg,
  //   emilyImg,
  //   henryImg,
  //   shinyImg,
  //   georgeImg,
  // ];

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
          <Typography level="body-med">
            If you would like to change your username, password, or both, please
            fill out the appropriate fields! If you would not like to change
            something, please leave the field blank.
          </Typography>
        </div>

        {/* Profile Picture Selection Section */}
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
              src={selectedImageUrl}
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
              variant="contained"
              sx={{
                mt: 1,
                backgroundColor: "ButtonFace",
                fontWeight: "normal",
              }}
            >
              Save Profile Picture
            </Button>
          </div>

          {/* Username & Password Fields */}

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
