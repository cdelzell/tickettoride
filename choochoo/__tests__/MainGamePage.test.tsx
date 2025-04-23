import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import MainGamePage from "../src/mainGamePage/mainGamePage";
import { useLocation, useNavigate } from "react-router-dom";
import GameRunner from "../src/backend/gameRunner";
import Player from "../src/backend/player";
import TrainRoute from "../src/backend/trainRoute";
import DestinationCard from "../src/backend/destinationCard";

// react router dom routes for useLocation and useNavigate
jest.mock("react-router-dom", () => ({
  useLocation: jest.fn(),
  useNavigate: jest.fn(),
}));

// mock game runner class
jest.mock("../src/backend/game-runner", () => {
  return jest.fn().mockImplementation(() => ({
    startListeningForUpdates: jest.fn((callback) =>
      callback(mockGameRunnerInstance)
    ),
    getPlayers: jest.fn(() => mockPlayers),
    getCurrentPlayer: jest.fn(() => 0),
    getDestinationCardPossibilities: jest.fn(() => mockDestinationCards),
    getPlayerDestinationCards: jest.fn(() => mockPlayerDestinationCards),
    getMainPlayerTrainCards: jest.fn(() => mockTrainCounts),
    getMainPlayerTrainCount: jest.fn(() => 45),
    getOtherPlayerTrainCards: jest.fn(() => mockTrainCounts),
    gameBoard: {
      boardGraph: {
        routes: mockRoutes,
      },
      getFaceupTrainCardsAsList: jest.fn(() => mockFaceUpCards),
    },
    claimRoute: jest.fn(() => true),
    checkGameOverAfterRouteClaim: jest.fn(() => false),
    drawTrainCardsFromDeck: jest.fn(),
    updateCurrentPlayer: jest.fn(),
    sendToDatabase: jest.fn(),
    claimDestinationCards: jest.fn(),
  }));
});

// types defined for props
interface ProfileCardProps {
  username: string;
  trainCount: number;
  profilePic?: string;
  main_player?: boolean;
  active?: boolean;
}

interface FaceUpCardsProps {
  gamerunner?: any;
  face_up_cards?: any[];
  updateTrains?: (cards: number[]) => void;
  active?: boolean;
  drawClickCount: number;
  setDrawClickCount: (count: number) => void;
  playClickCount: number;
  destClickCount: number;
}

interface MapProps {
  width: number;
  height: number;
  routes: any[];
  cities: any[];
  mainPlayer: {
    username: string;
    profilePic: string;
  };
  hoveredRoute: any | null;
  setHoveredRoute: (route: any | null) => void;
  onRouteClaim: (route: any) => void;
}

interface ActionBoxProps {
  active: boolean;
  action: number;
  gamerunner: any;
  drawnDestCards: any[];
  updateStatus: (status: number) => void;
  drawDestActive: boolean;
  updateDrawDest: (active: boolean) => void;
  updateTrains: (color: string, amount: number) => void;
  updateFaceUp: (active: boolean) => void;
  drawClickCount: number;
  setDrawClickCount: (count: number) => void;
  playClickCount: number;
  setPlayClickCount: (count: number) => void;
  destClickCount: number;
  setDestClickCount: (count: number) => void;
  handleDrawPileClick: () => void;
  setPlayerDestCards: (cards: any[]) => void;
  formatDestCards: (cards: any[]) => any[];
}

interface TrainCardProps {
  color: string;
  game_color: string;
  count: number;
  hover?: any;
}

// mock child components for profile card
jest.mock("../src/main_game_page/components/Profile/ProfileCard", () => {
  return function MockProfileCard(props: ProfileCardProps) {
    return (
      <div
        data-testid={`profile-card-${props.username}`}
        data-active={props.active}
      >
        {props.username} {props.trainCount} trains
      </div>
    );
  };
});

// face up cards
jest.mock("../src/main_game_page/components/FaceUpCards/FaceUpCards", () => {
  return function MockFaceUpCards(props: FaceUpCardsProps) {
    return <div data-testid="face-up-cards">Face Up Cards</div>;
  };
});

// mock with destination cards
jest.mock(
  "../src/main_game_page/components/DestinationCard/DestinationCard",
  () => {
    // all the components for DestinationCard
    const DestinationCard = ({
      destination,
      location,
    }: {
      destination: string;
      location: string;
    }) => {
      return (
        <img
          data-testid={`destination-card-${destination}`}
          alt={destination}
        />
      );
    };

    // mocking the carousel
    const DestinationCardsCarousel = ({
      destinations,
    }: {
      destinations: DestinationCardInfo[];
    }) => {
      return (
        <div data-testid="destination-cards-carousel">Destination Cards</div>
      );
    };

    DestinationCardsCarousel.DestinationCard = DestinationCard;

    // return exports
    return {
      __esModule: true,
      default: DestinationCardsCarousel,
      DestinationCard,
    };
  }
);

// mock draw destination card
jest.mock(
  "../src/main_game_page/components/DestinationCard/DrawDestinationCard",
  () => {
    interface DestinationCardInfo {
      destination1: string;
      destination2: string;
      points: number;
      image_path: string;
    }

    return function MockDrawDestinationCard(props: {
      destinations: DestinationCardInfo[];
      drawnDestCards: any[];
      setDrawDestCard: (cards: any[]) => void;
    }) {
      return (
        <div data-testid="draw-destination-card">
          <button
            data-testid="select-dest-card"
            onClick={() =>
              props.setDrawDestCard([
                {
                  destination1: "New York",
                  destination2: "Los Angeles",
                  points: 20,
                  getDestinationsAsArray: () => ["New York", "Los Angeles"],
                },
              ])
            }
          >
            Select Card
          </button>
        </div>
      );
    };
  }
);

// destination card props for interface
interface DestinationCardInfo {
  destination1: string;
  destination2: string;
  points: number;
  image_path: string;
}
jest.mock("../src/main_game_page/components/Map", () => {
  return function MockMap(props: MapProps) {
    return (
      <div data-testid="game-map">
        <button
          data-testid="claim-route-btn"
          onClick={() => props.onRouteClaim(mockRoutes[0])}
        >
          Claim Route
        </button>
      </div>
    );
  };
});

// mocking action box
jest.mock("../src/main_game_page/components/PlayerActions/ActionBox", () => {
  return function MockActionBox(props: ActionBoxProps) {
    return (
      <div data-testid="action-box" data-action={props.action}>
        <button
          data-testid="update-status-1"
          onClick={() => props.updateStatus(1)}
        >
          Draw Trains
        </button>
        <button
          data-testid="update-status-2"
          onClick={() => props.updateStatus(2)}
        >
          Play Trains
        </button>
        <button
          data-testid="update-status-3"
          onClick={() => props.updateStatus(3)}
        >
          Draw Destination
        </button>
        <button
          data-testid="draw-pile-click"
          onClick={props.handleDrawPileClick}
        >
          Draw Card
        </button>
        <button
          data-testid="toggle-dest-active"
          onClick={() => props.updateDrawDest(true)}
        >
          Toggle Dest Active
        </button>
      </div>
    );
  };
});

// mocking train cards
jest.mock("../src/main_game_page/components/TrainCard/TrainCard", () => {
  return function MockTrainCard(props: TrainCardProps) {
    return (
      <div
        data-testid={`train-card-${props.game_color}`}
        data-count={props.count}
      >
        {props.game_color}
      </div>
    );
  };
});

// mock player & destination data
const mockPlayers = [
  {
    id: "0",
    username: "testUser",
    trainAmount: 45,
    profile_picture: "profile.jpg",
  },
  { id: "1", username: "player2", trainAmount: 40 },
];

const mockDestinationCards = [
  { destination1: "New York", destination2: "Los Angeles", points: 20 },
  { destination1: "Seattle", destination2: "Miami", points: 25 },
];

const mockPlayerDestinationCards = [
  { destination1: "Chicago", destination2: "Boston", points: 15 },
];

const mockTrainCounts = [3, 2, 1, 4, 0, 2, 3, 1, 2]; // this is the train counts

// two mock routes for testing
const mockRoutes = [
  {
    destination1: "New York",
    destination2: "Boston",
    dashed: false,
    length: 3,
    gameColor: "blue",
    hexColor: "#0000FF",
    claimer: null,
    claimerProfilePic: null,
  },
  {
    destination1: "Chicago",
    destination2: "Denver",
    dashed: false,
    length: 4,
    gameColor: "red",
    hexColor: "#FF0000",
    claimer: null,
    claimerProfilePic: null,
  },
];

const mockFaceUpCards = ["red", "blue", "green", "yellow", "wild"];

//new mock game runner with a lobby code
const mockGameRunnerInstance = new GameRunner([], 123123);

describe("MainGamePage Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // setting up location mock with session storage
    (useLocation as jest.Mock).mockReturnValue({
      state: {
        players: [
          {
            username: "testUser",
            wins: 5,
            total_score: 100,
            profile_picture: "profile.jpg",
          },
          {
            username: "player2",
            wins: 3,
            total_score: 80,
            profile_picture: "default.jpg",
          },
        ],
        lobbyCode: "123123",
        userProfile: {
          username: "testUser",
          wins: 5,
          total_score: 100,
          profile_picture: "profile.jpg",
        },
      },
    });

    (useNavigate as jest.Mock).mockReturnValue(jest.fn());
  });

  // test 1: renders the main game page with all components
  test("renders the main game page with all components", () => {
    render(<MainGamePage />);

    // check if main components are on the main game page
    expect(screen.getByTestId("action-box")).toBeInTheDocument();
    expect(
      screen.getByTestId("destination-cards-carousel")
    ).toBeInTheDocument();
    expect(screen.getByTestId("game-map")).toBeInTheDocument();

    // check if player cards are there
    expect(screen.getByTestId("profile-card-player2")).toBeInTheDocument();
    expect(screen.getByTestId("profile-card-testUser")).toBeInTheDocument();

    // check if train cards are there
    expect(screen.getByTestId("face-up-cards")).toBeInTheDocument();
  });

  test("updates action box status when buttons are clicked", () => {
    render(<MainGamePage />);

    // test changing action status
    const drawTrainsBtn = screen.getByTestId("update-status-1");
    fireEvent.click(drawTrainsBtn);

    // check that action box status was updated
    expect(screen.getByTestId("action-box")).toHaveAttribute(
      "data-action",
      "1"
    );
  });

  test("handles drawing train cards", async () => {
    render(<MainGamePage />);

    // draw trains button
    const drawTrainsBtn = screen.getByTestId("update-status-1");
    fireEvent.click(drawTrainsBtn);

    // draw cards button
    const drawCardBtn = screen.getByTestId("draw-pile-click");
    fireEvent.click(drawCardBtn);

    expect(mockGameRunnerInstance.drawTrainCardsFromDeck).toHaveBeenCalled();
  });

  test("handles claiming a route", () => {
    render(<MainGamePage />);

    // action is to claim routes
    const playTrainsBtn = screen.getByTestId("update-status-2");
    fireEvent.click(playTrainsBtn);

    // claim a route
    const claimRouteBtn = screen.getByTestId("claim-route-btn");
    fireEvent.click(claimRouteBtn);

    // was game runner called
    expect(mockGameRunnerInstance.claimRoute).toHaveBeenCalled();

    // end turn button appears
    const endTurnBtn = screen.getByText("End Turn");
    expect(endTurnBtn).toBeInTheDocument();
  });

  test("displays draw destination cards when active", () => {
    render(<MainGamePage />);

    // desintation cards displayed when active player
    const toggleDestBtn = screen.getByTestId("toggle-dest-active");
    fireEvent.click(toggleDestBtn);

    // check that draw destination card component appears
    expect(screen.getByTestId("draw-destination-card")).toBeInTheDocument();
  });

  test("handles end turn functionality", () => {
    render(<MainGamePage />);

    // set action to play trains and claim a route to make turn complete
    const playTrainsBtn = screen.getByTestId("update-status-2");
    fireEvent.click(playTrainsBtn);

    const claimRouteBtn = screen.getByTestId("claim-route-btn");
    fireEvent.click(claimRouteBtn);

    // end turn
    const endTurnBtn = screen.getByText("End Turn");
    fireEvent.click(endTurnBtn);

    // check that GameRunner methods were called
    expect(mockGameRunnerInstance.updateCurrentPlayer).toHaveBeenCalled();
    expect(mockGameRunnerInstance.sendToDatabase).toHaveBeenCalled();
  });
});
