import { Route } from "../Map";
import "./TrainCard.css";
import { trainCardImages } from "@/image_imports";

function TrainCard({
  color, // still passed, but unused
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
  if (hover != null && game_color !== hover.game_color && game_color !== "wild") {
    hoverClass = "nonCurrentHover";
  } else if (hover != null && game_color === hover.game_color) {
    hoverClass = "currentHover";
  }

  const imgSrc = trainCardImages[game_color] ?? trainCardImages["wild"];

  return (
    <div className="card_with_count">
      <img className={`train_card ${hoverClass}`} src={imgSrc} alt={game_color} />
      <div className="circle">{count}</div>
    </div>
  );
}

export default TrainCard;
