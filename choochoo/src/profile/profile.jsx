import { Avatar } from "@mui/material";
import { useState } from "react";
import Sheet from "@mui/joy/Sheet";
import Box from "@mui/joy/Box";
import CssBaseline from "@mui/joy/CssBaseline";
import { useTheme, useMediaQuery } from "@mui/material";
import Typography from "@mui/joy/Typography";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";
import Button from "@mui/joy/Button";
import "./profile.css";

function App() {
  return <Profile />;
}

function Profile() {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const isMediumScreen = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <main className="background_set_up">
      <CssBaseline />
      <Box
        sx={{
          width: isSmallScreen ? "40vw" : isMediumScreen ? "60vw" : 500,
          height: isSmallScreen ? "40vw" : isMediumScreen ? "60vw" : 500,
          backgroundColor: "white",
          maxHeight: 500,
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
          minHeight: 50,
        }}
      >
        <div className="info">
          <Avatar
            alt="thomas"
            src="/Users/claradelzell/Documents/GitHub/tickettoride/choochoo/src/assets/trains/thomas_train.jpg"
            sx={{
              width: isSmallScreen ? "10vw" : isMediumScreen ? "15vw" : 125,
              height: isSmallScreen ? "10vw" : isMediumScreen ? "15vw" : 125,
            }}
          />
          <div className="profile_name">
            <h3
              style={{
                fontSize: isSmallScreen
                  ? "3vw"
                  : isMediumScreen
                  ? "clamp(20px, 5vw, 24px"
                  : "clamp(30px, 1.5vw, 32px",
              }}
            >
              Profile name
            </h3>
            <p>Total wins:</p>
            <p>Highest score:</p>
          </div>
        </div>
      </Box>
    </main>
  );
}

export default App;
