import { useState } from "react";
import Sheet from "@mui/joy/Sheet";
import CssBaseline from "@mui/joy/CssBaseline";
import Typography from "@mui/joy/Typography";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";
import Button from "@mui/joy/Button";
import Avatar from "@mui/material/Avatar";
import { useNavigate, Link } from "react-router-dom";

import { useTheme, useMediaQuery } from "@mui/material";
import "./edit_profile.css";

// import thomasImg from "/assets/thomasthetrain.jpg"; 
// import gordonImg from "/assets/trains/gordon_train.webp";
// import jamesImg from "/assets/trains/james_train.webp";
// import percyImg from "/assets/trains/percy_train.webp";
// import arthurImg from "/assets/trains/arthur.jpg";
// import buddyImg from "/assets/trains/buddy.webp";
// import dwImg from "/assets/trains/dw.webp";
// import cliffordImg from "/assets/trains/clifford.jpg";
// import emilyImg from "/assets/trains/emily_train.webp";
// import henryImg from "/assets/trains/henry_train.webp";
// import shinyImg from "/assets/trains/shiny.webp";
// import georgeImg from "/assets/trains/george.jpg";
// import defaultImg from "/assets/default-profile.png";

function Render_Page() {
  return <Sign_In className="Login" />;
}

function Sign_In() {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const isMediumScreen = useMediaQuery(theme.breakpoints.down("md"));

  const [image, setImage] = useState(null);
  const [selectedImageUrl, setSelectedImageUrl] = useState(defaultImg); // Default image

  const handleImageChange = (imageUrl) => {
    setSelectedImageUrl(imageUrl);
    setImage(imageUrl); 
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


  const predefinedImagesProfile = [
    thomasImg,
    gordonImg,
    jamesImg,
    percyImg,
    arthurImg,
    buddyImg,
    dwImg,
    cliffordImg,
    emilyImg,
    henryImg,
    shinyImg,
    georgeImg
  ];

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
        <div style={{ textAlign: "center" }}>
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
              gap: "8px",
              marginBottom: "16px",
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
                  border: selectedImageUrl === imageUrl ? "2px solid blue" : "none",
                }}
                onClick={() => handleImageChange(imageUrl)}
              />
            ))}
          </div>
          <Button
            onClick={handleUpload}
            variant="contained"
            sx={{ mt: 1, backgroundColor: "ButtonFace", fontWeight: "normal" }}
          >
            Save Profile Picture
          </Button>
        </div>

        {/* Username & Password Fields */}
        <FormControl>
          <FormLabel>New Username</FormLabel>
          <Input name="username" type="text" placeholder="Thomas-the-train" />
        </FormControl>
        <FormControl>
          <FormLabel>Confirm Username</FormLabel>
          <Input
            name="email"
            type="email"
            placeholder="thomasthetrain@email.com"
          />
        </FormControl>
        <FormControl>
          <FormLabel>New Password</FormLabel>
          <Input name="password" type="password" placeholder="password" />
        </FormControl>
        <FormControl>
          <FormLabel>Confirm Password</FormLabel>
          <Input
            name="confirmed password"
            type="password"
            placeholder="confirm password"
          />
        </FormControl>
        <Button
          type="submit"
          component={Link}
          to="/profile"
          sx={{
            mt: 1,
            "&:hover": {
              color: "white",
            },
          }}
        >
          Save Changes
        </Button>
      </Sheet>
    </main>
  );
}

export default Render_Page;