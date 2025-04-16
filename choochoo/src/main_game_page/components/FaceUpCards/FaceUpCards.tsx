import GameRunner from "../../../backend/game-runner";
import FaceUpCard from "./FaceUpCard";
import "./FaceUpCards.css";

function FaceUpCards({
  gamerunner,
  face_up_cards,
  updateTrains,
  active,
  drawClickCount,
  setDrawClickCount,
  playClickCount,
  destClickCount,
}: {
  gamerunner: GameRunner;
  face_up_cards: string[];
  updateTrains: (cards: number[]) => void;
  active: boolean;
  drawClickCount: number;
  setDrawClickCount: (num: number) => void;
  playClickCount: number;
  destClickCount: number;
}) {
  return (
    <div className="holder">
      {face_up_cards.map((face_up_card, index) => (
        <FaceUpCard

          key={`${face_up_card}-${index}`}

          index={index}
          gamerunner={gamerunner}
          color={face_up_card}
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
