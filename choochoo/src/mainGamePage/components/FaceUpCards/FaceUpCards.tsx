import GameRunner from "../../../backend/gameRunner";
import FaceUpCard from "./FaceUpCard";
import "./FaceUpCards.css";

/*
  Component to hold all face-up cards and render each card
*/
function FaceUpCards({
  gamerunner,
  faceUpCards,
  updateTrains,
  active,
  drawClickCount,
  setDrawClickCount,
  playClickCount,
  destClickCount,
}: {
  gamerunner: GameRunner;
  faceUpCards: string[];
  updateTrains: (cards: number[]) => void;
  active: boolean;
  drawClickCount: number;
  setDrawClickCount: (num: number) => void;
  playClickCount: number;
  destClickCount: number;
}) {
  return (
    <div className="holder">
      {faceUpCards.map((faceUpCard, index) => (
        <FaceUpCard
          key={`${faceUpCard}-${index}`}
          index={index}
          gamerunner={gamerunner}
          color={faceUpCard}
          updateTrains={updateTrains}
          active={active}
          drawClickCount={drawClickCount}
          setDrawClickCount={setDrawClickCount}
          playClickCount={playClickCount}
          destClickCount={destClickCount}
        />
      ))}
    </div>
  );
}

export default FaceUpCards;
