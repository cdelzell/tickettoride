import React from "react";
import { Graph } from "@visx/network";
import monoMap from "../assets/mono_map.jpg";
import { useState } from "react";
import { useWebSocket } from "../web_socket.jsx";
import "./main_game_page.css";

// this works with typescript so had to change file

// let's go airbnb
export type NetworkProps = {
  width: number;
  height: number;
};

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

const face_up_cards = [
  { color: "red" },
  { color: "wild" },
  { color: "blue" },
  { color: "purple" },
  { color: "white" },
];

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

const cities: City[] = [
  { name: "New York", x: 560, y: 110 }, // 0
  { name: "Chicago", x: 423, y: 143 }, // 1
  { name: "Denver", x: 275, y: 175 }, // 2
  { name: "Los Angeles", x: 144, y: 220 }, // 3
  { name: "Tyville", x: 230, y: 120 }, // 4
  { name: "Clara City", x: 360, y: 80 }, // 5
  { name: "Palo Noah", x: 480, y: 245 }, // 6
  { name: "Riddhi Rapids", x: 120, y: 125 }, // 7
  { name: "Firestone Rouge", x: 380, y: 185 }, // 8
  { name: "Seattle", x: 152, y: 60 }, // 9
  { name: "Miami", x: 515, y: 320 }, // 10
  { name: "Phoenix", x: 210, y: 245 }, // 11
  { name: "Houston", x: 360, y: 290 }, // 12
  { name: "Washington", x: 523, y: 162 }, // 13
  { name: "Oklahoma City", x: 344, y: 223 }, // 14
  { name: "Albuquerque", x: 260, y: 232 }, // 15
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

      <FaceUpCards></FaceUpCards>

      <div className="player_actions">
        <ActionBox
          action={action_box_status}
          updateStatus={updateStatus}
        ></ActionBox>

        <DestinationCards></DestinationCards>

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

function PlayerCard({
  username,
  trainCount,
  profilePic,
  main_player,
}: {
  username: string;
  trainCount: number;
  profilePic: string;
  main_player: boolean;
}) {
  return (
    <div className={main_player ? "main-player-card" : "player-card"}>
      <img className="profile-pic" src={profilePic} alt="Profile" />
      <div className="player-info">
        <span className="username">{username}</span>
        <span className="train-count">{trainCount} Trains</span>
      </div>
    </div>
  );
}

function FaceUpCards() {
  return (
    <div className="holder">
      {face_up_cards.map((face_up_card) => (
        <FaceUpCard color={face_up_card.color} />
      ))}
    </div>
  );
}

function FaceUpCard({ color }: { color: string }) {
  return (
    <div>
      <button className="face_up_card">
        <img
          className="train_card"
          src={"./src/assets/cards/" + color + ".png"}
          alt={color}
        />
      </button>
    </div>
  );
}

function ActionBox({
  action,
  updateStatus,
}: {
  action: number;
  updateStatus: (newStatus: number) => void;
}) {
  return (
    <div className="box">
      {action === 0 ? (
        <HomeBox updateStatus={updateStatus} />
      ) : action == 1 ? (
        <DrawTrains></DrawTrains>
      ) : action == 2 ? (
        <PlayTrains></PlayTrains>
      ) : (
        <div></div>
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
      <button>Draw Destination</button>
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
  const { message, setMessage, sendMessage, receivedMessage } = useWebSocket(
    "ws://localhost:5173"
  );

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();

    sendMessage({
      type: "draw_card",
    });

    console.log("Sent info to backend:", card); // Optionally log the credentials (be careful with production!)
  };

  const [card, setCard] = useState("");

  return (
    <button className="draw_pile" onClick={handleSubmit}>
      <img src="./src/assets/draw_pile.jpg" alt="draw pile" />
    </button>
  );
}

function DestinationCards() {
  return (
    <img
      className="destination_cards"
      src="./src/assets/destination_brown.jpg"
      alt="destination cards"
    />
  );
}

function USMap({ width, height }: NetworkProps) {
  const mapWidth = width * 0.9;
  const mapHeight = height * 0.9;
  const scaleX = (x: number) => (x / 600) * mapWidth;
  const scaleY = (y: number) => (y / 350) * mapHeight;
  return width < 10 ? null : (
    <svg width={mapWidth} height={mapHeight}>
      {/* background map */}
      <image
        href={monoMap}
        x="0%"
        y="5%"
        width="100%"
        height="100%"
        preserveAspectRatio="xMidYMid meet"
      />

      {/* graph of cities and routes */}
      <Graph<Route, City>
        graph={graph}
        top={0}
        left={0}
        nodeComponent={({ node }) => (
          <g>
            <circle
              cx={node.x}
              cy={node.y}
              r={8}
              fill={node.color || "black"}
              opacity={0.68}
            />

            {/* rectangle for text */}
            <rect
              x={node.x - 60}
              y={node.y - 30}
              width={120}
              height={20}
              fill="white"
              stroke="black"
              strokeWidth={0.5}
              rx={5}
              ry={5}
              opacity={0.8}
            />
            <text
              x={node.x}
              y={node.y - 15}
              fill="black"
              fontSize="15px"
              textAnchor="middle"
            >
              {node.name}
            </text>
          </g>
        )}
        linkComponent={({ link }) => (
          <line
            x1={link.source.x * 2.0}
            y1={link.source.y * 2.0}
            x2={link.target.x * 2.0}
            y2={link.target.y * 2.0}
            strokeWidth={10}
            stroke={link.color || "black"} // Default to black if no color is assigned
            strokeOpacity={0.8}
            strokeDasharray={link.dashed ? "20,4" : undefined}
          />
        )}
      />
    </svg>
  );
}

export default MainGamePage;
