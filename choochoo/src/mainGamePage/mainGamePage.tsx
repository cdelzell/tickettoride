import React, { useState, useEffect } from "react";
import monoMap from "../assets/mono_map.jpg";
import "./mainGamePage.css";
import GameRunner from "../backend/gameRunner";
import User from "../backend/user";
import PlayerCard from "./components/Profile/ProfileCard";
import FaceUpCards from "./components/FaceUpCards/FaceUpCards";
import DestinationCardsCarousel from "./components/DestinationCard/DestinationCard";
import DrawDestinationCard from "./components/DestinationCard/DrawDestinationCard";
import ActionBox from "./components/PlayerActions/ActionBox";
import TrainCard from "./components/TrainCard/TrainCard";
import Map from "./components/Map";
import { useLocation, useNavigate } from "react-router-dom";
import DestinationCard from "../backend/destinationCard";
import constTrainCards from "./constants/trainCards";
import constDestinationCards from "./constants/destinationCards";
import cities from "./constants/cities";
// import routes from "./constants/routes";
import { Routes as routes } from "../backend/hardcodedMap";
import { findGameByGameID } from "../Firebase/FirebaseReadGameData";
import { findUserByUsername } from "../Firebase/FirebaseReadUser";
import { set } from "firebase/database";
import Player from "@/backend/player";
import TrainRoute from "@/backend/trainRoute";

export interface City {
  name: string;
  x: number;
  y: number;
  color?: string;
}

export interface Route {
  destination1: string;
  destination2: string;
  dashed: boolean;
  length: number;
  gameColor: string;
  hexColor: string;
  claimer: string | null;
  claimerProfilePic: string | null;
}

export interface DestinationCardInfo {
  destination1: string;
  destination2: string;
  points: number;
  imagePath: string;
}

export const background = "#d3d3d3";

const MainGamePage = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { players, lobbyCode, userProfile } = state || {};
  const { username, wins, totalScore, profilePicture } = userProfile || {};
  const profilePicFormatted =
    profilePicture?.split("/").pop() || "Default_pfp.jpg";
  const [allPlayers, setAllPlayers] = useState<Player[]>([]);
  const [playerIndex, setPlayerIndex] = useState(0);
  const [displayPlayers, setDisplayPlayers] = useState<Player[]>([]);

  const width = window.innerWidth;
  const height = window.innerHeight;
  const [gameRunner, setGameRunner] = useState<GameRunner>();
  const [destinationCardPoss, setDestinationCardPoss] = useState<
    DestinationCard[]
  >([]);
  const [playerDestinationCards, setPlayerDestinationCards] = useState<
    DestinationCardInfo[]
  >([]);
  const [actionBoxStatus, setActionBoxStatus] = useState(0);
  const [drawDestActive, setDrawDestActive] = useState(false);
  const [gameRoutes, setGameRoutes] = useState<TrainRoute[]>(routes);
  const [trains, setTrains] = useState(45);
  const [hoveredRoute, setHoveredRoute] = useState<TrainRoute | null>(null);
  const [activeTrains, setActiveTrains] = useState(false);
  const [drawnDestCards, setDrawDestCard] = useState<DestinationCard[]>([]);
  const [drawClickCount, setDrawClickCount] = useState(0);
  const [playClickCount, setPlayClickCount] = useState(0);
  const [destClickCount, setDestClickCount] = useState(0);
  const [turnComplete, setTurnComplete] = useState(false);
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [drawnCard, setDrawnCard] = useState<string | null>(null);
  const [showCardNotification, setShowCardNotification] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [gameOverStats, setGameOverStats] = useState("");
  const [winner, setWinner] = useState("");

  const [trainCards, setTrainCards] = useState(() =>
    constTrainCards.map((card) => ({
      ...card,
      count: 0,
    }))
  );

  /*
    Get the group of players for the game when the new gamerunner is passed in.
  */
  useEffect(() => {
    if (gameRunner) {
      const gamePlayers = gameRunner.getPlayers();
      setAllPlayers(gamePlayers);
    }
  }, [gameRunner]);

  /*
    Create a temporary gamerunner to listen to firebase so that a new gamerunner is uploaded everytime changes are pushed to firebase.
    Set this new gamerunner to the UI whenever it is found.
  */
  useEffect(() => {
    if (!lobbyCode) {
      console.warn("No lobby code yet. Waiting...");
      return;
    }

    const tempRunner = new GameRunner([], lobbyCode);
    tempRunner.startListeningForUpdates((newRunner) => {
      setGameRunner(newRunner);
    });

    return () => {};
  }, [lobbyCode]);

  /*
    Get the current player from the gamerunner every time a new current player is seen.
  */
  useEffect(() => {
    if (gameRunner) {
      setCurrentPlayer(gameRunner.getCurrentPlayer());
    }
  }, [gameRunner]);

  /*
    Monitor the clicks of the player.
    If the player has played a route, drawn enough cards, or drawn and submitted destination cards, set the turn as complete.
  */
  useEffect(() => {
    if (playClickCount > 0 || drawClickCount >= 2 || destClickCount > 0) {
      setTurnComplete(true);
    } else {
      setTurnComplete(false);
    }
  }, [playClickCount, drawClickCount, destClickCount]);

  /*
    Every time a new gamerunner is found, get the new set of destination card possibilities.
  */
  useEffect(() => {
    if (gameRunner) {
      setDestinationCardPoss(gameRunner.getDestinationCardPossibilities());
      const cards = gameRunner.getPlayerDestinationCards();
      setPlayerDestinationCards(
        getDestinationCardPossibilitiesFormatted(cards)
      );
    }
  }, [gameRunner]);

  /*
    Set the screen train hand as the hand of the correct player (ie the player whose screen it is)
  */
  useEffect(() => {
    if (allPlayers && gameRunner) {
      if (!allPlayers.length || !username) return;

      // find your own player object
      const self = allPlayers.find((p) => p.username === username);

      if (self) {
        setPlayerIndex(parseInt(self.id));
        setTrains(self.trainAmount);
        setTrainCards(
          formatTrainHand(gameRunner?.getOtherPlayerTrainCards(self.username))
        );
      }
    }
  }, [allPlayers, username]);

  /*
    If the game is over, shift the game to the popup stage and show end game results and information.
  */
  useEffect(() => {
    if (gameRunner && gameOver === true) {
      const { playerPoints, winner } = gameRunner.getEndGameInfo();
      setTurnComplete(true);
      setWinner(winner);
      const sorted = Object.entries(playerPoints);
      let infoString = "";

      for (const i in sorted) {
        infoString += `Player ${sorted[i][0]}: ${sorted[i][1]} trains\n`;
      }

      setGameOverStats(infoString);
    }
  }, [gameOver]);

  /*
    Load all game routes for the given gamerunner. Populates the map.
  */
  useEffect(() => {
    if (gameRunner) {
      setGameRoutes(gameRunner.gameBoard.boardGraph.routes);
    }
  }, [gameRunner]);

  /*
    Get the list of players to display on the top left of the screen (ie all non-main players).
  */
  useEffect(() => {
    if (allPlayers) {
      if (!allPlayers.length || !username) return;

      // find your own player object
      const withoutSelf = allPlayers.filter((p) => p.username !== username);
      setDisplayPlayers(withoutSelf);
    }
  }, [allPlayers]);

  // /*

  // */
  // useEffect(() => {
  //   if (gameRunner) {
  //     const trainCounts = gameRunner.getMainPlayerTrainCards();
  //     const updatedTrainCards = constTrainCards.map((card, i) => ({
  //       ...card,
  //       count: trainCounts[i],
  //     }));
  //     setTrainCards(updatedTrainCards);
  //   }
  // }, [gameRunner]);

  /*
    Monitor the player drawing a card. Allows for popups to occur when a random card is clicked.
  */
  useEffect(() => {
    const handleDrawCardEvent = () => {
      handleDrawPileClick();
    };

    window.addEventListener("drawCard", handleDrawCardEvent);
    return () => {
      window.removeEventListener("drawCard", handleDrawCardEvent);
    };
  }, [drawClickCount]);

  /*
    If there is no gamerunner present, set a loading screen.
  */
  if (!gameRunner) {
    return <div>Loading game...</div>;
  }

  /*
    Format the trainhand to include both colors and counts.
  */
  const formatTrainHand = (hand: number[]) => {
    const formattedHand = constTrainCards.map((card, i) => ({
      ...card,
      count: hand[i],
    }));

    return formattedHand;
  };

  /*
    Get the destination card possibilities correctly formatted with image tags.
  */
  const getDestinationCardPossibilitiesFormatted = (
    cards: DestinationCard[]
  ) => {
    const correctlyFormattedCards = [];

    for (const destinationCard of cards) {
      if (!destinationCard) continue;
      const moreInfo = constDestinationCards.find(
        (card) =>
          card.destination1 === destinationCard.destination1 &&
          card.destination2 === destinationCard.destination2
      );

      if (moreInfo) {
        correctlyFormattedCards.push(moreInfo);
      }
    }

    return correctlyFormattedCards;
  };

  /*
    Update the train card count by the number given for the color given.
  */
  const updateTrainCardCount = (color: string, amount: number) => {
    setTrainCards((prevCards) =>
      prevCards.map((card) =>
        card.gameColor === color
          ? { ...card, count: Math.max(0, card.count + amount) }
          : card
      )
    );
  };

  /*
    Update the player hand with a new set of train cards.
  */
  const updatePlayerHand = (cards: number[]) => {
    const updatedTrains = constTrainCards.map((card, i) => ({
      ...card,
      count: cards[i],
    }));

    setTrainCards(updatedTrains);
  };

  /*
    Set a new action box status.
  */
  const updateStatus = (newStatus: number) => {
    setActionBoxStatus(newStatus);
    if (newStatus === 1) {
      setDrawnCard(null);
      setShowCardNotification(false);
      setDrawClickCount(0);
    }
  };

  // const drawRandomTrainCard = () => {
  //   const random = Math.random();
  //   let drawnColor;

  //   if (random < 0.1) {
  //     drawnColor = "wild";
  //   } else {
  //     const regularColors = constTrainCards
  //       .map((card) => card.gameColor)
  //       .filter((color) => color !== "wild");

  //     const randomIndex = Math.floor(Math.random() * regularColors.length);
  //     drawnColor = regularColors[randomIndex];
  //   }

  //   updateTrainCardCount(drawnColor, 1);
  //   setDrawnCard(drawnColor);
  //   setShowCardNotification(true);

  //   setTimeout(() => {
  //     setShowCardNotification(false);
  //   }, 3000);

  //   return drawnColor;
  // };

  // const updateActionCardStatus = (action: boolean) => {
  //   setActiveTrains(action);
  // };

  /*
    Send the user back to the profile page after a game ends.
  */
  const handleEndGame = () => {
    navigate("/profile", { state: { userProfile } });
  };

  /*
    Provides all logic for handling a route claim.
    Also checks if the game is over after a route is claimed.
  */
  const handleRouteClaim = (route: TrainRoute) => {
    // find the route in game board graph using index instead of color
    const routeIndex = gameRunner.gameBoard.boardGraph.routes.findIndex(
      (r) =>
        (r.destination1 === route.destination1 &&
          r.destination2 === route.destination2) ||
        (r.destination1 === route.destination2 &&
          r.destination2 === route.destination1)
    );
    if (routeIndex === -1) {
      console.error("Route not found in board graph:", route);
      return false;
    }
    if (
      actionBoxStatus === 2 &&
      drawClickCount === 0 &&
      destClickCount === 0 &&
      playClickCount === 0
    ) {
      // ugame runner function to claim route
      const claimed = gameRunner.claimRoute(routeIndex, profilePicFormatted);

      if (claimed) {
        setPlayClickCount(playClickCount + 1);
        setTrains(gameRunner.getMainPlayerTrainCount());
        setGameOver(gameRunner.checkGameOverAfterRouteClaim());

        const updatedTrainCounts = gameRunner.getMainPlayerTrainCards();
        const updatedTrainCards = constTrainCards.map((card, i) => ({
          ...card,
          count: updatedTrainCounts[i],
        }));
        setTrainCards(updatedTrainCards);

        // UI
        setGameRoutes((prevRoutes) => {
          const updatedRoutes = [...prevRoutes];
          const r = updatedRoutes[routeIndex];

          r.claimer = username;
          r.claimerProfilePic = profilePicFormatted;

          return updatedRoutes;
        });

        return true;
      }
    }

    return false;
  };

  /*
    Gets a random train card from the backend and adds it to a player's hand.
    Also shows popup with information about the card.
  */
  const handleDrawPileClick = () => {
    if (
      actionBoxStatus === 1 &&
      drawClickCount < 2 &&
      playClickCount === 0 &&
      destClickCount === 0
    ) {
      gameRunner.drawTrainCardsFromDeck();
      const updatedTrainCounts = gameRunner.getMainPlayerTrainCards();

      // find which card was drawn by comparing previous counts to new counts
      let drawnCardColor = null;
      for (let i = 0; i < trainCards.length; i++) {
        if (updatedTrainCounts[i] > trainCards[i].count) {
          drawnCardColor = constTrainCards[i].gameColor;
          break;
        }
      }

      // new train cards udpated
      const updatedTrainCards = constTrainCards.map((card, i) => ({
        ...card,
        count: updatedTrainCounts[i],
      }));
      setTrainCards(updatedTrainCards);

      if (drawnCardColor) {
        setDrawnCard(drawnCardColor);
        setShowCardNotification(true);

        setTimeout(() => {
          setShowCardNotification(false);
        }, 3000);
      }

      setDrawClickCount((prevCount) => prevCount + 1);
    }
  };

  /*
    Updates all fields for when a turn ends to prepare the gamerunner for the next player.
    Writes the new gamerunner to firebase.
  */
  const handleEndTurn = () => {
    setDrawClickCount(0);
    setPlayClickCount(0);
    setDestClickCount(0);
    setTurnComplete(false);
    setActionBoxStatus(0);
    setActiveTrains(false);
    setShowCardNotification(false);
    setDrawDestActive(false);
    gameRunner.updateCurrentPlayer();
    setCurrentPlayer(gameRunner.getCurrentPlayer());
    gameRunner.sendToDatabase();
  };

  const endTurnButtonStyle: React.CSSProperties = {
    display: turnComplete ? "block" : "none",
  };

  return (
    <main className="main_game_page">
      <div className="player_cards_format">
        {displayPlayers.map((player, index) => (
          <PlayerCard
            key={index}
            username={player.username}
            trainCount={player.trainAmount}
            profilePic={"default"}
            mainPlayer={false}
            active={currentPlayer === parseInt(player.id)}
          />
        ))}
      </div>

      <FaceUpCards
        gamerunner={gameRunner}
        faceUpCards={gameRunner.gameBoard.getFaceupTrainCardsAsList()}
        updateTrains={updatePlayerHand}
        active={activeTrains}
        drawClickCount={drawClickCount}
        setDrawClickCount={setDrawClickCount}
        playClickCount={playClickCount}
        destClickCount={destClickCount}
      />

      {gameOver && (
        <div className="game_over_popup">
          <div className="final_score">Final Scores</div>
          <div className="scores" style={{ whiteSpace: "pre-line" }}>
            {gameOverStats}
          </div>
          <div className="winner">WINNER: {winner}</div>
          <button className="return_home" onClick={handleEndGame}>
            Return to profile page
          </button>
        </div>
      )}

      {turnComplete && (
        <button className="end_turn_button" onClick={handleEndTurn}>
          End Turn
        </button>
      )}

      {showCardNotification && drawnCard && (
        <div className="drawn_card_notification">
          You drew a {drawnCard} train card!
        </div>
      )}

      <div className="player_actions">
        <ActionBox
          active={currentPlayer === playerIndex}
          action={actionBoxStatus}
          gamerunner={gameRunner}
          drawnDestCards={drawnDestCards}
          updateStatus={updateStatus}
          drawDestActive={drawDestActive}
          updateDrawDest={setDrawDestActive}
          updateTrains={updateTrainCardCount}
          updateFaceUp={setActiveTrains}
          drawClickCount={drawClickCount}
          setDrawClickCount={setDrawClickCount}
          playClickCount={playClickCount}
          setPlayClickCount={setPlayClickCount}
          destClickCount={destClickCount}
          setDestClickCount={setDestClickCount}
          handleDrawPileClick={handleDrawPileClick}
          setPlayerDestCards={setPlayerDestinationCards}
          formatDestCards={getDestinationCardPossibilitiesFormatted}
        />

        <DestinationCardsCarousel destinations={playerDestinationCards} />

        {drawDestActive && (
          <DrawDestinationCard
            destinations={getDestinationCardPossibilitiesFormatted(
              destinationCardPoss
            )}
            drawnDestCards={drawnDestCards}
            setDrawDestCard={setDrawDestCard}
          />
        )}

        <div className="train_cards">
          {trainCards.map((train, index) => (
            <TrainCard
              key={index}
              color={train.color}
              gameColor={train.gameColor}
              count={train.count}
              hover={hoveredRoute}
            />
          ))}
        </div>

        <div>
          <PlayerCard
            username={username}
            trainCount={trains}
            profilePic={profilePicFormatted}
            mainPlayer={true}
            active={currentPlayer === playerIndex}
          />
        </div>
      </div>

      <Map
        width={width}
        height={height}
        routes={gameRoutes}
        cities={cities}
        mainPlayer={{
          username: username,
          profilePic: profilePicFormatted,
        }}
        hoveredRoute={hoveredRoute}
        setHoveredRoute={setHoveredRoute}
        onRouteClaim={handleRouteClaim}
      />
    </main>
  );
};

export default MainGamePage;
