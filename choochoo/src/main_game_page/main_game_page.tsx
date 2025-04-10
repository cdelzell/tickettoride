import React, { useState, useEffect } from "react";
// import { Graph } from "@visx/network";
import monoMap from "../assets/mono_map.jpg";
import "./main_game_page.css";
import GameRunner from "../backend/game-runner";
import User from "../backend/user";
import PlayerCard from "./components/Profile/ProfileCard";
import FaceUpCard from "./components/FaceUpCards/FaceUpCard";
import FaceUpCards from "./components/FaceUpCards/FaceUpCards";
import DestinationCardsCarousel from "./components/DestinationCard/DestinationCard";
import DrawDestinationCard from "./components/DestinationCard/DrawDestinationCard";
import ActionBox from "./components/PlayerActions/ActionBox";
import TrainCard from "./components/TrainCard/TrainCard";
import Map from "./components/Map";
import { useLocation, useNavigate } from "react-router-dom";
import DestinationCard from "../backend/destination-card";

// this works with typescript so had to change file

// let's go airbnb
export type NetworkProps = {
  width: number;
  height: number;
};

//loop through the players given by noah
//if the username of the signed in player (identify using state that is passed in through profile) does not match, make them a player
//otherwise make them the main player

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

const train_cards = [
  { color: "./src/assets/cards/red.png", game_color: "red" },
  { color: "./src/assets/cards/yellow.png", game_color: "yellow" },
  { color: "./src/assets/cards/black.png", game_color: "black" },
  { color: "./src/assets/cards/green.png", game_color: "green" },
  { color: "./src/assets/cards/purple.png", game_color: "purple" },
  { color: "./src/assets/cards/blue.png", game_color: "blue" },
  { color: "./src/assets/cards/brown.png", game_color: "brown" },
  { color: "./src/assets/cards/white.png", game_color: "white" },
  { color: "./src/assets/cards/wild.png", game_color: "wild" },
];

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

const destination_cards = [
  {
    destination1: "Albuquerque",
    destination2: "Miami",
    points: 11,
    image_path: "alb_miami",
  },
  {
    destination1: "Albuquerque",
    destination2: "Tyville",
    points: 9,
    image_path: "alb_tyville",
  },
  {
    destination1: "Chicago",
    destination2: "Miami",
    points: 7,
    image_path: "chicago_miami",
  },
  {
    destination1: "Chicago",
    destination2: "Phoenix",
    points: 11,
    image_path: "chicago_phoenix",
  },
  {
    destination1: "Clara City",
    destination2: "Houston",
    points: 9,
    image_path: "clara_houston",
  },
  {
    destination1: "Clara City",
    destination2: "Los Angeles",
    points: 9,
    image_path: "clara_la",
  },
  {
    destination1: "Clara City",
    destination2: "New York",
    points: 10,
    image_path: "clara_ny",
  },
  {
    destination1: "Denver",
    destination2: "Palo Noah",
    points: 9,
    image_path: "denver_palo",
  },
  {
    destination1: "Albuquerque",
    destination2: "Phoenix",
    points: 9,
    image_path: "firestone_phoenix",
  },
  {
    destination1: "Firestone Rouge",
    destination2: "Phoenix",
    points: 8,
    image_path: "firestone_phoenix",
  },
  {
    destination1: "Firestone Rouge",
    destination2: "Riddhi Rapids",
    points: 9,
    image_path: "firestone_riddhi",
  },
  {
    destination1: "Miami",
    destination2: "Riddhi Rapids",
    points: 18,
    image_path: "miami_riddhi",
  },
  {
    destination1: "New York",
    destination2: "Houston",
    points: 12,
    image_path: "ny_houston",
  },
  {
    destination1: "New York",
    destination2: "Oklahoma City",
    points: 11,
    image_path: "ny_oklahoma",
  },
  {
    destination1: "New York",
    destination2: "Tyville",
    points: 14,
    image_path: "ny_tyville",
  },
  {
    destination1: "Palo Noah",
    destination2: "Los Angeles",
    points: 16,
    image_path: "palo_la",
  },
  {
    destination1: "Palo Noah",
    destination2: "Phoenix",
    points: 12,
    image_path: "palo_phoenix",
  },
  {
    destination1: "Seattle",
    destination2: "Albuquerque",
    points: 10,
    image_path: "seattle_alb",
  },
  {
    destination1: "Seattle",
    destination2: "Houston",
    points: 15,
    image_path: "seattle_houston",
  },
  {
    destination1: "Tyville",
    destination2: "Palo Noah",
    points: 11,
    image_path: "tyville_palo",
  },
  {
    destination1: "Tyville",
    destination2: "Phoenix",
    points: 7,
    image_path: "tyville_phoenix",
  },
  {
    destination1: "Tyville",
    destination2: "Washington",
    points: 13,
    image_path: "tyville_wash",
  },
  {
    destination1: "Washington",
    destination2: "Denver",
    points: 10,
    image_path: "wash_denver",
  },
];

const cities: City[] = [
  { name: "New York", x: 504, y: 133 + 20 }, // 0
  { name: "Chicago", x: 382, y: 130 + 20 }, // 1
  { name: "Denver", x: 230, y: 165 + 20 }, // 2
  { name: "Los Angeles", x: 89, y: 192 + 20 }, // 3
  { name: "Tyville", x: 175, y: 100 + 20 }, // 4
  { name: "Clara City", x: 270, y: 70 + 20 }, // 5
  { name: "Palo Noah", x: 430, y: 230 + 20 }, // 6
  { name: "Riddhi Rapids", x: 76, y: 100 + 20 }, // 7
  { name: "Firestone Rouge", x: 340, y: 175 + 20 }, // 8
  { name: "Seattle", x: 110, y: 35 + 20 }, // 9
  { name: "Miami", x: 475, y: 305 + 20 }, // 10
  { name: "Phoenix", x: 165, y: 220 + 20 }, // 11
  { name: "Houston", x: 315, y: 280 + 20 }, // 12
  { name: "Washington", x: 485, y: 172 + 20 }, // 13
  { name: "Oklahoma City", x: 300, y: 213 + 20 }, // 14
  { name: "Albuquerque", x: 220, y: 212 + 20 }, // 15
];

// 29 routes

const routes: Route[] = [
  {
    source: cities[0],
    target: cities[1],
    dashed: true,
    color: "#b03517",
    game_color: "red",
    trains: 4,
  },
  {
    source: cities[1],
    target: cities[6],
    dashed: true,
    color: "#e6c10e",
    game_color: "yellow",
    trains: 3,
  },
  {
    source: cities[1],
    target: cities[5],
    dashed: true,
    color: "#1e1b1c",
    game_color: "black",
    trains: 5,
  },
  {
    source: cities[0],
    target: cities[13],
    dashed: true,
    color: "#72922e",
    game_color: "green",
    trains: 1,
  },
  {
    source: cities[1],
    target: cities[8],
    dashed: true,
    color: "#a77daf",
    game_color: "purple",
    trains: 2,
  },
  {
    source: cities[5],
    target: cities[8],
    dashed: true,
    color: "#519bdb",
    game_color: "blue",
    trains: 4,
  },
  {
    source: cities[7],
    target: cities[3],
    dashed: true,
    color: "#519bdb",
    game_color: "blue",
    trains: 3,
  }, // riddhi rapids to LA
  {
    source: cities[7],
    target: cities[4],
    dashed: true,
    color: "#c18135",
    game_color: "brown",
    trains: 3,
  }, // riddhi rapids to tyville

  {
    source: cities[4],
    target: cities[5],
    dashed: true,
    color: "#e6e5e3",
    game_color: "white",

    trains: 3,
  }, // ty ville to clara city
  {
    source: cities[2],
    target: cities[5],
    dashed: true,
    color: "#b03517",
    game_color: "red",
    trains: 3,
  }, // denver to clara city
  {
    source: cities[3],
    target: cities[2],
    dashed: true,
    color: "#e6c10e",
    game_color: "yellow",
    trains: 4,
  }, // LA to denver
  {
    source: cities[4],
    target: cities[2],
    dashed: true,
    color: "#1e1b1c",
    game_color: "black",
    trains: 3,
  }, // tyville to denver
  {
    source: cities[3],
    target: cities[8],
    dashed: true,
    color: "#72922e",
    game_color: "green",
    trains: 6,
  }, // LA to firestone rouge
  {
    source: cities[2],
    target: cities[8],
    dashed: true,
    color: "#a77daf",
    game_color: "purple",
    trains: 4,
  },
  {
    source: cities[6],
    target: cities[8],
    dashed: true,
    color: "#519bdb",
    game_color: "blue",
    trains: 5,
  }, // palo noah to firestone rouge
  {
    source: cities[14],
    target: cities[12],
    dashed: true,
    color: "#c18135",
    game_color: "brown",
    trains: 2,
  },
  {
    source: cities[11],
    target: cities[12],
    dashed: true,
    color: "#e6e5e3",
    game_color: "white",
    trains: 5,
  }, // phoenix to houston
  {
    source: cities[11],
    target: cities[3],
    dashed: true,
    color: "#b03517",
    game_color: "red",
    trains: 2,
  },
  {
    source: cities[11],
    target: cities[15],
    dashed: true,
    color: "#e6c10e",
    game_color: "yellow",
    trains: 1,
  },
  {
    source: cities[8],
    target: cities[14],
    dashed: true,
    color: "#1e1b1c",
    game_color: "black",
    trains: 1,
  },
  {
    source: cities[7],
    target: cities[9],
    dashed: true,
    color: "#72922e",
    game_color: "green",
    trains: 3,
  }, // rr to seattle
  {
    source: cities[5],
    target: cities[9],
    dashed: true,
    color: "#a77daf",
    game_color: "purple",
    trains: 6,
  }, // cc to seattle
  {
    source: cities[6],
    target: cities[10],
    dashed: true,
    color: "#519bdb",
    game_color: "blue",
    trains: 4,
  }, // pn to miami
  {
    source: cities[1],
    target: cities[13],
    dashed: true,
    color: "#c18135",
    game_color: "brown",
    trains: 4,
  }, //chicago to washington
  {
    source: cities[6],
    target: cities[13],
    dashed: true,
    color: "#e6e5e3",
    game_color: "white",
    trains: 4,
  }, //palo noah to washington
  {
    source: cities[6],
    target: cities[12],
    dashed: true,
    color: "#b03517",
    game_color: "red",
    trains: 5,
  }, //palo noah to houston
  {
    source: cities[15],
    target: cities[12],
    dashed: true,
    color: "#e6c10e",
    game_color: "yellow",
    trains: 5,
  }, //ALB to houston
  {
    source: cities[15],
    target: cities[14],
    dashed: true,
    color: "#1e1b1c",
    game_color: "black",
    trains: 3,
  }, //ALB to OC
  {
    source: cities[6],
    target: cities[14],
    dashed: true,
    color: "#72922e",
    game_color: "green",
    trains: 5,
  }, //palo noah to oc
];

export const background = "#d3d3d3";

const graph = {
  nodes: cities,
  links: routes,
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
  const { state } = useLocation(); // Use location to get the state passed from navigate
  const { userKey, userProfile } = state || {}; // Fallback to empty object if state is undefined

  const { username, wins, total_score, profile_picture } = userProfile || {};

  const [action_box_status, setActionBoxStatus] = useState(0);
  const [draw_dest_active, setDrawDestActive] = useState(false);
  const [gameRoutes, setGameRoutes] = useState<Route[]>(routes);
  const [trainCards, setTrainCards] = useState(train_cards_and_counts);
  const [trains, setTrains] = useState(25);
  const [hoveredRoute, setHoveredRoute] = useState<Route | null>(null);
  const [activeTrains, setActiveTrains] = useState(false);
  const [drawnDestCards, setDrawDestCard] = useState<number[]>([]);
  const [drawClickCount, setDrawClickCount] = useState(0);
  const [playClickCount, setPlayClickCount] = useState(0);
  const [destClickCount, setDestClickCount] = useState(0);
  const [turnComplete, setTurnComplete] = useState(false);
  const [currentPlayer, setCurrentPlayer] = useState(0); // index of current player
  const [drawnCard, setDrawnCard] = useState<string | null>(null);
  const [showCardNotification, setShowCardNotification] = useState(false);

  const [destinationCardPoss, setDestinationCardPoss] = useState(
    gameRunner.getDestinationCardPossibilities()
  );

  //make useeffect for currentplayer, should get all new info from the gamerunner when current player changes
  //make useeffect for gameover, end game

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
    console.log("here");
    const trains = train_cards.map((card, i) => ({
      ...card,
      count: cards[i],
    }));

    console.log(trains);

    setTrainCards(trains);
  };

  // CHECK HERE
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

  const updateActionCardStatus = (action: boolean) => {
    if (action) {
      setActiveTrains(true);
    } else {
      setActiveTrains(false);
    }
  };

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
      drawClickCount == 0 &&
      destClickCount == 0 &&
      playClickCount == 0
    ) {
      // Deduct train cards when claiming a route
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

      // Update the claimed routes
      setGameRoutes((prevRoutes) =>
        prevRoutes.map((r) =>
          action_box_status === 2 &&
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

  const updateStatus = (newStatus: React.SetStateAction<number>) => {
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
      //function to update player hand
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
    //have function that updates the map for the gamerunner

    // move to the next array in cycle
    setCurrentPlayer((current) => (current + 1) % (players.length + 1));
  };

  // CSS for the endturn button
  const endTurnButtonStyle: React.CSSProperties = {
    // padding: "1vw 3vw", // Scales with viewport width
    width: "12vw",
    height: "3vw",
    fontSize: "1vw", // Adjusts size dynamically
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
      {/* player cards */}
      <div className="player_cards">
        {players.map((player, index) => (
          <PlayerCard
            key={index}
            username={player.username}
            trainCount={player.trainCount}
            profilePic={player.profilePic}
            main_player={false}
            active={currentPlayer === index + 1} // + 1 because currentPlayer 0 is main player
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
      ></FaceUpCards>

      {/* end turn button */}
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
          updateDrawDest={setDrawDestActive}
          updateTrains={updateTrainCardCount}
          updateFaceUp={updateActionCardStatus}
          drawClickCount={drawClickCount}
          setDrawClickCount={setDrawClickCount}
          playClickCount={playClickCount}
          setPlayClickCount={setPlayClickCount}
          destClickCount={destClickCount}
          setDestClickCount={setDestClickCount}
          handleDrawPileClick={handleDrawPileClick}
        ></ActionBox>

        <DestinationCardsCarousel
          destinations={destination_cards}
        ></DestinationCardsCarousel>

        {draw_dest_active && (
          <DrawDestinationCard
            //call the backend method here to get the destination cards
            destinations={getDestinationCardPossibilitiesFormatted(
              destinationCardPoss
            )}
            drawnDestCards={drawnDestCards}
            setDrawDestCard={setDrawDestCard}
          ></DrawDestinationCard>
        )}

        {/* train cards */}
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

        {/* main player */}
        <div className="main_player_card">
          <PlayerCard
            username={username}
            trainCount={trains}
            profilePic={profile_picture}
            main_player={true}
            active={currentPlayer === 0} // main player is active when currentPlayer is 0
          />
        </div>
      </div>

      {/* map */}
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
