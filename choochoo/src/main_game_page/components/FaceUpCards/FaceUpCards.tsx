import FaceUpCard from "./FaceUpCard";
import "./FaceUpCards.css";

function FaceUpCards({ face_up_cards }: { face_up_cards: string[] }) {
  return (
    <div className="holder">
      {face_up_cards.map((face_up_card, index) => (
        <FaceUpCard key={index} color={face_up_card} />
      ))}
    </div>
  );
}

export default FaceUpCards;
