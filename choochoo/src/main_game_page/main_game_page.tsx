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
import routes from "./constants/routes";

export interface City {
  name: string;
  x: number;
  y: number;
  color?: string;
}

export interface Route {
  source: City;
  target: City;
  dashed?: boolean;
  color?: string;
  game_color: string;
  trains: number;
  claimer?: string | null;
}

export interface DestinationCardInfo {
  destination1: string;
  destination2: string;
  points: number;
  image_path: string;
}

export const background = "#d3d3d3";

const players = [
  {
    username: "c-bear",
    trainCount: 1700,
    profilePic: "./src/assets/trains/percy_train.webp",
  },
  {
    username: "t-dawg",
    trainCount: 0,
    profilePic: "./src/assets/trains/gordon_train.webp",
  },
  {
    username: "ridster",
    trainCount: 2,
    profilePic: "./src/assets/trains/james_train.webp",
  },
];

const main_player = {
  username: "noah-rama",
  trainCount: 2,
  profilePic: "./src/assets/trains/thomas_train.jpg",
};

const users: User[] = [new User("Test")];
const gameRunner = new GameRunner(users);
const train_counts = gameRunner.getMainPlayerTrainCards();

const train_cards_and_counts = train_cards.map((card, i) => ({
  ...card,
  count: train_counts[i],
}));

const MainGamePage = () => {
  const width = window.innerWidth;
  const height = window.innerHeight;

  const navigate = useNavigate();
  const { state } = useLocation();
  const { userKey, userProfile } = state || {};
  const { username, wins, total_score, profile_picture } = userProfile || {};

  const [action_box_status, setActionBoxStatus] = useState(0);
  const [draw_dest_active, setDrawDestActive] = useState(false);
  const [gameRoutes, setGameRoutes] = useState<Route[]>(routes);
  const [trainCards, setTrainCards] = useState(train_cards_and_counts);
  const [trains, setTrains] = useState(25);
  const [hoveredRoute, setHoveredRoute] = useState<Route | null>(null);
  const [activeTrains, setActiveTrains] = useState(false);
  const [drawnDestCards, setDrawDestCard] = useState<DestinationCard[]>([]);
  const [drawClickCount, setDrawClickCount] = useState(0);
  const [playClickCount, setPlayClickCount] = useState(0);
  const [destClickCount, setDestClickCount] = useState(0);
  const [turnComplete, setTurnComplete] = useState(false);
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [drawnCard, setDrawnCard] = useState<string | null>(null);
  const [showCardNotification, setShowCardNotification] = useState(false);

  const [destinationCardPoss, setDestinationCardPoss] = useState(
    gameRunner.getDestinationCardPossibilities()
  );

  useEffect(() => {
    if (playClickCount > 0 || drawClickCount >= 2 || destClickCount > 0) {
      setTurnComplete(true);
    } else {
      setTurnComplete(false);
    }
  }, [playClickCount, drawClickCount, destClickCount]);

  const updateTrainCardCount = (color: string, amount: number) => {
    setTrainCards((prevCards) =>
      prevCards.map((card) =>
        card.game_color === color
          ? { ...card, count: Math.max(0, card.count + amount) }
          : card
      )
    );
  };

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

  const [playerDestinationCards, setPlayerDestinationCards] = useState(
    getDestinationCardPossibilitiesFormatted(
      gameRunner.getPlayerDestinationCards()
    )
  );

  const updatePlayerHand = (cards: number[]) => {
    const trains = train_cards.map((card, i) => ({
      ...card,
      count: cards[i],
    }));
    setTrainCards(trains);
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

  useEffect(() => {
    const handleDrawCardEvent = () => {
      handleDrawPileClick();
    };

    window.addEventListener("drawCard", handleDrawCardEvent);
    return () => {
      window.removeEventListener("drawCard", handleDrawCardEvent);
    };
  }, [drawClickCount]);

  const handleRouteClaim = (route: Route) => {
    const trainCard = trainCards.find(
      (card) => card.game_color === route.game_color
    );
    const wildCard = trainCards.find((card) => card.game_color === "wild");

    if (
      action_box_status === 2 &&
      trainCard &&
      wildCard &&
      trainCard.count + wildCard.count >= route.trains &&
      trains >= route.trains &&
      drawClickCount === 0 &&
      destClickCount === 0 &&
      playClickCount === 0
    ) {
      updateTrainCardCount(route.game_color!, -route.trains);
      setTrains(trains - route.trains);
      setPlayClickCount(playClickCount + 1);
      if (
        route.trains > trainCard.count &&
        trainCard.count + wildCard.count >= route.trains
      ) {
        updateTrainCardCount(route.game_color!, -trainCard.count);
        updateTrainCardCount("wild", -(route.trains - trainCard.count));
        setPlayClickCount(playClickCount + 1);
      }

      setGameRoutes((prevRoutes) =>
        prevRoutes.map((r) =>
          r.source.name === route.source.name &&
          r.target.name === route.target.name
            ? { ...r, claimer: main_player.username }
            : r
        )
      );
      return true;
    } else {
      return false;
    }
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
      const newCard = drawRandomTrainCard();
      if (newCard) {
        setDrawnCard(newCard);
        setShowCardNotification(true);

        setTimeout(() => {
          setShowCardNotification(false);
        }, 3000);
      }

      setDrawClickCount((prev) => prev + 1);
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
    setCurrentPlayer((current) => (current + 1) % (players.length + 1));
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
      <div className="player_cards">
        {players.map((player, index) => (
          <PlayerCard
            key={index}
            username={player.username}
            trainCount={player.trainCount}
            profilePic={player.profilePic.split("/").pop() || "Default_pfp.jpg"}
            main_player={false}
            active={currentPlayer === index + 1}
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
            destinations={getDestinationCardPossibilitiesFormatted(destinationCardPoss)}
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

        <div className="main_player_card">
          <PlayerCard
            username={username}
            trainCount={trains}
            profilePic={profile_picture?.split("/").pop() || "Default_pfp.jpg"}
            main_player={true}
            active={currentPlayer === 0}
          />
        </div>
      </div>

      <Map
        width={width}
        height={height}
        routes={gameRoutes}
        cities={cities}
        mainPlayer={main_player}
        hoveredRoute={hoveredRoute}
        setHoveredRoute={setHoveredRoute}
        onRouteClaim={handleRouteClaim}
      />
    </main>
  );
};

export default MainGamePage;
