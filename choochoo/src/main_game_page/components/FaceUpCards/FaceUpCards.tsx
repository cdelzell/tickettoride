import FaceUpCard from "./FaceUpCard";
import "./FaceUpCards.css";

function FaceUpCards({
  face_up_cards,
  updateTrains,
  active,
  drawClickCount,
  setDrawClickCount,
  playClickCount,
  setPlayClickCount,
  destClickCount,
  setDestClickCount,
}: {
  face_up_cards: string[];
  updateTrains: (color: string, amount: number) => void;
  active: boolean;
  drawClickCount: number;
  setDrawClickCount: (num: number) => void;
  playClickCount: number;
  setPlayClickCount: (num: number) => void;
  destClickCount: number;
  setDestClickCount: (num: number) => void;
}) {
  return (
    <div className="holder">
      {face_up_cards.map((face_up_card, index) => (
        <FaceUpCard
          key={index}
          color={face_up_card}
          updateTrains={updateTrains}
          active={active}
          drawClickCount={drawClickCount}
          setDrawClickCount={setDrawClickCount}
          playClickCount={playClickCount}
          setPlayClickCount={setPlayClickCount}
          destClickCount={destClickCount}
          setDestClickCount={setDestClickCount}
        />
      ))}
    </div>
  );
}

export default FaceUpCards;
