import { useEffect, useState } from "react";
import DrawTrains from "../DrawPile/DrawPile";
import "./ActionBox.css";

function ActionBox({
  action,
  updateStatus,
  updateDrawDest,
  updateTrains,
  updateFaceUp,
  drawClickCount,
  setDrawClickCount,
  playClickCount,
  setPlayClickCount,
  destClickCount,
  setDestClickCount,
}: {
  action: number;
  updateStatus: (newStatus: number) => void;
  updateDrawDest: (newStatus: boolean) => void;
  updateTrains: (color: string, amount: number) => void;
  updateFaceUp: (active: boolean) => void;
  drawClickCount: number;
  setDrawClickCount: (num: number) => void;
  playClickCount: number;
  setPlayClickCount: (num: number) => void;
  destClickCount: number;
  setDestClickCount: (num: number) => void;
}) {
  const [goBack, setGoBack] = useState(false);
  const [actionActive, setActionActive] = useState(true);

  useEffect(() => {
    if (destClickCount > 0 || drawClickCount == 2 || playClickCount > 0) {
      setActionActive(false);
    }
  });

  useEffect(() => {
    if (action === 0) {
      setGoBack(false);
    } else if (action === 1) {
      setGoBack(true);
      updateFaceUp(true);
    } else if (action === 2) {
      setGoBack(true);
    } else if (action === 3) {
      setGoBack(true);
      updateDrawDest(true);
    }
  }, [action, updateDrawDest]); // Runs only when `action` changes

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
      {goBack && actionActive == true ? (
        <button onClick={handleReturn} className="return">
          <img src="./src/assets/arrows/left_arrow.png"></img>
        </button>
      ) : (
        <></>
      )}
      {action === 0 && actionActive == true ? (
        <HomeBox updateStatus={updateStatus} />
      ) : action === 1 && actionActive == true ? (
        <DrawTrains
          updateTrains={updateTrains}
          drawClickCount={drawClickCount}
          setDrawClickCount={setDrawClickCount}
          playClickCount={playClickCount}
          destClickCount={destClickCount}
        />
      ) : action === 2 && actionActive == true ? (
        <PlayTrains />
      ) : action === 3 && actionActive == true ? (
        <Submit
          drawClickCount={drawClickCount}
          setDestClickCount={setDestClickCount}
          playClickCount={playClickCount}
          destClickCount={destClickCount}
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
  drawClickCount,
  playClickCount,
  destClickCount,
  setDestClickCount,
}: {
  drawClickCount: number;
  playClickCount: number;
  destClickCount: number;
  setDestClickCount: (num: number) => void;
}) {
  const handleClick = () => {
    if (drawClickCount == 0 && playClickCount == 0 && destClickCount == 0) {
      setDestClickCount(destClickCount + 1);
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
        Your turn is over. Please click the "End Turn" button to end your turn.
      </p>
    </div>
  );
}

export default ActionBox;
