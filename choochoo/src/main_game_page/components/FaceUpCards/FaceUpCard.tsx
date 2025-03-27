import "./FaceUpCards.css";

function FaceUpCard({
  color,
  updateTrains,
  active,
  drawClickCount,
  setDrawClickCount,
  playClickCount,
  setPlayClickCount,
  destClickCount,
  setDestClickCount,
}: {
  color: string;
  updateTrains: (color: string, amount: number) => void;
  active: boolean;
  drawClickCount: number;
  setDrawClickCount: (num: number) => void;
  playClickCount: number;
  setPlayClickCount: (num: number) => void;
  destClickCount: number;
  setDestClickCount: (num: number) => void;
}) {
  const handleClick = () => {
    if (active) {
      if (drawClickCount < 2 && playClickCount == 0 && destClickCount == 0) {
        setDrawClickCount(drawClickCount + 1);
        updateTrains(color, 1);
      }
    }
  };
  return (
    <div>
      <button className="face_up_card" onClick={() => handleClick()}>
        <img
          className="train_card"
          src={"./src/assets/cards/" + color + ".png"}
          alt={color}
        />
      </button>
    </div>
  );
}

export default FaceUpCard;
