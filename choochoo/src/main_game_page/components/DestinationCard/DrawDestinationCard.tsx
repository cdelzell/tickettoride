import { useState } from "react";
import { DestinationCard } from "./DestinationCard";
import "./DestinationCard.css";
import { DestinationCardInfo } from "../../main_game_page";
import BackendDestinationCard from "../../../backend/destination-card"; // Assuming this is the class import

function DrawDestinationCard({
  destinations,
  drawnDestCards,
  setDrawDestCard,
}: {
  destinations: DestinationCardInfo[];
  drawnDestCards: BackendDestinationCard[];
  setDrawDestCard: (cards: BackendDestinationCard[]) => void;
}) {
  const [clicked1, setClicked1] = useState(false);
  const [clicked2, setClicked2] = useState(false);
  const [clicked3, setClicked3] = useState(false);

  const handleClick = (id: string) => {
    const selected = destinations[parseInt(id)];

    // create an instance of the BackendDestinationCard class
    const card = new BackendDestinationCard(
      selected.destination1,
      selected.destination2,
      selected.points
    );

    // check if the card already exists in drawnDestCards
    const exists = drawnDestCards.some(
      (c) =>
        c.getDestinationsAsArray().join(",") === card.getDestinationsAsArray().join(",")
    );

    if (exists) {
      setDrawDestCard(
        drawnDestCards.filter(
          (c) =>
            c.getDestinationsAsArray().join(",") !== card.getDestinationsAsArray().join(",")
        )
      );
    } else {
      setDrawDestCard([...drawnDestCards, card]);
    }

    // Toggle the corresponding clicked state
    if (id === "0") {
      setClicked1((prev) => !prev);
    } else if (id === "1") {
      setClicked2((prev) => !prev);
    } else {
      setClicked3((prev) => !prev);
    }
  };

  return (
    <div className="draw_destination">
      <button
        onClick={() => handleClick("0")}
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
        onClick={() => handleClick("1")}
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
        onClick={() => handleClick("2")}
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
