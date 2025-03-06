import "./TrainCard.css";

function TrainCard({
  color,
  count,
  game_color,
}: {
  color: string;
  count: number;
  game_color: string;
}) {
  return (
    <div className="card_with_count">
      <img className="train_card" src={color} alt={color} />
      <div className="circle">{count}</div>
    </div>
  );
}

export default TrainCard;
