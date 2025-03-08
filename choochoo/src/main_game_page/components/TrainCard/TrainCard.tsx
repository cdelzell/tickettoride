import { Route } from "../Map";
import "./TrainCard.css";

function TrainCard({
  color,
  count,
  game_color,
  hover,
}: {
  color: string;
  count: number;
  game_color: string;
  hover: Route | null;
}) {
  let hoverClass = "";
  if (hover != null && game_color != hover.game_color) {
    hoverClass = "nonCurrentHover";
  } else if (hover != null && game_color === hover.game_color) {
    hoverClass = "currentHover";
  }
  return (
    <div className="card_with_count">
      <img className={`train_card ${hoverClass}`} src={color} alt={color} />
      <div className="circle">{count}</div>
    </div>
  );
}

export default TrainCard;
