import TrainCard from "./train-card";
import DestinationCard from "./destination-card"; // Importing the DestinationCard class
import TrainRoute from "./train-route";
import User from "./user";

class Player {
  destinationCardHand: DestinationCard[];
  id: string;

  scoredPoints: number;
  trainAmount: number;
  trainCardHand: Record<string, number>;
  username: string;
  constructor(id: string, user: string, trainCards: TrainCard[]) {
    this.id = id;
    this.username = user;
    this.trainCardHand = this.setStarterTrainCards(trainCards);
    this.destinationCardHand = []; // Initializing as empty array
    this.trainAmount = 45;
    this.scoredPoints = 0;
  }

  // Adding DestinationCards to the player's hand (creating instances)
  addDestinationCardToHand(destinationCardInfo: {
    destination1: string;
    destination2: string;
    pointValue: number;
  }): void {
    // Create a new DestinationCard instance
    const newDestinationCard = new DestinationCard(
      destinationCardInfo.destination1,
      destinationCardInfo.destination2,
      destinationCardInfo.pointValue
    );
    this.destinationCardHand.push(newDestinationCard);
  }

  addTrainCardToHand(trainCard: TrainCard): void {
    const color = trainCard.getColor().toLowerCase();
    this.trainCardHand[color] += 1;
  }

  addMultipleTrainCardsToHand(trainCards: TrainCard[]): void {
    for (let i = 0; i < trainCards.length; i++) {
      this.addTrainCardToHand(trainCards[i]);
    }
  }

  checkIfCanClaimRoute(route: TrainRoute): boolean {
    if (
      this.trainCardHand[route.getGameColor()] + this.trainCardHand["wild"] >=
        route.getLength() &&
      route.claimer == null
    ) {
      return true;
    }
    return false;
  }

  claimRoute(route: TrainRoute): string[] {
    if (!(route instanceof TrainRoute)) {
      console.error("Invalid route passed to claimRoute:", route);
      return [];
    }
    let usedTrainCardColors = [];
    for (let i = 0; i < route.getLength(); i++) {
      let routeColor = route.getGameColor();
      if (this.trainCardHand[routeColor] > 0) {
        this.trainCardHand[routeColor] -= 1;
        usedTrainCardColors.push(routeColor);
      } else {
        this.trainCardHand["wild"] -= 1;
        usedTrainCardColors.push("wild");
      }
    }
    this.scoredPoints += route.getPointValue();
    return usedTrainCardColors;
  }

  private setStarterTrainCards(
    trainCards: TrainCard[]
  ): Record<string, number> {
    let hand: Record<string, number> = {
      red: 0,
      yellow: 0,
      black: 0,
      green: 0,
      purple: 0,
      blue: 0,
      brown: 0,
      white: 0,
      wild: 0,
    };

    for (let card of trainCards) {
      hand[card.getColor()] += 1;
    }
    return hand;
  }

  getId(): string {
    return this.id;
  }

  getTrainAmount(): number {
    return this.trainAmount;
  }

  getTrainCardHand(): Record<string, number> {
    return this.trainCardHand;
  }

  getUsername(): string {
    return this.username;
  }

  getDestinationCardHand(): DestinationCard[] {
    return this.destinationCardHand;
  }

  getDestinationCardHandAsCards(): DestinationCard[] {
    return this.destinationCardHand;
  }

  toJSON() {
    return {
      id: this.id,
      username: this.username,
      trainCardHand: this.trainCardHand,
      destinationCardHand: this.destinationCardHand.map(
        (card) => card.toJSON?.() ?? card
      ),
      trainAmount: this.trainAmount,
      scoredPoints: this.scoredPoints,
    };
  }

  static fromJSON(data: any): Player {
    const player = Object.create(Player.prototype) as Player;

    player.id = data.id ?? "";
    player.username = data.username ?? "Unknown";
    player.trainCardHand = data.trainCardHand ?? {
      red: 0,
      yellow: 0,
      black: 0,
      green: 0,
      purple: 0,
      blue: 0,
      brown: 0,
      white: 0,
      wild: 0,
    };
    player.destinationCardHand = (data.destinationCardHand ?? []).map(
      (card: any) => DestinationCard.fromJSON?.(card) ?? card
    );
    player.trainAmount = data.trainAmount ?? 45;
    player.scoredPoints = data.scoredPoints ?? 0;

    console.log(player.trainCardHand);

    return player;
  }
}

export default Player;
