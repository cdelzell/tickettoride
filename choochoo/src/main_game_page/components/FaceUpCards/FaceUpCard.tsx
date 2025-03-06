import "./FaceUpCards.css";

function FaceUpCard({
  color,
  updateTrains,
}: {
  color: string;
  updateTrains: (color: string, amount: number) => void;
}) {
  return (
    <div>
      <button className="face_up_card" onClick={() => updateTrains(color, 1)}>
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
