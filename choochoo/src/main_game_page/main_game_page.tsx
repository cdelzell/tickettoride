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
import { profileImages } from "@/image_imports";

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
  claimerProfilePic?: string;
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
  const { players = [], lobbyCode, userProfile } = state || {};
  const { username, wins, total_score, profile_picture } = userProfile || {};

  const width = window.innerWidth;
  const height = window.innerHeight;

  const [gameRunner, setGameRunner] = useState<GameRunner>();
  const [destinationCardPoss, setDestinationCardPoss] = useState<DestinationCard[]>([]);
  const [playerDestinationCards, setPlayerDestinationCards] = useState<DestinationCardInfo[]>([]);
  const [action_box_status, setActionBoxStatus] = useState(0);
  const [draw_dest_active, setDrawDestActive] = useState(false);
  const [gameRoutes, setGameRoutes] = useState<Route[]>(routes);
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

  const [trainCards, setTrainCards] = useState(() =>
    train_cards.map((card) => ({ ...card, count: 0 }))
  );

  useEffect(() => {
    if (!lobbyCode) return;
    const tempRunner = new GameRunner([], lobbyCode);
    tempRunner.startListeningForUpdates((newRunner) => {
      setGameRunner(newRunner);
    });
    return () => {
      // tempRunner.stopListeningForUpdates?.();
    };
  }, [lobbyCode]);

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
      setPlayerDestinationCards(getDestinationCardPossibilitiesFormatted(cards));
    }
  }, [gameRunner]);

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

  const normalizeProfileKey = (path: string): string =>
    path?.split("/").pop()?.split(".")[0]?.split("-")[0] || "default";

  const updateTrainCardCount = (color: string, amount: number) => {
    setTrainCards((prevCards) =>
      prevCards.map((card) =>
        card.game_color === color
          ? { ...card, count: Math.max(0, card.count + amount) }
          : card
      )
    );
  };

  const getDestinationCardPossibilitiesFormatted = (cards: DestinationCard[]) => {
    return cards
      .map((destination_card) => {
        if (!destination_card) return null;
        return destination_cards.find(
          (card) =>
            card.destination1 === destination_card.destination1 &&
            card.destination2 === destination_card.destination2
        );
      })
      .filter((card): card is DestinationCardInfo => card !== null);
  };

  const updatePlayerHand = (cards: number[]) => {
    const updatedTrains = train_cards.map((card, i) => ({
      ...card,
      count: cards[i],
    }));
    setTrainCards(updatedTrains);
  };

  const handleRouteClaim = (route: Route) => {
    const routeIndex = gameRunner.gameBoard.boardGraph.routes.findIndex(
      (r) =>
        (r.destination1 === route.source.name &&
          r.destination2 === route.target.name) ||
        (r.destination1 === route.target.name &&
          r.destination2 === route.source.name)
    );

    if (routeIndex === -1) return false;

    if (
      action_box_status === 2 &&
      drawClickCount === 0 &&
      destClickCount === 0 &&
      playClickCount === 0
    ) {
      const claimed = gameRunner.claimRoute(routeIndex, profile_picture);
      if (claimed) {
        setPlayClickCount(playClickCount + 1);
        setTrains(gameRunner.getMainPlayerTrainCount());

        const updatedTrainCounts = gameRunner.getMainPlayerTrainCards();
        const updatedTrainCards = train_cards.map((card, i) => ({
          ...card,
          count: updatedTrainCounts[i],
        }));
        setTrainCards(updatedTrainCards);

        setGameRoutes((prevRoutes) =>
          prevRoutes.map((r) =>
            (r.source.name === route.source.name &&
              r.target.name === route.target.name) ||
            (r.source.name === route.target.name &&
              r.target.name === route.source.name)
              ? { ...r, claimer: username, claimerProfilePic: profile_picture }
              : r
          )
        );
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

      let drawnCardColor = null;
      for (let i = 0; i < trainCards.length; i++) {
        if (updatedTrainCounts[i] > trainCards[i].count) {
          drawnCardColor = train_cards[i].game_color;
          break;
        }
      }

      const updatedTrainCards = train_cards.map((card, i) => ({
        ...card,
        count: updatedTrainCounts[i],
      }));
      setTrainCards(updatedTrainCards);

      if (drawnCardColor) {
        setDrawnCard(drawnCardColor);
        setShowCardNotification(true);
        setTimeout(() => setShowCardNotification(false), 3000);
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
    position: "absolute",
    right: "1.5vw",
    bottom: "13.9vw",
    zIndex: 1000,
    display: turnComplete ? "block" : "none",
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
  };

  return (
    <main className="main_game_page">
      <div className="player_cards">
        {players.map((player, index) => (
          <PlayerCard
            key={index}
            username={player.username}
            trainCount={player.trainCount}
            profilePic={normalizeProfileKey(player.profilePic)}
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
            profilePic={normalizeProfileKey(profile_picture)}
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
        mainPlayer={{
          username,
          profilePic: profile_picture,
        }}
        hoveredRoute={hoveredRoute}
        setHoveredRoute={setHoveredRoute}
        onRouteClaim={handleRouteClaim}
      />
    </main>
  );
};

export default MainGamePage;