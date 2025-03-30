import TrainCard from './train-card';
import DestinationCard from './destination-card';
import BoardGraph from './board-graph';

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
      'purple',
      'white',
      'blue',
      'yellow',
      'brown',
      'black',
      'red',
      'green',
    ];
    const NUM_EACH_COLOR = 12;

    for (let i = 0; i < colors.length; i++) {
      for (let j = 0; j < NUM_EACH_COLOR; j++) {
        this.trainCardDrawPile.push(new TrainCard(colors[i]));
      }
    }
    const NUM_WILDS = 14;
    for (let i = 0; i < NUM_WILDS; i++) {
      this.trainCardDrawPile.push(new TrainCard('wild'));
    }
    this.#shuffleTrainDeck();
  }

  //Generates all destination cards we want
  //TODO
  #getStartDestinationCards() {
    return [];
  }

  //Sets the first face-up cards visible to players
  #setStartFaceUpTrainCards() {
    const FACE_UP_NUM = 5; //From rulebook
    return this.drawTrainCards(FACE_UP_NUM);
  }
}

export default GameBoard;
