import { useEffect, useState } from "react";
import "./DestinationCard.css";
import { DestinationCardInfo } from "../../mainGamePage";
import { leftArrow, rightArrow, destinationCardImages } from "@/image_imports";

export function DestinationCard({
  destination,
  location,
}: {
  destination: string | undefined;
  location: string;
}) {
  const className =
    location === "draw"
      ? "destination_card_draw"
      : location === "test"
      ? "test"
      : "destination_card";

  useEffect(() => {
    console.log("📸 DestinationCard received props →", {
      destination,
      type: typeof destination,
      location,
    });

    if (!destination) {
      console.warn("⚠️ No image path provided to DestinationCard");
    } else if (typeof destination !== "string") {
      console.error("❌ Invalid type for imagePath:", destination);
    }
  }, [destination, location]);

  return destination && typeof destination === "string" ? (
    <img
      className={className}
      src={destination}
      alt="Destination card"
      onError={(e) => {
        console.error("❌ Failed to load image:", destination);
        (e.target as HTMLImageElement).style.display = "none";
      }}
    />
  ) : (
    <div className={className}>⚠️ No Image</div>
  );
}


function DestinationCardsCarousel({
  destinations,
}: {
  destinations: DestinationCardInfo[];
}) {
  const [index, setIndex] = useState(0);
  const [pileEmpty, setPileEmpty] = useState(true);

  useEffect(() => {
    setPileEmpty(destinations.length === 0);
    setIndex(0); // reset index when list changes
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
        {pileEmpty ? (
          <div className="empty_carousel">no destination cards</div>
        ) : (
          <DestinationCard
            destination={destinations[index].imagePath}
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

export default DestinationCardsCarousel;
