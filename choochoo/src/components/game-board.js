import TrainCard from './train-card.js'

class GameBoard {
    constructor() {
        this.trainCardDrawPile = this.#getStartTrainCards();
        this.destinationCardDrawPile = this.#getStartDestinationCards();
        this.trainCardDiscardPile = [];
        this.faceUpTrainCards = this.#setStartFaceUpTrainCards();
    }

    //Shuffles a given array, used here to shuffle decks
    #shuffleDeck(deck) {
        for (let i = deck.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            [deck[i], deck[j]] = [deck[j], deck[i]];
        }
        return deck;
    }

    //TODO: It reshuffles the deck, but if there are literally not enough cards in a deck to draw, it will break. This is probably a rare edgecase though and not a huge concern
    #drawCardsFromDeck(type, numCards) {
        let returnPile = [];
        for (let i = 0; i < numCards; i++) {
            if (type == 'train') {
                if (this.trainCardDrawPile.length < numCards) {
                    this.#shuffleDiscardIntoDraw()
                }
                returnPile.push(this.trainCardDrawPile.shift());
            }
            else if (type == 'destination'){
                returnPile.push(this.destinationCardDrawPile.shift());
            }
            else {
                return null //TODO: Error Logic here. BAD CODE
            }
        }
        return returnPile;
    }

    drawSingleTrainCard() {
        return this.#drawCardsFromDeck('train', 1)[0];
    }

    drawTrainCards(numCards) {
        return this.#drawCardsFromDeck('train', numCards);
    }

    drawDestinationCards(numCards) {
        return this.#drawCardsFromDeck('destination', numCards);
    }

    takeFaceUpTrainCard(index) {
        let trainCardTaken = this.faceUpTrainCards[index];
        this.faceUpTrainCards[index] = this.drawSingleTrainCard();
        return trainCardTaken;
    }

    //Reshuffles the discard pile into the draw pile, while empytying the discard pile
    #shuffleDiscardIntoDraw() {
        this.trainCardDrawPile = this.trainCardDrawPile.concat(this.trainCardDiscardPile); //Instantiates new draw pile, which may be a problem??
        this.trainCardDiscardPile = [];
        this.trainCardDrawPile = this.#shuffleDeck(this.trainCardDrawPile)
    }

    //ALL BELOW HERE ARE CONSTRUCTOR FUNCTIONS

    //Generates train cards according to rule distribution
    //Returns shuffled list
    #getStartTrainCards() {
        //In order from manual
        let colors = ['Purple', 'White', 'Blue', 'Yellow', 'Orange', 'Black', 'Red', 'Green'];
        const NUM_EACH_COLOR = 12;

        let drawPile = [];
        for (let i = 0; i < colors.length; i++) {
            for (let j = 0; j < NUM_EACH_COLOR; j++) {
                drawPile.push(new TrainCard(colors[i]));
            }
        }
        const NUM_WILDS = 14;
        for (let i = 0; i < NUM_WILDS; i++) {
            drawPile.push(new TrainCard('Wild'));
        }
        drawPile = this.#shuffleDeck(drawPile);
        return drawPile;
    }
    
    //Generates all destination cards we want
    //TODO
    #getStartDestinationCards() {
        return [];
    }

    //Sets the first face-up cards visible to players
    #setStartFaceUpTrainCards() {
        const FACE_UP_NUM = 5; //From rulebook
        return this.drawTrainCards(FACE_UP_NUM)
    }

    //TEST FUNCTION FOR DEBUGGING IN CONSOLE
    getCardColorAmounts() {
        let dict = {'Purple': 0, 'White': 0, 'Blue': 0, 'Yellow': 0, 'Orange': 0, 'Black': 0, 'Red': 0, 'Green': 0, 'Wild': 0};
        for (let i = 0; i < this.trainCardDrawPile.length; i++) {
            dict[this.trainCardDrawPile[i]] += 1
        }
        return dict
    }
}

export default GameBoard;