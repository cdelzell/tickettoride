import { blue } from "@mui/material/colors";
import { DestinationCard } from "./DestinationCard";
import "./DestinationCard.css";
import { useState } from "react";

function DrawDestinationCard({
  destinations,
  drawnDestCards,
  setDrawDestCard,
}: {
  destinations: string[];
  drawnDestCards: number[];
  setDrawDestCard: (cards: number[]) => void;
}) {
  const [clicked1, setClicked1] = useState(false);
  const [clicked2, setClicked2] = useState(false);
  const [clicked3, setClicked3] = useState(false);

  const handleClick = (id: string) => {
    if (id === "1") {
      clicked1 ? setClicked1(false) : setClicked1(true);
      clicked1
        ? drawnDestCards.filter((drawnDestCards) => drawnDestCards !== 1)
        : drawnDestCards.push(1);
      setDrawDestCard(drawnDestCards);
    } else if (id === "2") {
      clicked2 ? setClicked2(false) : setClicked2(true);
      clicked2
        ? drawnDestCards.filter((drawnDestCards) => drawnDestCards !== 2)
        : drawnDestCards.push(2);
      setDrawDestCard(drawnDestCards);
    } else {
      clicked3 ? setClicked3(false) : setClicked3(true);
      clicked3
        ? drawnDestCards.filter((drawnDestCards) => drawnDestCards !== 3)
        : drawnDestCards.push(3);
      setDrawDestCard(drawnDestCards);
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
          destination={destinations[0]}
          location="draw"
        ></DestinationCard>
      </button>
      <button
        onClick={() => handleClick("2")}
        style={{
          outline: clicked2 ? ".2vw solid rgb(106, 172, 176)" : "transparent",
        }}
      >
        <DestinationCard
          destination={destinations[1]}
          location="draw"
        ></DestinationCard>
      </button>
      <button
        onClick={() => handleClick("3")}
        style={{
          outline: clicked3 ? ".2vw solid rgb(106, 172, 176)" : "transparent",
        }}
      >
        <DestinationCard
          destination={destinations[2]}
          location="draw"
        ></DestinationCard>
      </button>
    </div>
  );
}

export default DrawDestinationCard;
