import "./FaceUpCards.css";

function FaceUpCard({
  color,
  updateTrains,
  active,
}: {
  color: string;
  updateTrains: (color: string, amount: number) => void;
  active: boolean;
}) {
  const handleClick = () => {
    if (active) {
      updateTrains(color, 1);
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
