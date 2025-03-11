import { useEffect, useState } from "react";
import DrawTrains from "../DrawPile/DrawPile";
import "./ActionBox.css";

function ActionBox({
  action,
  updateStatus,
  updateDrawDest,
  updateTrains,
  updateFaceUp,
}: {
  action: number;
  updateStatus: (newStatus: number) => void;
  updateDrawDest: (newStatus: boolean) => void;
  updateTrains: (color: string, amount: number) => void;
  updateFaceUp: (active: boolean) => void;
}) {
  const [goBack, setGoBack] = useState(false);

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
      {goBack ? (
        <button onClick={handleReturn} className="return">
          <img src="./src/assets/arrows/left_arrow.png"></img>
        </button>
      ) : (
        <></>
      )}
      {action === 0 ? (
        <HomeBox updateStatus={updateStatus} />
      ) : action === 1 ? (
        <DrawTrains updateTrains={updateTrains} />
      ) : action === 2 ? (
        <PlayTrains />
      ) : action === 3 ? (
        <Submit />
      ) : (
        <div />
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

function Submit() {
  return <button className="submit">Submit Destination Card Choices</button>;
}

export default ActionBox;
