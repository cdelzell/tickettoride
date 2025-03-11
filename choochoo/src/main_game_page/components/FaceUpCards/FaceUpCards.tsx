import FaceUpCard from "./FaceUpCard";
import "./FaceUpCards.css";

function FaceUpCards({
  face_up_cards,
  updateTrains,
  active,
}: {
  face_up_cards: string[];
  updateTrains: (color: string, amount: number) => void;
  active: boolean;
}) {
  return (
    <div className="holder">
      {face_up_cards.map((face_up_card, index) => (
        <FaceUpCard
          key={index}
          color={face_up_card}
          updateTrains={updateTrains}
          active={active}
        />
      ))}
    </div>
  );
}

export default FaceUpCards;
