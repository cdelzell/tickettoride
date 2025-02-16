import React from "react";
import { Graph } from "@visx/network";
import monoMap from "../assets/mono_map.jpg";
import "./main_game_page.css";

// this works with typescript so hand to change file

// let's go airbnb
export type NetworkProps = {
  width: number;
  height: number;
};

const players = [
  {
    username: "c-bear",
    trainCount: 1700,
    profilePic: "https://via.placeholder.com/40",
  },
  {
    username: "t-dawg",
    trainCount: 0,
    profilePic: "https://via.placeholder.com/40",
  },
  {
    username: "ridster",
    trainCount: 2,
    profilePic: "https://via.placeholder.com/40",
  },
];

const main_player = {
  username: "noah-rama",
  trainCount: 2,
  profilePic: "https://via.placeholder.com/40",
};

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
}

const cities: City[] = [
  { name: "New York", x: 415, y: 109, color: "#cf4c34" }, // 0
  { name: "Chicago", x: 330, y: 100, color: "#cf4c34" }, // 1
  { name: "Denver", x: 220, y: 120, color: "#cf4c34" }, // 2
  { name: "Los Angeles", x: 120, y: 160, color: "#cf4c34" }, // 3
  { name: "Tyville", x: 180, y: 80, color: "#cf4c34" }, // 4
  { name: "Clara City", x: 270, y: 70, color: "#cf4c34" }, // 5
  { name: "Palo Noah", x: 375, y: 180, color: "#cf4c34" }, // 6
  { name: "Riddhi Rapids", x: 100, y: 75, color: "#cf4c34" }, // 7
  { name: "Firestone Rouge", x: 250, y: 190, color: "#cf4c34" }, // 8
];

const routes: Route[] = [
  { source: cities[0], target: cities[1], dashed: true },
  { source: cities[1], target: cities[6], dashed: true },
  { source: cities[1], target: cities[5], dashed: true },
  { source: cities[0], target: cities[6], dashed: true },
  { source: cities[1], target: cities[8], dashed: true },
  { source: cities[5], target: cities[8], dashed: true },
  { source: cities[7], target: cities[3], dashed: true }, // riddhi rapids to LA
  { source: cities[7], target: cities[4], dashed: true }, // riddhi rapids to tyville
  { source: cities[4], target: cities[5], dashed: true }, // ty ville to clara city
  { source: cities[2], target: cities[5], dashed: true }, // denver to clara city
  { source: cities[3], target: cities[2], dashed: true }, // LA to denver
  { source: cities[4], target: cities[2], dashed: true }, // tyville to denver
  { source: cities[3], target: cities[8], dashed: true }, // LA to firestone rouge
  { source: cities[2], target: cities[8], dashed: true }, // denver to firestone rouge
  { source: cities[6], target: cities[8], dashed: true }, // palo noah to firestone rouge
];

export const background = "#d3d3d3";

const graph = {
  nodes: cities,
  links: routes,
};

const MainGamePage = () => {
  const width = window.innerWidth;
  const height = window.innerHeight;

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
          />
        ))}
      </div>

      {/* main player */}
      <div className="main-player-card">
        <PlayerCard
          username={main_player.username}
          trainCount={main_player.trainCount}
          profilePic={main_player.profilePic}
        />
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
}: {
  username: string;
  trainCount: number;
  profilePic: string;
}) {
  return (
    <div className="player-card">
      <img className="profile-pic" src={profilePic} alt="Profile" />
      <div className="player-info">
        <span className="username">{username}</span>
        <span className="train-count">{trainCount} Trains</span>
      </div>
    </div>
  );
}

function USMap({ width, height }: NetworkProps) {
  return width < 10 ? null : (
    <svg width={width * 0.7} height={height * 0.7}>
      {/* background map */}
      <image
        href={monoMap}
        x="0%"
        y="0%"
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
            <circle cx={node.x} cy={node.y} r={8} fill={node.color || "pink"} />
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
            x1={link.source.x * 2}
            y1={link.source.y * 2}
            x2={link.target.x * 2}
            y2={link.target.y * 2}
            strokeWidth={9}
            stroke="black"
            strokeOpacity={0.5}
            strokeDasharray={link.dashed ? "12,6" : undefined}
          />
        )}
      />
    </svg>
  );
}

export default MainGamePage;
