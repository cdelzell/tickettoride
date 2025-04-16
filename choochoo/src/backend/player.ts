import TrainCard from "./train-card";
import DestinationCard from "./destination-card";
import TrainRoute from "./train-route";
import User from "./user";

class Player {
  id: string;
  user: User;
  trainCardHand: Record<string, number>;
  destinationCardHand: DestinationCard[];
  trainAmount: number;
  scoredPoints: number;

  constructor(id: string, user: User, trainCards: TrainCard[]) {
    this.id = id;
    this.user = user;
    this.trainCardHand = this.setStarterTrainCards(trainCards);
    this.destinationCardHand = [];
    this.trainAmount = 45; //Standard starting amount TODO: Change for balance
    this.scoredPoints = 0;
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

  //Simple check to see if a player has enough cards of a route's type to claim it
  //Includes wild card functionality
  //TODO: A way to tell players they are going to use wild cards
 checkIfCanClaimRoute(route: TrainRoute): boolean {
    if (!(route instanceof TrainRoute)) {
      console.error("Invalid route passed to checkIfCanClaimRoute:", route);
      return false;
    }
  
    if (
      this.trainCardHand[route.getColor()] + this.trainCardHand['wild'] >=

      route.getLength()
    ) {
      return true;
    }
    return false;
  }

  //Claims a route by removing the right number of colored cards from their hand. Supports wilds.
  //Returns an array of cards used.
  claimRoute(route: TrainRoute): string[] {
    if (!(route instanceof TrainRoute)) {
      console.error("Invalid route passed to claimRoute:", route);
      return [];
    }
  
    let usedTrainCardColors = [];
    for (let i = 0; i < route.getLength(); i++) {
      let routeColor = route.getColor().toLowerCase();
      if (this.trainCardHand[routeColor] > 0) {
        this.trainCardHand[routeColor] -= 1;
        usedTrainCardColors.push(routeColor);
      } else {
        this.trainCardHand['wild'] -= 1;
        usedTrainCardColors.push('wild');

      }
    }
    this.trainAmount -= route.getLength();
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
    return this.user.getUsername();
  }

  getDestinationCardHand(): DestinationCard[] {
    return this.destinationCardHand.map((card) => ({ ...card }));
  }
}

export default Player;
