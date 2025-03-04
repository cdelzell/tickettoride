import { useState, useEffect } from "react";
import monoMap from "../../assets/mono_map.jpg";

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
  color?: string;
}

function USMap({
  width,
  height,
  routes,
  cities,
}: {
  width: number;
  height: number;
  routes: Route[];
  cities: City[];
}) {
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

export default USMap;
