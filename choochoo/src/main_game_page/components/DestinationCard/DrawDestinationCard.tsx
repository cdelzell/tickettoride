import { useState } from "react";
import { DestinationCard } from "./DestinationCard";
import "./DestinationCard.css";
import { DestinationCardInfo } from "../../main_game_page";

function DrawDestinationCard({
  destinations,
  drawnDestCards,
  setDrawDestCard,
}: {
  destinations: DestinationCardInfo[];
  drawnDestCards: number[];
  setDrawDestCard: (cards: number[]) => void;
}) {
  const [clicked1, setClicked1] = useState(false);
  const [clicked2, setClicked2] = useState(false);
  const [clicked3, setClicked3] = useState(false);

  const handleClick = (id: string) => {
    const cardNum = parseInt(id);
    let newDrawnCards: number[];

    if (drawnDestCards.includes(cardNum)) {
      // Remove the card
      newDrawnCards = drawnDestCards.filter((num) => num !== cardNum);
    } else {
      // Add the card
      newDrawnCards = [...drawnDestCards, cardNum];
    }

    // Update the selected card numbers
    setDrawDestCard(newDrawnCards);

    // Toggle the corresponding clicked state
    if (id === "1") {
      setClicked1((prev) => !prev);
    } else if (id === "2") {
      setClicked2((prev) => !prev);
    } else {
      setClicked3((prev) => !prev);
    }
  };

  return (
    <div className="draw_destination">
      <button
        onClick={() => handleClick("1")}
        style={{
          outline: clicked1 ? ".2vw solid rgb(106, 172, 176)" : "transparent",
        }}
      >
        <DestinationCard
          destination={destinations[0].image_path}
          location="draw"
        />
      </button>
      <button
        onClick={() => handleClick("2")}
        style={{
          outline: clicked2 ? ".2vw solid rgb(106, 172, 176)" : "transparent",
        }}
      >
        <DestinationCard
          destination={destinations[1].image_path}
          location="draw"
        />
      </button>
      <button
        onClick={() => handleClick("3")}
        style={{
          outline: clicked3 ? ".2vw solid rgb(106, 172, 176)" : "transparent",
        }}
      >
        <DestinationCard
          destination={destinations[2].image_path}
          location="draw"
        />
      </button>
    </div>
  );
}

export default DrawDestinationCard;
