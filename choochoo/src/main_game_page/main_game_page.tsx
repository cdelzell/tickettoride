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

// this works with typescript so had to change file

// let's go airbnb
export type NetworkProps = {
  width: number;
  height: number;
};

// NOTE: STUFF FOR LATER
// export type Player = {
//   username: string;
//   trainCount: number;
//   profilePic: string;
//   trainCards: { color: string; count: number }[];
//   destinationCards: DestinationCard[];
//   claimedRoutes: number[];
//   score: number;
// };

// export type DestinationCard = {
//   source: string;
//   target: string;
//   trains: number;
//   completed: boolean;
// };

// const routePoints = {
//   1: 1,
//   2: 2,
//   3: 4,
//   4: 7,
//   5: 10,
//   6: 15
// };

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

const train_counts = [1, 2, 3, 2, 5, 1, 4, 2, 1];

const train_cards_and_counts = train_cards.map((card, i) => ({
  ...card,
  count: train_counts[i],
}));

const face_up_cards = ["red", "wild", "blue", "purple", "white"];

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

const destination_cards = [
  "alb_miami",
  "alb_tyville",
  "chicago_miami",
  "chicago_phoenix",
  "clara_houston",
  "clara_la",
  "clara_ny",
  "denver_palo",
  "firestone_phoenix",
  "firestone_riddhi",
  "miami_riddhi",
  "ny_houston",
  "ny_oklahoma",
  "ny_tyville",
  "palo_la",
  "palo_phoenix",
  "seattle_alb",
  "seattle_houston",
  "tyville_palo",
  "tyville_phoenix",
  "tyville_wash",
  "wash_denver",
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

const MainGamePage = () => {
  const users: User[] = [new User()];
  const gameRunner = new GameRunner(users);

  const width = window.innerWidth;
  const height = window.innerHeight;

  const [action_box_status, setActionBoxStatus] = useState(0);
  const [draw_dest_active, setDrawDestActive] = useState(false);
  const [gameRoutes, setGameRoutes] = useState<Route[]>(routes);
  const [trainCards, setTrainCards] = useState(train_cards_and_counts);
  const [trains, setTrains] = useState(25);
  const [hoveredRoute, setHoveredRoute] = useState<Route | null>(null);
  const [activeTrains, setActiveTrains] = useState(false);

  useEffect(() => {}, [trainCards]);

  // Function to update a specific train card count
  const updateTrainCardCount = (color: string, amount: number) => {
    setTrainCards((prevCards) =>
      prevCards.map((card) =>
        card.game_color === color
          ? { ...card, count: Math.max(0, card.count + amount) }
          : card
      )
    );
  };

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
      trainCard.count + wildCard.count >= route.trains &&
      trains >= route.trains
    ) {
      // Deduct train cards when claiming a route
      updateTrainCardCount(route.game_color!, -route.trains);
      setTrains(trains - route.trains);
      if (
        route.trains > trainCard.count &&
        trainCard.count + wildCard.count >= route.trains
      ) {
        updateTrainCardCount(route.game_color!, -trainCard.count);
        updateTrainCardCount("wild", -(route.trains - trainCard.count));
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
          />
        ))}
      </div>

      <FaceUpCards
        face_up_cards={face_up_cards}
        updateTrains={updateTrainCardCount}
        active={activeTrains}
      ></FaceUpCards>

      <div className="player_actions">
        <ActionBox
          action={action_box_status}
          updateStatus={updateStatus}
          updateDrawDest={setDrawDestActive}
          updateTrains={updateTrainCardCount}
          updateFaceUp={updateActionCardStatus}
        ></ActionBox>

        <DestinationCardsCarousel
          destinations={destination_cards}
        ></DestinationCardsCarousel>

        {draw_dest_active && (
          <DrawDestinationCard
            destinations={["alb_miami", "alb_tyville", "chicago_miami"]}
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
            username={main_player.username}
            trainCount={trains}
            profilePic={main_player.profilePic}
            main_player={true}
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
