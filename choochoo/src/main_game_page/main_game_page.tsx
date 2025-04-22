import React, { useState, useEffect } from "react";
import monoMap from "../assets/mono_map.jpg";
import "./main_game_page.css";
import GameRunner from "../backend/game-runner";
import User from "../backend/user";
import PlayerCard from "./components/Profile/ProfileCard";
import FaceUpCards from "./components/FaceUpCards/FaceUpCards";
import DestinationCardsCarousel from "./components/DestinationCard/DestinationCard";
import DrawDestinationCard from "./components/DestinationCard/DrawDestinationCard";
import ActionBox from "./components/PlayerActions/ActionBox";
import TrainCard from "./components/TrainCard/TrainCard";
import Map from "./components/Map";
import { useLocation, useNavigate } from "react-router-dom";
import DestinationCard from "../backend/destination-card";
import train_cards from "./constants/train_cards";
import destination_cards from "./constants/destination_cards";
import cities from "./constants/cities";
// import routes from "./constants/routes";
import { Routes as routes } from "../backend/hardcoded-map";
import { findGameByGameID } from "../firebase/FirebaseReadGameData";
import { findUserByUsername } from "../firebase/FirebaseReadUser";
import { set } from "firebase/database";
import Player from "@/backend/player";
import TrainRoute from "@/backend/train-route";

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
  image_path: string;
}

export const background = "#d3d3d3";

const MainGamePage = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { players, lobbyCode, userProfile } = state || {};
  const { username, wins, total_score, profile_picture } = userProfile || {};
  const profile_pic_formatted =
    profile_picture?.split("/").pop() || "Default_pfp.jpg";
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
  const [action_box_status, setActionBoxStatus] = useState(0);
  const [draw_dest_active, setDrawDestActive] = useState(false);
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
  const [gameOver, setGameOver] = useState(true);
  const [gameOverStats, setGameOverStats] = useState(
    "Player 1: 5 points\nPlayer 2: 4 points"
  );

  const [trainCards, setTrainCards] = useState(() =>
    train_cards.map((card) => ({
      ...card,
      count: 0,
    }))
  );

  useEffect(() => {
    if (gameRunner) {
      const gamePlayers = gameRunner.getPlayers();
      setAllPlayers(gamePlayers);
    }
  }, [gameRunner]);

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

  useEffect(() => {
    if (gameRunner) {
      setCurrentPlayer(gameRunner.getCurrentPlayer());
    }
  }, [gameRunner]);

  useEffect(() => {
    if (playClickCount > 0 || drawClickCount >= 2 || destClickCount > 0) {
      setTurnComplete(true);
    } else {
      setTurnComplete(false);
    }
  }, [playClickCount, drawClickCount, destClickCount]);

  useEffect(() => {
    if (gameRunner) {
      setDestinationCardPoss(gameRunner.getDestinationCardPossibilities());
      const cards = gameRunner.getPlayerDestinationCards();
      setPlayerDestinationCards(
        getDestinationCardPossibilitiesFormatted(cards)
      );
    }
  }, [gameRunner]);

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

  useEffect(() => {
    if (gameRunner && gameOver === true) {
      const sorted = Object.entries(gameRunner.getEndGameInfo);
      let infoString = "";

      for (const i in sorted) {
        infoString += `Player ${sorted[i][0]}: ${sorted[i][1]} trains\n`;
      }

      setGameOverStats(infoString);
    }
  }, [gameOver]);

  useEffect(() => {
    if (gameRunner) {
      setGameRoutes(gameRunner.gameBoard.boardGraph.routes);
    }
  }, [gameRunner]);

  useEffect(() => {
    if (allPlayers) {
      if (!allPlayers.length || !username) return;

      // find your own player object
      const withoutSelf = allPlayers.filter((p) => p.username !== username);
      setDisplayPlayers(withoutSelf);
    }
  }, [allPlayers]);

  const formatTrainHand = (hand: number[]) => {
    const formattedHand = train_cards.map((card, i) => ({
      ...card,
      count: hand[i],
    }));

    return formattedHand;
  };

  useEffect(() => {
    if (gameRunner) {
      const train_counts = gameRunner.getMainPlayerTrainCards();
      const updatedTrainCards = train_cards.map((card, i) => ({
        ...card,
        count: train_counts[i],
      }));
      setTrainCards(updatedTrainCards);
    }
  }, [gameRunner]);

  useEffect(() => {
    const handleDrawCardEvent = () => {
      handleDrawPileClick();
    };

    window.addEventListener("drawCard", handleDrawCardEvent);
    return () => {
      window.removeEventListener("drawCard", handleDrawCardEvent);
    };
  }, [drawClickCount]);

  if (!gameRunner) {
    return <div>Loading game...</div>;
  }

  const updateTrainCardCount = (color: string, amount: number) => {
    setTrainCards((prevCards) =>
      prevCards.map((card) =>
        card.game_color === color
          ? { ...card, count: Math.max(0, card.count + amount) }
          : card
      )
    );
  };
  // use this to get cards from pile
  const getDestinationCardPossibilitiesFormatted = (
    cards: DestinationCard[]
  ) => {
    const correctly_formatted_cards = [];

    for (const destination_card of cards) {
      if (!destination_card) continue;
      const moreInfo = destination_cards.find(
        (card) =>
          card.destination1 === destination_card.destination1 &&
          card.destination2 === destination_card.destination2
      );

      if (moreInfo) {
        correctly_formatted_cards.push(moreInfo);
      }
    }

    return correctly_formatted_cards;
  };

  const updatePlayerHand = (cards: number[]) => {
    const updatedTrains = train_cards.map((card, i) => ({
      ...card,
      count: cards[i],
    }));

    setTrainCards(updatedTrains);
  };

  const drawRandomTrainCard = () => {
    const random = Math.random();
    let drawnColor;

    if (random < 0.1) {
      drawnColor = "wild";
    } else {
      const regularColors = train_cards
        .map((card) => card.game_color)
        .filter((color) => color !== "wild");

      const randomIndex = Math.floor(Math.random() * regularColors.length);
      drawnColor = regularColors[randomIndex];
    }

    updateTrainCardCount(drawnColor, 1);
    setDrawnCard(drawnColor);
    setShowCardNotification(true);

    setTimeout(() => {
      setShowCardNotification(false);
    }, 3000);

    return drawnColor;
  };

  const updateActionCardStatus = (action: boolean) => {
    setActiveTrains(action);
  };

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
      action_box_status === 2 &&
      drawClickCount === 0 &&
      destClickCount === 0 &&
      playClickCount === 0
    ) {
      // ugame runner function to claim route
      const claimed = gameRunner.claimRoute(routeIndex, profile_pic_formatted);

      if (claimed) {
        setPlayClickCount(playClickCount + 1);
        setTrains(gameRunner.getMainPlayerTrainCount());
        setGameOver(gameRunner.checkGameOverAfterRouteClaim());

        const updatedTrainCounts = gameRunner.getMainPlayerTrainCards();
        const updatedTrainCards = train_cards.map((card, i) => ({
          ...card,
          count: updatedTrainCounts[i],
        }));
        setTrainCards(updatedTrainCards);

        // UI
        setGameRoutes((prevRoutes) => {
          const updatedRoutes = [...prevRoutes];
          const r = updatedRoutes[routeIndex];

          r.claimer = username;
          r.claimerProfilePic = profile_pic_formatted;

          return updatedRoutes;
        });

        return true;
      }
    }

    return false;
  };

  const updateStatus = (newStatus: number) => {
    setActionBoxStatus(newStatus);
    if (newStatus === 1) {
      setDrawnCard(null);
      setShowCardNotification(false);
      setDrawClickCount(0);
    }
  };

  const handleDrawPileClick = () => {
    if (
      action_box_status === 1 &&
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
          drawnCardColor = train_cards[i].game_color;
          break;
        }
      }

      // new train cards udpated
      const updatedTrainCards = train_cards.map((card, i) => ({
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
    width: "12vw",
    height: "3vw",
    fontSize: "1vw",
    fontWeight: "bold",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "1vw",
    cursor: "pointer",
    boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
    position: "absolute",
    right: "1.5vw",
    bottom: "13.9vw",
    zIndex: 1000,
    display: turnComplete ? "block" : "none",
    transition: "all 0s ease-in-out",
  };

  const drawnCardNotificationStyle: React.CSSProperties = {
    padding: "0.1vw 1vw",
    position: "absolute",
    bottom: "12.56vw",
    left: "50%",
    transform: "translateX(-50%)",
    backgroundColor: "rgba(255, 54, 148, 0.7)",
    color: "white",
    borderRadius: "0.5vw",
    fontSize: "1.1vw",
    zIndex: 1000,
    transition: "all 0s ease-in-out",
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
            main_player={false}
            active={currentPlayer === parseInt(player.id)}
          />
        ))}
      </div>

      <FaceUpCards
        gamerunner={gameRunner}
        face_up_cards={gameRunner.gameBoard.getFaceupTrainCardsAsList()}
        updateTrains={updatePlayerHand}
        active={activeTrains}
        drawClickCount={drawClickCount}
        setDrawClickCount={setDrawClickCount}
        playClickCount={playClickCount}
        destClickCount={destClickCount}
      />

      {gameOver && <div className="game_over_popup">{gameOverStats}</div>}

      {turnComplete && (
        <button onClick={handleEndTurn} style={endTurnButtonStyle}>
          End Turn
        </button>
      )}

      {showCardNotification && drawnCard && (
        <div style={drawnCardNotificationStyle}>
          You drew a {drawnCard} train card!
        </div>
      )}

      <div className="player_actions">
        <ActionBox
          active={currentPlayer === playerIndex}
          action={action_box_status}
          gamerunner={gameRunner}
          drawnDestCards={drawnDestCards}
          updateStatus={updateStatus}
          drawDestActive={draw_dest_active}
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

        {draw_dest_active && (
          <DrawDestinationCard
            destinations={getDestinationCardPossibilitiesFormatted(
              destinationCardPoss
            )}
            drawnDestCards={drawnDestCards}
            setDrawDestCard={setDrawDestCard}
          />
        )}

        <div className="train_cards">
          {trainCards.map((train_card, index) => (
            <TrainCard
              key={index}
              color={train_card.color}
              game_color={train_card.game_color}
              count={train_card.count}
              hover={hoveredRoute}
            />
          ))}
        </div>

        <div>
          <PlayerCard
            username={username}
            trainCount={trains}
            profilePic={profile_pic_formatted}
            main_player={true}
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
          profilePic: profile_pic_formatted,
        }}
        hoveredRoute={hoveredRoute}
        setHoveredRoute={setHoveredRoute}
        onRouteClaim={handleRouteClaim}
      />
    </main>
  );
};

export default MainGamePage;
