import React, { useState, useEffect } from "react";
import { Graph } from "@visx/network";
import monoMap from "../assets/mono_map.jpg";
import PlayerCard from "./components/ProfileCard";
import FaceUpCard from "./components/FaceUpCards/FaceUpCard";
import FaceUpCards from "./components/FaceUpCards/FaceUpCards";
// import { useWebSocket } from "../web_socket.jsx";

import "./main_game_page.css";

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

interface City {
  name: string;
  x: number;
  y: number;
  color?: string;
}

interface Route {
  source: City;
  target: City;
  dashed?: boolean;
  color?: string;
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

const routes: Route[] = [
  { source: cities[0], target: cities[1], dashed: true, color: "#FFA630" },
  { source: cities[1], target: cities[6], dashed: true, color: "#4DA1A9" },
  { source: cities[1], target: cities[5], dashed: true, color: "#2E5077" },
  { source: cities[0], target: cities[13], dashed: true, color: "#611C35" }, //new york to washington
  { source: cities[1], target: cities[8], dashed: true, color: "#419D78" },
  { source: cities[5], target: cities[8], dashed: true, color: "#B9314F" },
  { source: cities[7], target: cities[3], dashed: true, color: "#FFA630" }, // riddhi rapids to LA
  { source: cities[7], target: cities[4], dashed: true, color: "#B9314F" }, // riddhi rapids to tyville
  { source: cities[4], target: cities[5], dashed: true, color: "#2E5077" }, // ty ville to clara city
  { source: cities[2], target: cities[5], dashed: true, color: "#419D78" }, // denver to clara city
  { source: cities[3], target: cities[2], dashed: true, color: "#611C35" }, // LA to denver
  { source: cities[4], target: cities[2], dashed: true, color: "#4DA1A9" }, // tyville to denver
  { source: cities[3], target: cities[8], dashed: true, color: "#FFA630" }, // LA to firestone rouge
  { source: cities[2], target: cities[8], dashed: true, color: "#419D78" }, // denver to firestone rouge
  { source: cities[6], target: cities[8], dashed: true, color: "#611C35" }, // palo noah to firestone rouge
  { source: cities[14], target: cities[12], dashed: true, color: "#4DA1A9" }, // oc to houston
  { source: cities[11], target: cities[12], dashed: true, color: "#FFA630" }, // phoenix to houston
  { source: cities[11], target: cities[3], dashed: true, color: "#419D78" }, // phoenix to LA
  { source: cities[11], target: cities[15], dashed: true, color: "#2E5077" }, // phoenix to ALB
  { source: cities[8], target: cities[14], dashed: true, color: "#FFA630" }, // fr to oc
  { source: cities[7], target: cities[9], dashed: true, color: "#B9314F" }, // rr to seattle
  { source: cities[5], target: cities[9], dashed: true, color: "#4DA1A9" }, // cc to seattle
  { source: cities[6], target: cities[10], dashed: true, color: "#FFA630" }, // cc to seattle
  { source: cities[1], target: cities[13], dashed: true, color: "#419D78" }, //chicago to washington
  { source: cities[6], target: cities[13], dashed: true, color: "#B9314F" }, //palo noah to washington
  { source: cities[6], target: cities[12], dashed: true, color: "#2E5077" }, //palo noah to houston
  { source: cities[15], target: cities[12], dashed: true, color: "#611C35" }, //ALB to houston
  { source: cities[15], target: cities[14], dashed: true, color: "#611C35" }, //ALB to OC
  { source: cities[6], target: cities[14], dashed: true, color: "#4DA1A9" }, //palo noah to oc
];

export const background = "#d3d3d3";

const graph = {
  nodes: cities,
  links: routes,
};

const MainGamePage = () => {
  const width = window.innerWidth;
  const height = window.innerHeight;

  const [action_box_status, setActionBoxStatus] = useState(0);
  const [draw_dest_active, setDrawDestActive] = useState(false);

  useEffect(() => {
    setDrawDestActive(true); // ✅ Runs after render, preventing the error
  }, []);

  const updateStatus = (newStatus: React.SetStateAction<number>) => {
    setActionBoxStatus(newStatus);
  };

  return (
    <main className="main_game_page">
      {/* player cards */}
      <div className="player-cards">
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
        <div className="main-player-card">
          <PlayerCard
            username={main_player.username}
            trainCount={main_player.trainCount}
            profilePic={main_player.profilePic}
            main_player={true}
          />
        </div>
      </div>

      {/* map */}
      <USMap width={width} height={height} />
    </main>
  );
};

function ActionBox({
  action,
  updateStatus,
  updateDrawDest,
}: {
  action: number;
  updateStatus: (newStatus: number) => void;
  updateDrawDest: (newStatus: boolean) => void;
}) {
  useEffect(() => {
    if (action === 3) {
      updateDrawDest(true);
    }
  }, [action, updateDrawDest]); // Runs only when `action` changes

  return (
    <div className="box">
      {action === 0 ? (
        <HomeBox updateStatus={updateStatus} />
      ) : action === 1 ? (
        <DrawTrains />
      ) : action === 2 ? (
        <PlayTrains />
      ) : action === 3 ? (
        <div />
      ) : (
        <div />
      )}
    </div>
  );
}

function HomeBox({
  updateStatus,
}: {
  updateStatus: (newStatus: number) => void;
}) {
  return (
    <div className="home">
      <button onClick={() => updateStatus(1)}>Draw Trains</button>
      <button onClick={() => updateStatus(2)}>Play Trains</button>
      <button onClick={() => updateStatus(3)}>Draw Destination</button>
    </div>
  );
}

function DrawTrains() {
  return (
    <div className="draw_trains">
      <div className="draw_train_rules">
        <p>You may:</p>
        <p>a) draw a random train</p>
        <p>b) draw a train from the face-up cards</p>
        <p>c) a combination of both</p>
      </div>

      <DrawPile></DrawPile>
    </div>
  );
}

function PlayTrains() {
  return (
    <div className="claim_route">
      <p>Please claim a route on the board.</p>
    </div>
  );
}

function TrainCard({ color, count }: { color: string; count: number }) {
  return (
    <div className="card_with_count">
      <img className="train_card" src={color} alt={color} />
      <div className="circle">{count}</div>
    </div>
  );
}

function DrawPile() {
  // const { message, setMessage, sendMessage, receivedMessage } = useWebSocket(
  //   "ws://localhost:5173"
  // );

  // const handleSubmit = (e: { preventDefault: () => void }) => {
  //   e.preventDefault();

  //   sendMessage({
  //     type: "draw_card",
  //   });

  //   console.log("Sent info to backend:", card); // Optionally log the credentials (be careful with production!)
  // };

  // const [card, setCard] = useState("");

  return (
    <button className="draw_pile">
      <img src="./src/assets/draw_pile.jpg" alt="draw pile" />
    </button>
  );
}

function DestinationCardsCarousel({
  destinations,
}: {
  destinations: string[];
}) {
  const [index, setIndex] = useState(0);

  const nextImage = () => {
    setIndex((prevIndex) => (prevIndex + 1) % destinations.length);
  };

  const prevImage = () => {
    setIndex(
      (prevIndex) => (prevIndex - 1 + destinations.length) % destinations.length
    );
  };

  return (
    <div className="image_carousel">
      <DestinationCard destination={destinations[index]} location="pile" />
      <div className="button_container">
        <button onClick={prevImage} className="carousel_button">
          <img src="./src/assets/arrows/left_arrow.png"></img>
        </button>
        <button onClick={nextImage} className="carousel_button">
          <img src="./src/assets/arrows/right_arrow.png"></img>
        </button>
      </div>
    </div>
  );
}

function DestinationCard({
  destination,
  location,
}: {
  destination: string;
  location: string;
}) {
  let name = "destination_card";
  if (location === "draw") {
    name = "destination_card_draw";
  } else if (location === "test") {
    name = "test";
  }

  return (
    <img
      className={name}
      src={"./src/assets/destination_cards/" + destination + ".png"}
      alt={destination}
    />
  );
}

function DrawDestinationCard({ destinations }: { destinations: string[] }) {
  return (
    <div className="draw_destination">
      <button className="destination_button">
        <DestinationCard
          destination={destinations[0]}
          location="draw"
        ></DestinationCard>
      </button>
      <button>
        <DestinationCard
          destination={destinations[1]}
          location="draw"
        ></DestinationCard>
      </button>
      <button>
        <DestinationCard
          destination={destinations[2]}
          location="draw"
        ></DestinationCard>
      </button>
    </div>
  );
}

function USMap({ width, height }: NetworkProps) {
  const MAP_WIDTH = 600;
  const MAP_HEIGHT = 400;

  const [dimensions, setDimensions] = useState({
    width: width * 0.9,
    height: height * 0.9,
  });

  useEffect(() => {
    function handleResize() {
      const containerWidth = window.innerWidth * 0.9;
      const containerHeight = window.innerHeight * 0.9;

      const xScale = containerWidth / MAP_WIDTH;
      const yScale = containerHeight / MAP_HEIGHT;
      const scaleFactor = Math.min(xScale, yScale);

      setDimensions({
        width: MAP_WIDTH * scaleFactor,
        height: MAP_HEIGHT * scaleFactor,
      });
    }

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const scaleFactor = dimensions.width / MAP_WIDTH;

  return width < 10 ? null : (
    <svg
      width={dimensions.width}
      height={dimensions.height}
      viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
      preserveAspectRatio="xMidYMid meet"
    >
      {/* background map */}
      <image
        href={monoMap}
        x="0"
        y="0"
        width={MAP_WIDTH}
        height={MAP_HEIGHT}
        preserveAspectRatio="xMidYMid meet"
      />

      {/*  routes  */}
      {routes.map((route, index) => (
        <line
          key={`route-${index}`}
          x1={route.source.x}
          y1={route.source.y}
          x2={route.target.x}
          y2={route.target.y}
          strokeWidth={6}
          stroke={route.color || "black"}
          strokeOpacity={0.8}
          strokeDasharray={route.dashed ? "20,4" : undefined}
        />
      ))}

      {/*  city nodes  */}
      {cities.map((city, index) => (
        <g key={`city-${index}`}>
          <circle
            cx={city.x}
            cy={city.y}
            r={5}
            fill={city.color || "black"}
            opacity={0.68}
          />

          {/* rectangle for text */}
          <rect
            x={city.x - 31.5}
            y={city.y - 20}
            width={60}
            height={13}
            fill="white"
            stroke="black"
            strokeWidth={0.5}
            rx={5}
            ry={5}
            opacity={0.8}
          />
          <text
            x={city.x}
            y={city.y - 11}
            fill="black"
            fontSize="6.5px"
            textAnchor="middle"
          >
            {city.name}
          </text>
        </g>
      ))}
    </svg>
  );
}

export default MainGamePage;
