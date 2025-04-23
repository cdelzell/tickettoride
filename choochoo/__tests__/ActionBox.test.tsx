import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import ActionBox from "../src/mainGamePage/components/PlayerActions/ActionBox";
import GameRunner from "../src/backend/gameRunner";

jest.mock("../src/main_game_page/components/DrawPile/DrawPile", () => {
  return function MockedDrawTrains(props: any) {
    return (
      <div data-testid="draw-trains">
        <button
          data-testid="draw-pile-button"
          onClick={props.handleDrawPileClick}
        >
          Draw Card
        </button>
      </div>
    );
  };
});

const mockGameRunner = {
  claimDestinationCards: jest.fn(),
  getPlayerDestinationCards: jest.fn().mockReturnValue([]),
} as unknown as GameRunner;

describe("ActionBox Component", () => {
  const defaultProps = {
    active: true,
    action: 0,
    gamerunner: mockGameRunner,
    drawnDestCards: [],
    updateStatus: jest.fn(),
    drawDestActive: false,
    updateDrawDest: jest.fn(),
    updateTrains: jest.fn(),
    updateFaceUp: jest.fn(),
    drawClickCount: 0,
    setDrawClickCount: jest.fn(),
    playClickCount: 0,
    setPlayClickCount: jest.fn(),
    destClickCount: 0,
    setDestClickCount: jest.fn(),
    handleDrawPileClick: jest.fn(),
    setPlayerDestCards: jest.fn(),
    formatDestCards: jest.fn().mockImplementation((cards) =>
      cards.map(() => ({
        destination1: "A",
        destination2: "B",
        points: 5,
        image_path: "some_path.png",
      }))
    ),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders home box initially when action is 0", () => {
    render(<ActionBox {...defaultProps} />);

    expect(screen.getByText("Draw Trains")).toBeInTheDocument();
    expect(screen.getByText("Play Trains")).toBeInTheDocument();
    expect(screen.getByText("Draw Destination")).toBeInTheDocument();
  });

  test('clicking "Draw Trains" button calls updateStatus with 1', () => {
    render(<ActionBox {...defaultProps} />);

    fireEvent.click(screen.getByText("Draw Trains"));
    expect(defaultProps.updateStatus).toHaveBeenCalledWith(1);
  });

  test('clicking "Play Trains" button calls updateStatus with 2', () => {
    render(<ActionBox {...defaultProps} />);

    fireEvent.click(screen.getByText("Play Trains"));
    expect(defaultProps.updateStatus).toHaveBeenCalledWith(2);
  });

  test('clicking "Draw Destination" button calls updateStatus with 3', () => {
    render(<ActionBox {...defaultProps} />);

    fireEvent.click(screen.getByText("Draw Destination"));
    expect(defaultProps.updateStatus).toHaveBeenCalledWith(3);
  });

  test("shows return button when action is not 0 and actionActive is true", () => {
    render(<ActionBox {...defaultProps} action={1} />);

    const backButton = screen.getByAltText("back arrow");
    expect(backButton).toBeInTheDocument();
  });

  test("clicking return button when in draw trains mode calls updateStatus with 0 and updateFaceUp with false", () => {
    render(<ActionBox {...defaultProps} action={1} />);

    const backButton = screen.getByAltText("back arrow");
    fireEvent.click(backButton);

    expect(defaultProps.updateStatus).toHaveBeenCalledWith(0);
    expect(defaultProps.updateFaceUp).toHaveBeenCalledWith(false);
  });

  test("renders PlayTrains component when action is 2", () => {
    render(<ActionBox {...defaultProps} action={2} />);

    expect(
      screen.getByText("Please claim a route on the board.")
    ).toBeInTheDocument();
  });

  test("renders DrawTrains component when action is 1", () => {
    render(<ActionBox {...defaultProps} action={1} />);

    expect(screen.getByTestId("draw-trains")).toBeInTheDocument();
  });

  test("renders Submit component when action is 3", () => {
    render(<ActionBox {...defaultProps} action={3} />);

    expect(
      screen.getByText("Submit Destination Card Choices")
    ).toBeInTheDocument();
  });

  test("clicking Submit button increments destClickCount when allowed", () => {
    render(<ActionBox {...defaultProps} action={3} />);

    fireEvent.click(screen.getByText("Submit Destination Card Choices"));

    expect(defaultProps.setDestClickCount).toHaveBeenCalledWith(1);
    expect(defaultProps.updateDrawDest).toHaveBeenCalledWith(false);
  });

  test("clicking Draw Card button in DrawTrains calls handleDrawPileClick", () => {
    render(<ActionBox {...defaultProps} action={1} />);

    const drawCardButton = screen.getByTestId("draw-pile-button");
    fireEvent.click(drawCardButton);

    expect(defaultProps.handleDrawPileClick).toHaveBeenCalled();
  });
});
