import { useState } from "react";
import "./DestinationCard.css";

function DestinationCardsCarousel({
  destinations,
}: {
  destinations: string[];
}) {
  const [index, setIndex] = useState(0);

  const nextImage = () => {
    setIndex((prevIndex) => (prevIndex + 1) % destinations.length);
  };

  const prevImage = () => {
    setIndex(
      (prevIndex) => (prevIndex - 1 + destinations.length) % destinations.length
    );
  };

  return (
    <div className="image_carousel">
      <DestinationCard destination={destinations[index]} location="pile" />
      <div className="button_container">
        <button onClick={prevImage} className="carousel_button">
          <img src="./src/assets/arrows/left_arrow.png"></img>
        </button>
        <button onClick={nextImage} className="carousel_button">
          <img src="./src/assets/arrows/right_arrow.png"></img>
        </button>
      </div>
    </div>
  );
}

export function DestinationCard({
  destination,
  location,
}: {
  destination: string;
  location: string;
}) {
  let name = "destination_card";
  if (location === "draw") {
    name = "destination_card_draw";
  } else if (location === "test") {
    name = "test";
  }

  return (
    <img
      className={name}
      src={"./src/assets/destination_cards/" + destination + ".png"}
      alt={destination}
    />
  );
}

export default DestinationCardsCarousel;
