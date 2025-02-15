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
  { name: "New York", x: 350, y: 250, color: "#cf4c34" },
  { name: "Chicago", x: 500, y: 200, color: "#cf4c34" },
  { name: "Denver", x: 140, y: 120, color: "#cf4c34" },
  { name: "Los Angeles", x: 120, y: 150, color: "#cf4c34" },
  { name: "Tyville", x: 120, y: 160, color: "#cf4c34" },
  { name: "Clara City", x: 120, y: 170, color: "#cf4c34" },
  { name: "Los Noah", x: 120, y: 180, color: "#cf4c34" },
  { name: "Riddhi Rapids", x: 120, y: 190, color: "#cf4c34" },
];

const routes: Route[] = [
  { source: cities[0], target: cities[1] },
  { source: cities[1], target: cities[2] },
  { source: cities[2], target: cities[3] },
];

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
    <svg width={width} height={height}>
      {/* Background map */}
      <image
        href={monoMap}
        width="100%"
        height="100%"
        preserveAspectRatio="none"
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
              fill={node.color || "white"}
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
            stroke="red"
            strokeOpacity={0.7}
            strokeDasharray={link.dashed ? "6,3" : undefined}
          />
        )}
      />
    </svg>
  );
}

export default MainGamePage;
