import "./FaceUpCards.css";

function FaceUpCard({ color }: { color: string }) {
  return (
    <div>
      <button className="face_up_card">
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
