import TrainCard from "./train-card";
import DestinationCard from "./destination-card";
import BoardGraph from "./board-graph";

class GameBoard {
  boardGraph: BoardGraph;
  trainCardDrawPile: TrainCard[];
  destinationCardDrawPile: DestinationCard[];
  trainCardDiscardPile: TrainCard[];
  faceUpTrainCards: TrainCard[];

  constructor() {
    this.boardGraph = new BoardGraph();
    this.trainCardDrawPile = [];
    this.#getStartTrainCards();
    this.destinationCardDrawPile = this.#getStartDestinationCards();
    this.trainCardDiscardPile = [];
    this.faceUpTrainCards = this.#setStartFaceUpTrainCards();
    this.boardGraph = new BoardGraph();
  }

  #shuffleTrainDeck() {
    for (let i = this.trainCardDrawPile.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [this.trainCardDrawPile[i], this.trainCardDrawPile[j]] = [
        this.trainCardDrawPile[j],
        this.trainCardDrawPile[i],
      ];
    }
  }

  drawSingleTrainCard(): TrainCard {
    return this.drawTrainCards(1)[0];
  }

  drawTrainCards(numCards: number): TrainCard[] {
    let returnPile: TrainCard[] = [];
    for (let i = 0; i < numCards; i++) {
      if (this.trainCardDrawPile.length < numCards) {
        this.#shuffleDiscardIntoDraw();
      }
      const card = this.trainCardDrawPile.shift();
      if (card) {
        returnPile.push(card);
      }
    }
    return returnPile;
  }

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

  addBackDestinationCards(cards: DestinationCard[]) {
    for (let i = 0; i < cards.length; i++) {
      this.destinationCardDrawPile.push(cards[i]);
    }
  }

  takeFaceUpTrainCard(index: number) {
    let trainCardTaken = this.faceUpTrainCards[index];
    this.faceUpTrainCards[index] = this.drawSingleTrainCard();
    //TODO: Check for three wilds.
    return trainCardTaken;
  }

  //For frontend
  getFaceupTrainCardsAsList() {
    let returnList: string[] = [];
    for (const card of this.faceUpTrainCards) {
      returnList.push(card.getColor());
    }
    return returnList;
  }

  getRouteByIndex(index: number) {
    return this.boardGraph.getRouteByIndex(index);
  }

  //Reshuffles the discard pile into the draw pile, while empytying the discard pile
  #shuffleDiscardIntoDraw() {
    this.trainCardDrawPile = this.trainCardDrawPile.concat(
      this.trainCardDiscardPile
    ); //Instantiates new draw pile, which may be a problem??
    this.trainCardDiscardPile = [];
    this.#shuffleTrainDeck();
  }

  addDiscardsFromUsedTrainCards(usedTrainCardColors: string[]) {
    for (let i = 0; i < usedTrainCardColors.length; i++) {
      this.trainCardDiscardPile.push(new TrainCard(usedTrainCardColors[i]));
    }
  }

  //ALL BELOW HERE ARE CONSTRUCTOR FUNCTIONS

  //Generates train cards according to rule distribution
  //Returns shuffled list
  #getStartTrainCards() {
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
    this.#shuffleTrainDeck();
  }

  //Generates all destination cards we want
  //TODO
  #getStartDestinationCards() {
    return [
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
  }

  //Sets the first face-up cards visible to players
  #setStartFaceUpTrainCards() {
    const FACE_UP_NUM = 5; //From rulebook
    return this.drawTrainCards(FACE_UP_NUM);
  }

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
