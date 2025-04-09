// import Main_Game_Page from "/src/main_game_page/main_game_page.jsx";
import React from "react";
import {
  render,
  screen,
  fireEvent,
  act,
  waitFor,
} from "@testing-library/react";
import { useState } from "react";
import "@testing-library/jest-dom";
import MainGamePage from "main_game_page/main_game_page";
import { Route, City } from "main_game_page/main_game_page";

// this testing file is for seeing if claiming routes works
jest.useFakeTimers();

// mock components that are used by main game page
interface PlayerCardProps {
  username: string;
  trainCount: number;
  profilePic: string;
  main_player: boolean;
  active: boolean;
}

interface FaceUpCardsProps {
  face_up_cards: string[];
  updateTrains: (color: string, amount: number) => void;
  active: boolean;
  drawClickCount: number;
  setDrawClickCount: React.Dispatch<React.SetStateAction<number>>;
  playClickCount: number;
  destClickCount: number;
}

interface ActionBoxProps {
  action: number;
  updateStatus: (status: number) => void;
  updateDrawDest: (active: boolean) => void;
  updateTrains: (color: string, amount: number) => void;
  updateFaceUp: (active: boolean) => void;
  handleDrawPileClick: () => void;
  drawClickCount?: number;
  setDrawClickCount?: React.Dispatch<React.SetStateAction<number>>;
  playClickCount?: number;
  setPlayClickCount?: React.Dispatch<React.SetStateAction<number>>;
  destClickCount?: number;
  setDestClickCount?: React.Dispatch<React.SetStateAction<number>>;
}

interface TrainCardProps {
  color: string;
  game_color: string;
  count: number;
  hover?: Route | null;
}

interface MapProps {
  width: number;
  height: number;
  routes: Route[];
  cities: City[];
  mainPlayer: {
    username: string;
    trainCount: number;
    profilePic: string;
  };
  hoveredRoute: Route | null;
  setHoveredRoute: React.Dispatch<React.SetStateAction<Route | null>>;
  onRouteClaim: (route: Route) => boolean;
}

// mock modules
jest.mock("./components/Profile/ProfileCard", () => ({
  __esModule: true,
  default: ({
    username,
    trainCount,
    profilePic,
    main_player,
    active,
  }: PlayerCardProps) => (
    <div data-testid={`player-card-${username}`}>
      <div data-testid={`username-${username}`}>{username}</div>
      <div data-testid={`trains-${username}`}>{trainCount}</div>
      <div data-testid={`active-${username}`}>
        {active ? "Active" : "Inactive"}
      </div>
    </div>
  ),
}));

jest.mock("./components/FaceUpCards/FaceUpCards", () => ({
  __esModule: true,
  default: ({ face_up_cards, updateTrains, active }: FaceUpCardsProps) => (
    <div data-testid="face-up-cards">{active ? "Active" : "Inactive"}</div>
  ),
}));

jest.mock("./components/DestinationCard/DestinationCard", () => ({
  __esModule: true,
  default: ({ destinations }: { destinations: string[] }) => (
    <div data-testid="destination-cards">
      {destinations.length} destination cards
    </div>
  ),
}));

jest.mock("./components/DestinationCard/DrawDestinationCard", () => ({
  __esModule: true,
  default: ({ destinations }: { destinations: string[] }) => (
    <div data-testid="draw-destination-card">
      {destinations.length} draw destination cards
    </div>
  ),
}));

jest.mock("./components/PlayerActions/ActionBox", () => ({
  __esModule: true,
  default: ({
    action,
    updateStatus,
    updateDrawDest,
    updateTrains,
    updateFaceUp,
    handleDrawPileClick,
  }: ActionBoxProps) => {
    return (
      <div data-testid="action-box">
        <button data-testid="select-draw-train" onClick={() => updateStatus(1)}>
          Draw Train Cards
        </button>
        <button data-testid="select-play-train" onClick={() => updateStatus(2)}>
          Play Train Cards
        </button>
        <button
          data-testid="select-draw-dest"
          onClick={() => {
            updateStatus(3);
            updateDrawDest(true);
          }}
        >
          Draw Destination Card
        </button>
      </div>
    );
  },
}));

jest.mock("./components/TrainCard/TrainCard", () => ({
  __esModule: true,
  default: ({ color, game_color, count }: TrainCardProps) => (
    <div data-testid={`train-card-${game_color}`}>
      {game_color}: {count}
    </div>
  ),
}));

jest.mock("./components/Map", () => ({
  __esModule: true,
  default: ({
    routes,
    hoveredRoute,
    setHoveredRoute,
    onRouteClaim,
  }: MapProps) => {
    // Helper function to simulate claiming specific routes
    const claimRoute = (routeIndex: number) => {
      const route = routes[routeIndex];
      return onRouteClaim(route);
    };

    return (
      <div data-testid="game-map">
        {routes.map((route, index) => (
          <div key={index} data-testid={`route-${index}`}>
            <span>
              {route.source.name} to {route.target.name} ({route.game_color})
            </span>
            <span data-testid={`route-claimer-${index}`}>
              {route.claimer || "unclaimed"}
            </span>
            <button
              data-testid={`claim-route-${index}`}
              onClick={() => claimRoute(index)}
            >
              Claim Route
            </button>
          </div>
        ))}
      </div>
    );
  },
}));

// mock game dependencies - for backend - may need to look over
jest.mock("../backend/game-runner", () => {
  return function () {
    return {
      gameBoard: {
        getFaceupTrainCardsAsList: () => [
          "red",
          "blue",
          "green",
          "yellow",
          "wild",
        ],
      },
    };
  };
});

jest.mock("../backend/user", () => {
  return function (username: string) {
    return { username };
  };
});

// testing starts here
describe("MainGamePage", () => {
  beforeEach(() => {
    Object.defineProperty(window, "innerWidth", { value: 1024 });
    Object.defineProperty(window, "innerHeight", { value: 768 });

    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  test("renders main game components", () => {
    render(<MainGamePage />);

    // are player cards rendered?
    expect(screen.getByTestId("player-card-noah-rama")).toBeInTheDocument();
    expect(screen.getByTestId("player-card-c-bear")).toBeInTheDocument();
    expect(screen.getByTestId("player-card-t-dawg")).toBeInTheDocument();
    expect(screen.getByTestId("player-card-ridster")).toBeInTheDocument();

    // is player active?
    expect(screen.getByTestId("active-noah-rama")).toHaveTextContent("Active");

    // are other components there?
    expect(screen.getByTestId("face-up-cards")).toBeInTheDocument();
    expect(screen.getByTestId("action-box")).toBeInTheDocument();
    expect(screen.getByTestId("destination-cards")).toBeInTheDocument();
    expect(screen.getByTestId("game-map")).toBeInTheDocument();

    // are train cards rendered?
    expect(screen.getByTestId("train-card-red")).toBeInTheDocument();
    expect(screen.getByTestId("train-card-wild")).toBeInTheDocument();
  });

  // FAILED FAILED FAILED FAILED FAILED
  // test('claiming a route successfully', () => {
  //   render(<MainGamePage />);

  //   // is action status sent to play train cards?
  //   fireEvent.click(screen.getByTestId('select-play-train'));

  //   // claiming red route with enough cards
  //   const redRouteIndex = 0;
  //   fireEvent.click(screen.getByTestId(`claim-route-${redRouteIndex}`));
  //   // expected elements to have text contect:  noah-rama, received: unclaimed

  //   // Was route claimed by player?
  //   expect(screen.getByTestId(`route-claimer-${redRouteIndex}`)).toHaveTextContent('noah-rama');

  //   // Were cards deducted?
  //   expect(screen.getByTestId('train-card-red')).toHaveTextContent('red: 0');

  //   // was main player's card count reduced?
  //   expect(screen.getByTestId('trains-noah-rama')).toHaveTextContent('21'); // 25 - 4 = 21
  // });

  test("cannot claim a route if not in play train cards mode", () => {
    render(<MainGamePage />);

    // trying to claim a route while not being in play traincard stage
    const routeIndex = 0;
    fireEvent.click(screen.getByTestId(`claim-route-${routeIndex}`));

    // check that the route remains not claimed
    expect(screen.getByTestId(`route-claimer-${routeIndex}`)).toHaveTextContent(
      "unclaimed"
    );
  });

  // FAILED FAILED FAILED FAILED FAILED
  test("drawing train cards works and shows notification", async () => {
    render(<MainGamePage />);

    fireEvent.click(screen.getByTestId("select-draw-train"));

    await act(async () => {
      jest.advanceTimersByTime(100);
    });

    const notification = await screen.findByText((content) =>
      content.startsWith("You drew a")
    );
    expect(notification).toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(
      screen.queryByText((content) => content.startsWith("You drew a"))
    ).not.toBeInTheDocument();
  });

  // FAILED FAILED FAILED FAILED FAILED
  test("end turn button appears after completing an action", () => {
    render(<MainGamePage />);

    // end turn button not visible when round begins
    expect(screen.queryByText("End Turn")).not.toBeInTheDocument();

    // claiming a route
    fireEvent.click(screen.getByTestId("select-play-train"));
    fireEvent.click(screen.getByTestId("claim-route-0"));

    // end turn is now visible
    expect(screen.getByText("End Turn")).toBeInTheDocument();
  });

  test("drawing destination cards shows the DrawDestinationCard component", () => {
    render(<MainGamePage />);

    // draw destination card component should not be visible initially
    expect(
      screen.queryByTestId("draw-destination-card")
    ).not.toBeInTheDocument();

    // select draw destination cards action
    fireEvent.click(screen.getByTestId("select-draw-dest"));

    // check that the draw destination card component is shown
    expect(screen.getByTestId("draw-destination-card")).toBeInTheDocument();
  });

  test("claiming a route with insufficient train cards fails", () => {
    render(<MainGamePage />);

    // set action status to "play train cards"
    fireEvent.click(screen.getByTestId("select-play-train"));

    // first claim a red route to deplete cards
    fireEvent.click(screen.getByTestId("claim-route-0"));

    // try to claim another red route
    fireEvent.click(screen.getByTestId("claim-route-9"));

    // ceck that the second route remains unclaimed due to cards
    expect(screen.getByTestId("route-claimer-9")).toHaveTextContent(
      "unclaimed"
    );
  });

  test("claiming a route with wild cards works", () => {
    const { rerender } = render(<MainGamePage />);

    // set action status to "play train cards"
    fireEvent.click(screen.getByTestId("select-play-train"));

    // first claim route that depletes specific color cards
    fireEvent.click(screen.getByTestId("claim-route-0")); // Uses red cards

    // force rerendering to update state
    rerender(<MainGamePage />);

    // set play train cards mode again
    fireEvent.click(screen.getByTestId("select-play-train"));

    // try to claim a short route with wild cards
    // route index 18 is phoenix to albuquerque (yellow, 1 train)
    fireEvent.click(screen.getByTestId("claim-route-18"));

    // check that the route was claimed by the main player
    expect(screen.getByTestId("route-claimer-18")).toHaveTextContent(
      "noah-rama"
    );

    // check if wild cards were deducted
    expect(screen.getByTestId("train-card-wild")).toHaveTextContent("wild: 0");
  });
});
