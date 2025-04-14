import { useState } from "react";
import "./DestinationCard.css";
import { DestinationCardInfo } from "../../main_game_page";

function DestinationCardsCarousel({
  destinations,
}: {
  destinations: DestinationCardInfo[];
}) {
  const [index, setIndex] = useState(0);
  const [pile_empty, setPileEmpty] = useState(true);

  const nextImage = () => {
    setIndex((prevIndex) => (prevIndex + 1) % destinations.length);
  };

  const prevImage = () => {
    setIndex(
      (prevIndex) => (prevIndex - 1 + destinations.length) % destinations.length
    );
  };

  if (destinations == null) {
    setPileEmpty(true);
  }

  return (
    <div className="carousel_container">
      <div className="image_carousel">
        {pile_empty ? (
          <div className="empty_carousel">no destination cards</div>
        ) : (
          <DestinationCard
            destination={destinations[index].image_path}
            location="pile"
          />
        )}

        <div className="button_container">
          <button onClick={prevImage} className="carousel_button left">
            <img src="./src/assets/arrows/left_arrow.png"></img>
          </button>
          <button onClick={nextImage} className="carousel_button right">
            <img src="./src/assets/arrows/right_arrow.png"></img>
          </button>
        </div>
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
