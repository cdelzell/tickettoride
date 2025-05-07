import TrainCard from "./trainCard";
import DestinationCard from "./destinationCard"; // Importing the DestinationCard class
import TrainRoute from "./trainRoute";

/**
 * Player class
 * Contains all logic for handling players within a game
 * Players are distinct from users. Players are dependent on game instance, whereas
 * users are persistent across games and contain statistics and profile preferences
 * This class contains anything a single player controls, or what is present on the player's bottom UI bar
 */
class Player {
  destinationCardHand: DestinationCard[];
  id: string; //From lobby, used for tracking
  trainAmount: number; //Used to claim routes based on their value, not train cards
  trainCardHand: Record<string, number>; //Color, number of that color
  username: string; //From lobby, used for display
  constructor(id: string, user: string, trainCards: TrainCard[]) {
    this.id = id;
    this.username = user;
    this.trainCardHand = this.setStarterTrainCards(trainCards);
    this.destinationCardHand = []; // Initializing as empty array
    this.trainAmount = 28;
  }

  /*
    Adding DestinationCards to the player's hand (creating instances)
  */
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

  /*
    Adds a specific train card to the player's hand
    Added as a number in a dictionary, not an actual TrainCard
  */
  addTrainCardToHand(trainCard: TrainCard): void {
    const color = trainCard.getColor().toLowerCase();
    this.trainCardHand[color] += 1;
  }

  /*
    Adds multiple train cards to a player's hand
  */
  addMultipleTrainCardsToHand(trainCards: TrainCard[]): void {
    for (let i = 0; i < trainCards.length; i++) {
      this.addTrainCardToHand(trainCards[i]);
    }
  }

  /*
    Given a TrainRoute, checks if this player can satisfy claiming protocol 
  */
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

  /*
    Given a route, claims the route using the player's resources
  */
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
    this.trainAmount -= route.getLength();
    return usedTrainCardColors;
  }

  /*
    Sets up the player's train card hand based on hardcoded colors
    Takes the first few traincards from the gameboard
    Called during class construction
  */
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

  /*
    Used by gamerunner to serialize the player for database storage
  */
  toJSON() {
    return {
      id: this.id,
      username: this.username,
      trainCardHand: this.trainCardHand,
      destinationCardHand: this.destinationCardHand.map(
        (card) => card.toJSON?.() ?? card
      ),
      trainAmount: this.trainAmount,
    };
  }

  /*
    Used by gamerunner to unpack a player from storage once the game updates
    Resets all fields within the player
  */
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

    return player;
  }
}

export default Player;
