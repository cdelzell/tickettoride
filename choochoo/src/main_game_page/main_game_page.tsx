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
  { name: "New York", x: 415, y: 109, color: "#cf4c34" },
  { name: "Chicago", x: 330, y: 100, color: "#cf4c34" },
  { name: "Denver", x: 220, y: 120, color: "#cf4c34" },
  { name: "Los Angeles", x: 120, y: 160, color: "#cf4c34" },
  { name: "Tyville", x: 180, y: 80, color: "#cf4c34" },
  { name: "Clara City", x: 270, y: 70, color: "#cf4c34" },
  { name: "Palo Noah", x: 375, y: 180, color: "#cf4c34" },
  { name: "Riddhi Rapids", x: 100, y: 75, color: "#cf4c34" },
  { name: "Firestone Rouge", x: 250, y: 190, color: "#cf4c34" },
];

const routes: Route[] = [];

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
      <USMap width={width} height={height} />
    </main>
  );
};

function USMap({ width, height }: NetworkProps) {
  return width < 10 ? null : (
    <svg width={width * 0.7} height={height * 0.7}>
      {/* Background map */}
      <image
        href={monoMap}
        x="0%"
        y="0%"
        width="100%"
        height="100%"
        preserveAspectRatio="xMidYMid meet"
      />

      {/* Graph of cities and routes */}
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
              fill={node.color || "pink"}
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
            x1={link.source.x}
            y1={link.source.y}
            x2={link.target.x}
            y2={link.target.y}
            strokeWidth={3}
            stroke="black"
            strokeOpacity={0.7}
            strokeDasharray={link.dashed ? "6,3" : undefined}
          />
        )}
      />
    </svg>
  );
}

export default MainGamePage;
