import { useEffect, useState } from "react";
import DrawTrains from "../DrawPile/DrawPile";
import "./ActionBox.css";
import GameRunner from "../../../backend/game-runner";
import DestinationCard from "../../../backend/destination-card";
import { DestinationCardInfo } from "../../main_game_page";
import leftArrow from "@/assets/arrows/left_arrow.png";

function ActionBox({
  action,
  gamerunner,
  drawnDestCards,
  updateStatus,
  drawDestActive,
  updateDrawDest,
  updateTrains,
  updateFaceUp,
  drawClickCount,
  setDrawClickCount,
  playClickCount,
  setPlayClickCount,
  destClickCount,
  setDestClickCount,
  handleDrawPileClick,
  setPlayerDestCards,
  formatDestCards,
}: {
  action: number;
  gamerunner: GameRunner;
  drawnDestCards: DestinationCard[];
  updateStatus: (newStatus: number) => void;
  drawDestActive: boolean;
  updateDrawDest: (newStatus: boolean) => void;
  updateTrains: (color: string, amount: number) => void;
  updateFaceUp: (active: boolean) => void;
  drawClickCount: number;
  setDrawClickCount: (num: number) => void;
  playClickCount: number;
  setPlayClickCount: (num: number) => void;
  destClickCount: number;
  setDestClickCount: (num: number) => void;
  handleDrawPileClick: () => void;
  setPlayerDestCards: (cards: DestinationCardInfo[]) => void;
  formatDestCards: (cards: DestinationCard[]) => {
    destination1: string;
    destination2: string;
    points: number;
    image_path: string;
  }[];
}) {
  const [goBack, setGoBack] = useState(false);
  const [actionActive, setActionActive] = useState(true);

  useEffect(() => {
    if (destClickCount > 0 || drawClickCount === 2 || playClickCount > 0) {
      setActionActive(false);
    }
  });

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
          updateTrains={updateTrains}
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

function PlayTrains() {
  return (
    <div className="claim_route">
      <p>Please claim a route on the board.</p>
    </div>
  );
}

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
    image_path: string;
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
