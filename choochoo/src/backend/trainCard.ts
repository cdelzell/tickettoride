/**
 * TrainCard Class
 * Represents a train card in the Ticket to Ride game.
 * Train cards are used to claim routes on the game board.
 * Each card has a specific color that must match the route being claimed.
 */
class TrainCard {
  /** The color of the train card (e.g., 'red', 'blue', 'wild') */
  color: string;

  /**
   * Creates a new TrainCard instance
   * @param color - The color of the train card
   */
  constructor(color: string) {
    this.color = color;
  }

  /**
   * Gets the color of the train card
   * @returns The lowercase color name of the card
   */
  getColor(): string {
    return this.color.toLowerCase();
  }

  /**
   * Converts the train card to a JSON object for storage
   * @returns JSON representation of the train card
   */
  toJSON() {
    return {
      color: this.color,
    };
  }

  /**
   * Creates a TrainCard instance from JSON data
   * @param data - JSON data containing train card information
   * @returns New TrainCard instance
   */
  static fromJSON(data: any): TrainCard {
    return new TrainCard(data.color);
  }
}

export default TrainCard;
