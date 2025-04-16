import { Route } from "../Map";
import "./TrainCard.css";

// ✅ Import all train card images
import red from "@/assets/cards/red.png";
import yellow from "@/assets/cards/yellow.png";
import black from "@/assets/cards/black.png";
import green from "@/assets/cards/green.png";
import purple from "@/assets/cards/purple.png";
import blue from "@/assets/cards/blue.png";
import brown from "@/assets/cards/brown.png";
import white from "@/assets/cards/white.png";
import wild from "@/assets/cards/wild.png";

// ✅ Map game_color to image
const cardImages: Record<string, string> = {
  red,
  yellow,
  black,
  green,
  purple,
  blue,
  brown,
  white,
  wild,
};

function TrainCard({
  color, // will no longer be used
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

  const imgSrc = cardImages[game_color] ?? wild;

  return (
    <div className="card_with_count">
      <img className={`train_card ${hoverClass}`} src={imgSrc} alt={game_color} />
      <div className="circle">{count}</div>
    </div>
  );
}

export default TrainCard;