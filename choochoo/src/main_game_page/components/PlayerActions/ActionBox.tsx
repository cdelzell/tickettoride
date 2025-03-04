import { useEffect } from "react";
import DrawTrains from "../DrawPile/DrawPile";
import "./ActionBox.css";

function ActionBox({
  action,
  updateStatus,
  updateDrawDest,
}: {
  action: number;
  updateStatus: (newStatus: number) => void;
  updateDrawDest: (newStatus: boolean) => void;
}) {
  useEffect(() => {
    if (action === 3) {
      updateDrawDest(true);
    }
  }, [action, updateDrawDest]); // Runs only when `action` changes

  return (
    <div className="box">
      {action === 0 ? (
        <HomeBox updateStatus={updateStatus} />
      ) : action === 1 ? (
        <DrawTrains />
      ) : action === 2 ? (
        <PlayTrains />
      ) : action === 3 ? (
        <div />
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

export default ActionBox;
