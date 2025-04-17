import "./FaceUpCards.css";
import GameRunner from "../../../backend/game-runner";
import { trainCardImages } from "@/image_imports";

function FaceUpCard({
  index,
  gamerunner,
  color,
  updateTrains,
  active,
  drawClickCount,
  setDrawClickCount,
  playClickCount,
  destClickCount,
}: {
  index: number;
  gamerunner: GameRunner;
  color: string;
  updateTrains: (cards: number[]) => void;
  active: boolean;
  drawClickCount: number;
  setDrawClickCount: (num: number) => void;
  playClickCount: number;
  destClickCount: number;
}) {
  const handleClick = () => {
    if (active && drawClickCount < 2 && playClickCount === 0 && destClickCount === 0) {
      setDrawClickCount(drawClickCount + 1);
      gamerunner.drawFaceupTrainCard(index);
      updateTrains(gamerunner.getMainPlayerTrainCards());
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignContent: "center" }}>
      <button className="face_up_card" onClick={handleClick}>
        <img
          className="train_card"
          src={trainCardImages[color] ?? trainCardImages["wild"]}
          alt={color}
        />
      </button>
    </div>
  );
}

export default FaceUpCard;
