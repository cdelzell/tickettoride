import React, { useState, useEffect } from "react";
import { Graph } from "@visx/network";
import monoMap from "../assets/mono_map.jpg";
import "./main_game_page.css";
import GameRunner from "../backend/game-runner"
import User from "../backend/user"

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
//   points: number;
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
  { color: "./src/assets/cards/red.png" },
  { color: "./src/assets/cards/yellow.png" },
  { color: "./src/assets/cards/black.png" },
  { color: "./src/assets/cards/green.png" },
  { color: "./src/assets/cards/purple.png" },
  { color: "./src/assets/cards/blue.png" },
  { color: "./src/assets/cards/brown.png" },
  { color: "./src/assets/cards/white.png" },
  { color: "./src/assets/cards/wild.png" },
];

const train_counts = [1, 2, 3, 4, 5, 6, 7, 8, 20];

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
  points: number;
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
  { name: "New York", x: 504, y: 133 }, // 0
  { name: "Chicago", x: 382, y: 130 }, // 1
  { name: "Denver", x: 230, y: 165 }, // 2
  { name: "Los Angeles", x: 89, y: 192 }, // 3
  { name: "Tyville", x: 175, y: 100 }, // 4
  { name: "Clara City", x: 270, y: 70 }, // 5
  { name: "Palo Noah", x: 430, y: 230 }, // 6
  { name: "Riddhi Rapids", x: 76, y: 100 }, // 7
  { name: "Firestone Rouge", x: 340, y: 175 }, // 8
  { name: "Seattle", x: 110, y: 35 }, // 9
  { name: "Miami", x: 475, y: 305 }, // 10
  { name: "Phoenix", x: 165, y: 220 }, // 11
  { name: "Houston", x: 315, y: 280 }, // 12
  { name: "Washington", x: 485, y: 172 }, // 13
  { name: "Oklahoma City", x: 300, y: 213 }, // 14
  { name: "Albuquerque", x: 220, y: 212 }, // 15
];

// 29 routes

const routes: Route[] = [
  {
    source: cities[0],
    target: cities[1],
    dashed: true,
    color: "#b03517",
    points: 7,
  },
  {
    source: cities[1],
    target: cities[6],
    dashed: true,
    color: "#e6c10e",
    points: 4,
  },
  {
    source: cities[1],
    target: cities[5],
    dashed: true,
    color: "#1e1b1c",
    points: 4,
  },
  {
    source: cities[0],
    target: cities[13],
    dashed: true,
    color: "#72922e",
    points: 1,
  }, //new york to washington
  {
    source: cities[1],
    target: cities[8],
    dashed: true,
    color: "#a77daf",
    points: 2,
  },
  {
    source: cities[5],
    target: cities[8],
    dashed: true,
    color: "#c1a5cd",
    points: 7,
  },
  {
    source: cities[7],
    target: cities[3],
    dashed: true,
    color: "#862b0f",
    points: 4,
  }, // riddhi rapids to LA
  {
    source: cities[7],
    target: cities[4],
    dashed: true,
    color: "#c18135",
    points: 4,
  }, // riddhi rapids to tyville
  {
    source: cities[4],
    target: cities[5],
    dashed: true,
    color: "#e6e5e3", //white 8
    points: 4,
  }, // ty ville to clara city
  {
    source: cities[2],
    target: cities[5],
    dashed: true,
    color: "#b03517",
    points: 7,
  }, // denver to clara city
  {
    source: cities[3],
    target: cities[2],
    dashed: true,
    color: "#e6c10e",
    points: 10,
  }, // LA to denver
  {
    source: cities[4],
    target: cities[2],
    dashed: true,
    color: "#1e1b1c",
    points: 4,
  }, // tyville to denver
  {
    source: cities[3],
    target: cities[8],
    dashed: true,
    color: "#72922e",
    points: 15,
  }, // LA to firestone rouge
  {
    source: cities[2],
    target: cities[8],
    dashed: true,
    color: "#a77daf",
    points: 4,
  }, // denver to firestone rouge
  {
    source: cities[6],
    target: cities[8],
    dashed: true,
    color: "#c1a5cd",
    points: 4,
  }, // palo noah to firestone rouge
  {
    source: cities[14],
    target: cities[12],
    dashed: true,
    color: "#c18135",
    points: 2,
  }, // oc to houston
  {
    source: cities[11],
    target: cities[12],
    dashed: true,
    color: "#e6e5e3",
    points: 10,
  }, // phoenix to houston
  {
    source: cities[11],
    target: cities[3],
    dashed: true,
    color: "#b03517",
    points: 2,
  }, // phoenix to LA
  {
    source: cities[11],
    target: cities[15],
    dashed: true,
    color: "#e6c10e",
    points: 1,
  }, // phoenix to ALB
  {
    source: cities[8],
    target: cities[14],
    dashed: true,
    color: "#1e1b1c",
    points: 1,
  }, // fr to oc
  {
    source: cities[7],
    target: cities[9],
    dashed: true,
    color: "#72922e",
    points: 4,
  }, // rr to seattle
  {
    source: cities[5],
    target: cities[9],
    dashed: true,
    color: "#a77daf",
    points: 15,
  }, // cc to seattle
  {
    source: cities[6],
    target: cities[10],
    dashed: true,
    color: "#c1a5cd",
    points: 7,
  }, // pn to miami
  {
    source: cities[1],
    target: cities[13],
    dashed: true,
    color: "#c18135",
    points: 7,
  }, //chicago to washington
  {
    source: cities[6],
    target: cities[13],
    dashed: true,
    color: "#e6e5e3",
    points: 7,
  }, //palo noah to washington
  {
    source: cities[6],
    target: cities[12],
    dashed: true,
    color: "#b03517",
    points: 10,
  }, //palo noah to houston
  {
    source: cities[15],
    target: cities[12],
    dashed: true,
    color: "#e6c10e",
    points: 10,
  }, //ALB to houston
  {
    source: cities[15],
    target: cities[14],
    dashed: true,
    color: "#1e1b1c",
    points: 4,
  }, //ALB to OC
  {
    source: cities[6],
    target: cities[14],
    dashed: true,
    color: "#72922e",
    points: 10,
  }, //palo noah to oc
];

export const background = "#d3d3d3";

const graph = {
  nodes: cities,
  links: routes,
};

const MainGamePage = () => {
  const users: User[] = [new User()]
  const gameRunner = new GameRunner(users);

  const width = window.innerWidth;
  const height = window.innerHeight;

  const [action_box_status, setActionBoxStatus] = useState(0);
  const [draw_dest_active, setDrawDestActive] = useState(false);
  const [gameRoutes, setGameRoutes] = useState<Route[]>(routes);

  const handleRouteClaim = (route: Route) => {
    // testing - need to change to check if player has eough train cards
    const updatedRoutes = gameRoutes.map((r) =>
      action_box_status === 2 &&
      r.source.name === route.source.name &&
      r.target.name === route.target.name
        ? { ...r, claimer: main_player.username }
        : r
    );

    setGameRoutes(updatedRoutes);
    return true;
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

      <FaceUpCards face_up_cards={face_up_cards}></FaceUpCards>

      <div className="player_actions">
        <ActionBox
          action={action_box_status}
          updateStatus={updateStatus}
          updateDrawDest={setDrawDestActive}
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
          {train_cards_and_counts.map((train_card, index) => (
            <TrainCard
              key={index}
              color={train_card.color}
              count={train_card.count}
            />
          ))}
        </div>

        {/* main player */}
        <div className="main_player_card">
          <PlayerCard
            username={main_player.username}
            trainCount={main_player.trainCount}
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
        onRouteClaim={handleRouteClaim}
      />
    </main>
  );
};
export default MainGamePage;
