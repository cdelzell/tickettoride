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

function Render_Page() {
  return <Sign_In className="Login" />;
}

function Sign_In() {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const isMediumScreen = useMediaQuery(theme.breakpoints.down("md"));

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("/default-profile.png"); // Default image

  // const handleImageChange = (event) => {
  //   const file = event.target.files[0];
  //   if (file) {
  //     setImage(file);
  //     setPreview(URL.createObjectURL(file)); // Show preview before upload
  //   }
  // };

  const handleImageChange = (imageUrl) => {
    setPreview(imageUrl); // Set the image URL directly to preview
  };

  const handleUpload = async () => {
    if (!image) return alert("Please select an image!");

    const formData = new FormData();
    formData.append("profilePic", image);

    try {
      // Simulate an upload or send to a backend
      // await fetch("/upload", { method: "POST", body: formData });
      alert("Profile picture uploaded successfully!");
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  const predefinedImagesProfile = [
    "choochoo/src/assets/trains/thomas_train.jpg",
    "choochoo/src/assets/trains/gordon_train.webp",
    "choochoo/src/assets/trains/james_train.webp",
    "choochoo/src/assets/trains/percy_train.webp",
    "choochoo/src/assets/trains/arthur.jpg",
    "choochoo/src/assets/trains/buddy.webp",
    "choochoo/src/assets/trains/dw.webp",
    "choochoo/src/assets/trains/clifford.jpg",
    "choochoo/src/assets/trains/emily_train.webp",
    "/images/choochoo/src/trains/henry_train.webp",
    "choochoo/src/assets/trains/shiny.webp",
    "choochoo/src/assets/trains/george.jpg",
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
            src={preview}
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
                  border: preview === imageUrl ? "2px solid blue" : "none",
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
