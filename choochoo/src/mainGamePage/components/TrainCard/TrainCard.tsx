import { Route } from "../Map";
import "./TrainCard.css";
import { trainCardImages } from "@/image_imports";

function TrainCard({
  color, // still passed, but unused
  count,
  gameColor,
  hover,
}: {
  color: string;
  count: number;
  gameColor: string;
  hover: Route | null;
}) {
  let hoverClass = "";
  if (hover != null && gameColor !== hover.gameColor && gameColor !== "wild") {
    hoverClass = "nonCurrentHover";
  } else if (hover != null && gameColor === hover.gameColor) {
    hoverClass = "currentHover";
  }

  const imgSrc = trainCardImages[gameColor] ?? trainCardImages["wild"];

  return (
    <div className="card_with_count">
      <img
        className={`train_card ${hoverClass}`}
        src={imgSrc}
        alt={gameColor}
      />
      <div className="circle">{count}</div>
    </div>
  );
}

export default TrainCard;
