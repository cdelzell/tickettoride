import { useEffect, useState } from "react";
import "./DestinationCard.css";
import { DestinationCardInfo } from "../../main_game_page";

// Arrows
import leftArrow from "@/assets/arrows/left_arrow.png";
import rightArrow from "@/assets/arrows/right_arrow.png";

// Destination Cards
import alb_miami from "@/assets/Destination_Cards/alb_miami.png";
import alb_tyville from "@/assets/Destination_Cards/alb_tyville.png";
import chicago_miami from "@/assets/Destination_Cards/chicago_miami.png";
import chicago_phoenix from "@/assets/Destination_Cards/chicago_phoenix.png";
import clara_houston from "@/assets/Destination_Cards/clara_houston.png";
import clara_la from "@/assets/Destination_Cards/clara_la.png";
import clara_ny from "@/assets/Destination_Cards/clara_ny.png";
import denver_palo from "@/assets/Destination_Cards/denver_palo.png";
import firestone_phoenix from "@/assets/Destination_Cards/firestone_phoenix.png";
import firestone_riddhi from "@/assets/Destination_Cards/firestone_riddhi.png";
import miami_riddhi from "@/assets/Destination_Cards/miami_riddhi.png";
import ny_houston from "@/assets/Destination_Cards/ny_houston.png";
import ny_oklahoma from "@/assets/Destination_Cards/ny_oklahoma.png";
import ny_tyville from "@/assets/Destination_Cards/ny_tyville.png";
import palo_la from "@/assets/Destination_Cards/palo_la.png";
import palo_phoenix from "@/assets/Destination_Cards/palo_phoenix.png";
import seattle_alb from "@/assets/Destination_Cards/seattle_alb.png";
import seattle_houston from "@/assets/Destination_Cards/seattle_houston.png";
import tyville_palo from "@/assets/Destination_Cards/tyville_palo.png";
import tyville_phoenix from "@/assets/Destination_Cards/tyville_phoenix.png";
import tyville_wash from "@/assets/Destination_Cards/tyville_wash.png";
import wash_denver from "@/assets/Destination_Cards/wash_denver.png";


// ...import all other images similarly...

// Map of image path names to imported images
const destinationImages: Record<string, string> = {
  alb_miami,
  alb_tyville,
  chicago_miami,
  chicago_phoenix,
  clara_houston,
  clara_la,
  clara_ny,
  denver_palo,
  firestone_phoenix,
  firestone_riddhi,
  miami_riddhi,
  ny_houston,
  ny_oklahoma,
  ny_tyville,
  palo_la,
  palo_phoenix,
  seattle_alb,
  seattle_houston,
  tyville_palo,
  tyville_phoenix,
  tyville_wash,
  wash_denver,
};

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
    setIndex((prevIndex) => (prevIndex - 1 + destinations.length) % destinations.length);
  };

  return (
    <div className="carousel_container">
      <div className="image_carousel">
        {pile_empty ? (
          <div className="empty_carousel">no destination cards</div>
        ) : (
          <DestinationCard destination={destinations[index].image_path} location="pile" />
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
  const className = location === "draw"
    ? "destination_card_draw"
    : location === "test"
    ? "test"
    : "destination_card";

  const imgSrc = destinationImages[destination];

  return <img className={className} src={imgSrc} alt={destination} />;
}

export default DestinationCardsCarousel;
