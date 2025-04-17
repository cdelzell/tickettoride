import { useState, useEffect } from "react";
import { monoMap } from "@/image_imports";


export type NetworkProps = {
  width: number;
  height: number;
};

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

function USMap({
  width,
  height,
  routes,
  cities,
  mainPlayer,
  hoveredRoute,
  setHoveredRoute,
  onRouteClaim,
}: {
  width: number;
  height: number;
  routes: Route[];
  cities: City[];
  mainPlayer: { username: string; profilePic: string };
  hoveredRoute: Route | null;
  setHoveredRoute: (route: Route | null) => void;
  onRouteClaim: (route: Route) => boolean;
}) {
  const MAP_WIDTH = 600;
  const MAP_HEIGHT = 400;
  const VERTICAL_OFFSET = 20;

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

  const handleRouteClaim = (route: Route) => {
    if (onRouteClaim(route)) {
      // need to connect o backend
    }
  };

  const getRouteTextPosition = (route: Route) => {
    const midX = (route.source.x + route.target.x) / 2;
    const midY = (route.source.y + route.target.y) / 2;
    return { x: midX, y: midY };
  };

  function lightenColor(color: string = "#000000", factor: number): string {
    if (!color.startsWith("#")) return color;
    const num = parseInt(color.slice(1), 16),
      r = Math.min(255, Math.floor(((num >> 16) & 0xff) * factor)),
      g = Math.min(255, Math.floor(((num >> 8) & 0xff) * factor)),
      b = Math.min(255, Math.floor((num & 0xff) * factor));
    return `rgb(${r}, ${g}, ${b})`;
  }

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
        y="20"
        width={MAP_WIDTH}
        height={MAP_HEIGHT}
        preserveAspectRatio="xMidYMid meet"
      />

      {/*  routes  */}
      {routes.map((route, index) => {
        const textPos = getRouteTextPosition(route);

        return (
          <g key={`route-${index}`}>
            <line
              x1={route.source.x}
              y1={route.source.y}
              x2={route.target.x}
              y2={route.target.y}
              strokeWidth={hoveredRoute === route ? 10 : 6} // Slightly larger stroke for outline effect
              stroke={
                hoveredRoute === route
                  ? lightenColor(route.color ?? "#000000", 1.5)
                  : "transparent"
              }
              strokeOpacity={hoveredRoute === route ? 1 : 0.8} // Full opacity for the outline
              strokeDasharray={
                route.claimer ? undefined : route.dashed ? "20,4" : undefined
              }
            />
            <line
              x1={route.source.x}
              y1={route.source.y}
              x2={route.target.x}
              y2={route.target.y}
              strokeWidth={6}
              stroke={route.color || "black"}
              strokeOpacity={hoveredRoute === route ? 0.6 : 0.8} // Slightly reduced opacity when hovered
              strokeDasharray={
                route.claimer ? undefined : route.dashed ? "20,4" : undefined
              }
              cursor="pointer"
              onMouseEnter={() => setHoveredRoute(route)}
              onMouseLeave={() => setHoveredRoute(null)}
              onClick={() => handleRouteClaim(route)}
            />

            {/* route text box */}
            {!route.claimer && (
              <g>
                <rect
                  x={textPos.x - 8}
                  y={textPos.y - 8}
                  width={15}
                  height={12}
                  fill="#FEF9DC"
                  stroke="RED"
                  strokeWidth={0.5}
                  rx={5}
                  ry={5}
                  opacity={0.9}
                  cursor="pointer"
                  onMouseEnter={() => setHoveredRoute(route)}
                  onMouseLeave={() => setHoveredRoute(null)}
                  onClick={() => handleRouteClaim(route)}
                />
                <text
                  x={textPos.x - 0.5}
                  y={textPos.y + 0.7}
                  fill="RED"
                  fontSize="7px"
                  textAnchor="middle"
                  cursor="pointer"
                  onMouseEnter={() => setHoveredRoute(route)}
                  onMouseLeave={() => setHoveredRoute(null)}
                  onClick={() => handleRouteClaim(route)}
                >
                  {route.trains}
                </text>
              </g>
            )}

            {/* claimed route change profile */}
            {route.claimer && (
              <g>
                {/* used clip path for circle image - hides image away from border */}
                <defs>
                  <clipPath id={`circle-clip-${index}`}>
                    <circle cx={textPos.x} cy={textPos.y} r={10} />
                  </clipPath>
                </defs>
                <image
                  x={textPos.x - 15}
                  y={textPos.y - 15}
                  width={30}
                  height={30}
                  href={mainPlayer.profilePic}
                  preserveAspectRatio="xMidYMid meet"
                  className="route-claimer-image"
                  clipPath={`url(#circle-clip-${index})`}
                />
                {/* added a border around image */}
                <circle
                  cx={textPos.x}
                  cy={textPos.y}
                  r={10}
                  fill="none"
                  stroke={route.color || "black"}
                  strokeWidth={1.23}
                />
              </g>
            )}
          </g>
        );
      })}

      {/*  city nodes  */}
      {cities.map((city, index) => {
        const textLength = city.name.length;
        const padding = 8;
        const calculatedWidth = textLength * 3 + padding;

        return (
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
              x={city.x - calculatedWidth / 2}
              y={city.y - 20}
              width={calculatedWidth}
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
              fontSize="6px"
              textAnchor="middle"
            >
              {city.name}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export default USMap;
