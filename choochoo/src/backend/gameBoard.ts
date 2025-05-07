import TrainCard from "./trainCard";
import DestinationCard from "./destinationCard";
import BoardGraph from "./boardGraph";

/* How many face up cards should be present to be choosen from*/
const FACE_UP_NUM = 5;

/**
 * GameBoard Class
 * Manages the game board state including routes, train cards, and destination cards.
 * Handles card drawing, discarding, and face-up card management.
 */
class GameBoard {
  /** The graph representation of the game board containing all routes */
  boardGraph: BoardGraph;
  trainCardDrawPile: TrainCard[];
  destinationCardDrawPile: DestinationCard[];
  trainCardDiscardPile: TrainCard[];
  faceUpTrainCards: TrainCard[];

  constructor() {
    this.boardGraph = new BoardGraph();
    this.trainCardDrawPile = [];
    this.getStartTrainCards();
    this.destinationCardDrawPile = this.getStartDestinationCards();
    this.trainCardDiscardPile = [];
    this.faceUpTrainCards = this.setStartFaceUpTrainCards();
  }

  /*
    Shuffles using the random function from the Math library to ensure random order
  */
  shuffleTrainDeck() {
    for (let i = this.trainCardDrawPile.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [this.trainCardDrawPile[i], this.trainCardDrawPile[j]] = [
        this.trainCardDrawPile[j],
        this.trainCardDrawPile[i],
      ];
    }
  }

  /*
    Pulls only a single TrainCard from the top of the draw pile
  */
  drawSingleTrainCard(): TrainCard {
    return this.drawTrainCards(1)[0];
  }

  /*
    Draws and returns a given number of TrainCards.
    Cards are removed from the draw pile and thus the gameboard
  */
  drawTrainCards(numCards: number): TrainCard[] {
    let returnPile: TrainCard[] = [];
    for (let i = 0; i < numCards; i++) {
      if (this.trainCardDrawPile.length < numCards) {
        this.shuffleDiscardIntoDraw();
      }
      const card = this.trainCardDrawPile.shift();
      if (card) {
        returnPile.push(card);
      }
    }
    return returnPile;
  }

  /*
    Draws and returns a given number of DestinationCards
    Cards are removed from the draw pile and thus the gameboard
  */
  drawDestinationCards(numCards: number): DestinationCard[] {
    let returnPile: DestinationCard[] = [];
    for (let i = 0; i < numCards; i++) {
      const card = this.destinationCardDrawPile.shift();
      if (card) {
        returnPile.push(card);
      }
    }
    return returnPile;
  }

  /*
    Adds back destination cards that have been removed from the gameboard but not selected
  */
  addBackDestinationCards(cards: DestinationCard[]) {
    for (let i = 0; i < cards.length; i++) {
      this.destinationCardDrawPile.push(cards[i]);
    }
  }

  /*
    Given an index, draws the faceup card from the list and replaces it.
  */
  takeFaceUpTrainCard(index: number) {
    if (index > 4) {
      console.error("Invalid faceup index:", index);
      return;
    }
    let trainCardTaken = this.faceUpTrainCards[index];
    this.faceUpTrainCards[index] = this.drawSingleTrainCard(); //Replaces the taken train card
    return trainCardTaken;
  }

  /*
    Returns the faceup careds formatted for the frontend
  */
  getFaceupTrainCardsAsList() {
    let returnList: string[] = [];
    for (const card of this.faceUpTrainCards) {
      returnList.push(card.getColor());
    }
    return returnList;
  }

  /*
    Given a route's index, return that route from the graph
  */
  getRouteByIndex(index: number) {
    return this.boardGraph.getRouteByIndex(index);
  }

  /*
    Reshuffles the discard pile into the draw pile, while empytying the discard pile.
  */
  shuffleDiscardIntoDraw() {
    console.log("reached");
    this.trainCardDrawPile = this.trainCardDrawPile.concat(
      this.trainCardDiscardPile
    ); //Instantiates new draw pile, which may be a problem??
    this.trainCardDiscardPile = [];
    this.shuffleTrainDeck();
  }

  /*
    Called when a player claims a route. Takes the used colors and
    adds them to the discard pile as new train cards
  */
  addDiscardsFromUsedTrainCards(usedTrainCardColors: string[]) {
    for (let i = 0; i < usedTrainCardColors.length; i++) {
      this.trainCardDiscardPile.push(new TrainCard(usedTrainCardColors[i]));
    }
  }

  /*
    Generates the TrainCards in the starter draw pile at a set distribution
    Called during construction
    Returns shuffled list
  */
  getStartTrainCards() {
    //In order from manual
    let colors = [
      "purple",
      "white",
      "blue",
      "yellow",
      "brown",
      "black",
      "red",
      "green",
    ];
    const NUM_EACH_COLOR = 12;

    for (let i = 0; i < colors.length; i++) {
      for (let j = 0; j < NUM_EACH_COLOR; j++) {
        this.trainCardDrawPile.push(new TrainCard(colors[i]));
      }
    }
    const NUM_WILDS = 14;
    for (let i = 0; i < NUM_WILDS; i++) {
      this.trainCardDrawPile.push(new TrainCard("wild"));
    }
    this.shuffleTrainDeck();
  }

  /*
    Generates all hardcoded DestinationCards and returns them
    Called during construction
    Returns a shuffled list
  */
  getStartDestinationCards(): DestinationCard[] {
    let startPile: DestinationCard[] = [
      new DestinationCard("Albuquerque", "Miami", 11),
      new DestinationCard("Albuquerque", "Tyville", 9),
      new DestinationCard("Chicago", "Miami", 7),
      new DestinationCard("Chicago", "Phoenix", 11),
      new DestinationCard("Clara City", "Houston", 9),
      new DestinationCard("Clara City", "Los Angeles", 9),
      new DestinationCard("Clara City", "New York", 10),
      new DestinationCard("Denver", "Palo Noah", 9),
      new DestinationCard("Firestone Rouge", "Phoenix", 8),
      new DestinationCard("Firestone Rouge", "Riddhi Rapids", 9),
      new DestinationCard("Miami", "Riddhi Rapids", 18),
      new DestinationCard("New York", "Houston", 12),
      new DestinationCard("New York", "Oklahoma City", 11),
      new DestinationCard("New York", "Tyville", 14),
      new DestinationCard("Palo Noah", "Los Angeles", 16),
      new DestinationCard("Palo Noah", "Phoenix", 12),
      new DestinationCard("Seattle", "Albuquerque", 10),
      new DestinationCard("Seattle", "Houston", 15),
      new DestinationCard("Tyville", "Palo Noah", 11),
      new DestinationCard("Tyville", "Phoenix", 7),
      new DestinationCard("Tyville", "Washington", 13),
      new DestinationCard("Washington", "Denver", 10),
    ];
    //Shuffle function
    for (let i = startPile.length - 1; i > 0; i--) {
      // pick a random index from 0 to i
      const j = Math.floor(Math.random() * (i + 1));
      // swap elements i and j
      [startPile[i], startPile[j]] = [startPile[j], startPile[i]];
    }
    return startPile;
  }

  /*
    Constructor function to set the initial faceup cards
  */
  setStartFaceUpTrainCards() {
    return this.drawTrainCards(FACE_UP_NUM);
  }

  /**
   * Converts the game board state to a JSON object for storage
   * @returns JSON representation of the game board state
   */
  toJSON() {
    return {
      boardGraph: this.boardGraph.toJSON?.() ?? this.boardGraph,
      trainCardDrawPile: this.trainCardDrawPile.map((c) => c.toJSON?.() ?? c),
      destinationCardDrawPile: this.destinationCardDrawPile.map(
        (c) => c.toJSON?.() ?? c
      ),
      trainCardDiscardPile: this.trainCardDiscardPile.map(
        (c) => c.toJSON?.() ?? c
      ),
      faceUpTrainCards: this.faceUpTrainCards.map((c) => c.toJSON?.() ?? c),
    };
  }

  /**
   * Creates a GameBoard instance from JSON data
   * @param data - JSON data representing a game board state
   * @returns New GameBoard instance
   */
  static fromJSON(data: any): GameBoard {
    const board = Object.create(GameBoard.prototype) as GameBoard;

    board.boardGraph =
      BoardGraph.fromJSON?.(data.boardGraph) ?? new BoardGraph();

    board.trainCardDrawPile = Array.isArray(data.trainCardDrawPile)
      ? data.trainCardDrawPile.map(
          (c: any) => TrainCard.fromJSON?.(c) ?? new TrainCard(c.color)
        )
      : [];

    board.destinationCardDrawPile = Array.isArray(data.destinationCardDrawPile)
      ? data.destinationCardDrawPile.map(
          (c: any) =>
            DestinationCard.fromJSON?.(c) ??
            new DestinationCard(c.destination1, c.destination2, c.pointValue)
        )
      : [];

    board.trainCardDiscardPile = Array.isArray(data.trainCardDiscardPile)
      ? data.trainCardDiscardPile.map(
          (c: any) => TrainCard.fromJSON?.(c) ?? new TrainCard(c.color)
        )
      : [];

    board.faceUpTrainCards = Array.isArray(data.faceUpTrainCards)
      ? data.faceUpTrainCards.map(
          (c: any) => TrainCard.fromJSON?.(c) ?? new TrainCard(c.color)
        )
      : [];

    return board;
  }
}

export default GameBoard;
