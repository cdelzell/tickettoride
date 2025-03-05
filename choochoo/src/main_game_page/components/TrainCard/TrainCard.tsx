import "./TrainCard.css";

function TrainCard({ color, count }: { color: string; count: number }) {
  return (
    <div className="card_with_count">
      <img className="train_card" src={color} alt={color} />
      <div className="circle">{count}</div>
    </div>
  );
}

export default TrainCard;
