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
import { Grid2 } from "@mui/material";
import ButtonGroup from "@mui/material/ButtonGroup";
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
        <Grid2 container spacing={2} rowSpacing={"3vw"}>
          <Grid2 size={5}>
            <Avatar
              alt="thomas"
              src="/Users/claradelzell/Documents/GitHub/tickettoride/choochoo/src/assets/trains/thomas_train.jpg"
              sx={{
                width: isSmallScreen ? "10vw" : isMediumScreen ? "15vw" : 125,
                height: isSmallScreen ? "10vw" : isMediumScreen ? "15vw" : 125,
                ml: "1vw",
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
                    ? "clamp(20px, 5vw, 24px"
                    : "clamp(30px, 1.5vw, 32px",
                }}
              >
                Profile name
              </h3>
              <p
                style={{
                  fontSize: isSmallScreen
                    ? "1.5vw"
                    : isMediumScreen
                    ? "clamp(10px, 3vw, 12px"
                    : "clamp(15px, 1vw, 23px",
                }}
              >
                Total wins:
              </p>
              <p
                style={{
                  fontSize: isSmallScreen
                    ? "1.5vw"
                    : isMediumScreen
                    ? "clamp(10px, 3vw, 12px"
                    : "clamp(15px, 1vw, 23px",
                }}
              >
                Highest score:
              </p>
            </div>
          </Grid2>
          <Grid2 size={12}>
            <span></span>
          </Grid2>
          {/* <Grid2 size={2}>
            <span></span>
          </Grid2>
          <Grid2 size={3} justifyContent={"center"}>
            <Button fullWidth="true">Join Game</Button>
          </Grid2>
          <Grid2 size={2}>
            <span></span>
          </Grid2>
          <Grid2 size={3} justifyContent={"center"}>
            <Button fullWidth="true" disableFocusRipple="true">
              Edit Profile
            </Button>
          </Grid2>
          <Grid2 size={2}>
            <span></span>
          </Grid2>
          <Grid2 size={4.5}>
            <span></span>
          </Grid2>
          <Grid2 size={3} justifyContent={"center"}>
            <Button fullWidth="true">Whatever noah wanted!</Button>
          </Grid2> */}
          <Grid2 size={3}>
            <span></span>
          </Grid2>
          <Grid2 size={6} justifyContent={"center"}>
            <ButtonGroup variant="text" sx={{ gap: "2vw" }}>
              <Button>Join Game</Button>
              <Button>Edit Profile</Button>
              <Button>Noah's button</Button>
            </ButtonGroup>
          </Grid2>
        </Grid2>
        {/* <div className="info">
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
        </div> */}
      </Box>
    </main>
  );
}

export default App;
