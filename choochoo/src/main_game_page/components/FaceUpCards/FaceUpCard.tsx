import "./FaceUpCards.css";
import GameRunner from "../../../backend/game-runner";

import red from "@/assets/cards/red.png";
import yellow from "@/assets/cards/yellow.png";
import black from "@/assets/cards/black.png";
import green from "@/assets/cards/green.png";
import purple from "@/assets/cards/purple.png";
import blue from "@/assets/cards/blue.png";
import brown from "@/assets/cards/brown.png";
import white from "@/assets/cards/white.png";
import wild from "@/assets/cards/wild.png";

const cardImages: Record<string, string> = {
  red,
  yellow,
  black,
  green,
  purple,
  blue,
  brown,
  white,
  wild,
};

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
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignContent: "center",
      }}
    >
      <button className="face_up_card" onClick={handleClick}>
        <img
          className="train_card"
          src={cardImages[color] ?? wild}
          alt={color}
        />
      </button>
    </div>
  );
}

export default FaceUpCard;
