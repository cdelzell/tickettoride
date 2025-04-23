import { useEffect, useState } from "react";
import "./DestinationCard.css";
import { DestinationCardInfo } from "../../mainGamePage";
import { leftArrow, rightArrow, destinationCardImages } from "@/image_imports";

function DestinationCardsCarousel({
  destinations,
}: {
  destinations: DestinationCardInfo[];
}) {
  const [index, setIndex] = useState(0);
  const [pile_empty, setPileEmpty] = useState(true);

  useEffect(() => {
    setPileEmpty(destinations.length === 0);
  }, [destinations]);

  const nextImage = () => {
    setIndex((prevIndex) => (prevIndex + 1) % destinations.length);
  };

  const prevImage = () => {
    setIndex(
      (prevIndex) => (prevIndex - 1 + destinations.length) % destinations.length
    );
  };

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
            <img src={leftArrow} alt="Previous" />
          </button>
          <button onClick={nextImage} className="carousel_button right">
            <img src={rightArrow} alt="Next" />
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
  const className =
    location === "draw"
      ? "destination_card_draw"
      : location === "test"
      ? "test"
      : "destination_card";

  const imgSrc =
    destinationCardImages[destination as keyof typeof destinationCardImages];

  return <img className={className} src={imgSrc} alt={destination} />;
}

export default DestinationCardsCarousel;
