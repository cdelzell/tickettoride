import { useEffect, useState } from "react";
import DrawTrains from "../DrawPile/DrawPile";
import "./ActionBox.css";
import GameRunner from "../../../backend/gameRunner";
import DestinationCard from "../../../backend/destinationCard";
import { DestinationCardInfo } from "../../mainGamePage";
import { leftArrow } from "@/imageImports";

/*
  Creates the action box and renders the correct display depending on the action and state of the user.

  5 possible states:
    * not the player's turn
    * player wants to draw cards
    * player wants to claim a route
    * player wants to draw destination cards
    * player's turn is over, but they have not clicked "end turn"
  
  Also correctly handles when a player has played out their turn, properly disables/enables player's action box 
*/
function ActionBox({
  active,
  action,
  gamerunner,
  drawnDestCards,
  updateStatus,
  updateDrawDest,
  updateTrains,
  updateFaceUp,
  drawClickCount,
  setDrawClickCount,
  playClickCount,
  destClickCount,
  setDestClickCount,
  handleDrawPileClick,
  setPlayerDestCards,
  formatDestCards,
}: {
  active: boolean;
  action: number;
  gamerunner: GameRunner;
  drawnDestCards: DestinationCard[];
  updateStatus: (newStatus: number) => void;
  updateDrawDest: (newStatus: boolean) => void;
  updateTrains: (color: string, amount: number) => void;
  updateFaceUp: (active: boolean) => void;
  drawClickCount: number;
  setDrawClickCount: (num: number) => void;
  playClickCount: number;
  destClickCount: number;
  setDestClickCount: (num: number) => void;
  handleDrawPileClick: () => void;
  setPlayerDestCards: (cards: DestinationCardInfo[]) => void;
  formatDestCards: (cards: DestinationCard[]) => {
    destination1: string;
    destination2: string;
    points: number;
    imagePath: string;
  }[];
}) {
  const [goBack, setGoBack] = useState(false);
  const [actionActive, setActionActive] = useState(true);

  useEffect(() => {
    if (destClickCount > 0 || drawClickCount >= 2 || playClickCount > 0) {
      setActionActive(false);
    } else if (active && action === 0) {
      setActionActive(true);
    }
  }, [destClickCount, drawClickCount, playClickCount, active, action]);

  useEffect(() => {
    if (action === 0) {
      setGoBack(false);
    } else if (action === 1 && drawClickCount > 0) {
      setGoBack(false);
      updateFaceUp(true);
    } else if (action === 1) {
      setGoBack(true);
      updateFaceUp(true);
    } else if (action === 2) {
      setGoBack(true);
    } else if (action === 3 && destClickCount === 0) {
      setGoBack(true);
      updateDrawDest(true);
    }
  }, [action, updateDrawDest, updateFaceUp]);

  const handleReturn = () => {
    if (action === 3) {
      updateDrawDest(false);
    } else if (action === 1) {
      updateFaceUp(false);
    }
    updateStatus(0);
  };

  if (!active) {
    return <div className="box">Not your turn!</div>;
  }

  return (
    <div className="box">
      {goBack && actionActive === true ? (
        <button onClick={handleReturn} className="return">
          <img src={leftArrow} alt="back arrow" />
        </button>
      ) : null}

      {action === 0 && actionActive === true ? (
        <HomeBox updateStatus={updateStatus} />
      ) : action === 1 && actionActive === true ? (
        <DrawTrains
          drawClickCount={drawClickCount}
          setDrawClickCount={setDrawClickCount}
          playClickCount={playClickCount}
          destClickCount={destClickCount}
          handleDrawPileClick={handleDrawPileClick}
        />
      ) : action === 2 && actionActive === true ? (
        <PlayTrains />
      ) : action === 3 && actionActive === true ? (
        <Submit
          gamerunner={gamerunner}
          drawnDestCards={drawnDestCards}
          updateDrawDest={updateDrawDest}
          drawClickCount={drawClickCount}
          setDestClickCount={setDestClickCount}
          playClickCount={playClickCount}
          destClickCount={destClickCount}
          setPlayerDestCards={setPlayerDestCards}
          formatDestCards={formatDestCards}
        />
      ) : (
        <TurnOver />
      )}
    </div>
  );
}

/*
  Display for action box when it is a player's turn and they get to choose what they would like to do
*/
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

/*
  Display for a player when they would like to claim a route
*/
function PlayTrains() {
  return (
    <div className="claim_route">
      <p>Please claim a route on the board.</p>
    </div>
  );
}

/*
  Display for a player when they would like to claim destination cards
*/
function Submit({
  gamerunner,
  drawnDestCards,
  updateDrawDest,
  drawClickCount,
  playClickCount,
  destClickCount,
  setDestClickCount,
  setPlayerDestCards,
  formatDestCards,
}: {
  gamerunner: GameRunner;
  drawnDestCards: DestinationCard[];
  updateDrawDest: (state: boolean) => void;
  drawClickCount: number;
  playClickCount: number;
  destClickCount: number;
  setDestClickCount: (num: number) => void;
  setPlayerDestCards: (cards: DestinationCardInfo[]) => void;
  formatDestCards: (cards: DestinationCard[]) => {
    destination1: string;
    destination2: string;
    points: number;
    imagePath: string;
  }[];
}) {
  const handleClick = () => {
    if (drawClickCount === 0 && playClickCount === 0 && destClickCount === 0) {
      updateDrawDest(false);
      setDestClickCount(destClickCount + 1);
      gamerunner.claimDestinationCards(drawnDestCards);

      setPlayerDestCards(
        formatDestCards(gamerunner.getPlayerDestinationCards())
      );
    }
  };

  return (
    <button className="submit" onClick={handleClick}>
      Submit Destination Card Choices
    </button>
  );
}

/*
  Display for when a player's turn is over, but they have not clicked the "end turn" button yet
*/
function TurnOver() {
  return (
    <div className="claim_route">
      <p>
        Your turn is over. Click the "End Turn" button to go to the next player.
      </p>
    </div>
  );
}

export default ActionBox;
