import { DestinationCard } from "./DestinationCard";
import "./DestinationCard.css";

function DrawDestinationCard({ destinations }: { destinations: string[] }) {
  return (
    <div className="draw_destination">
      <button className="destination_button">
        <DestinationCard
          destination={destinations[0]}
          location="draw"
        ></DestinationCard>
      </button>
      <button>
        <DestinationCard
          destination={destinations[1]}
          location="draw"
        ></DestinationCard>
      </button>
      <button>
        <DestinationCard
          destination={destinations[2]}
          location="draw"
        ></DestinationCard>
      </button>
    </div>
  );
}

export default DrawDestinationCard;
