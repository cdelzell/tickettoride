import TrainCard from './train-card.js'

class GameBoard {
    constructor() {
        this.players = players;
        this.trainCardDrawPile = getStartTrainCards;
        this.destinationCardDrawPile = [];
        this.trainCardDiscardPile = [];
    }

    //Generates train cards according to rule distribution
    //Returns shuffled list
    getStartTrainCards() {
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

        drawPile = this.shuffleDeck(drawPile);
    }

    shuffleDeck(deck) {
        for (let i = deck.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            [deck[i], deck[j]] = [deck[j], deck[i]];
        }
    }

    //TODO: Handle deck reshuffling, maybe refactor to make more sense, maybe make some of this stuff private?
    drawCardsFromDeck(type, numCards) {
        let returnPile = [];
        for (let i = 0; i < numCards; i++) {
            if (type == 'train') {
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
        return this.drawCardsFromDeck('train', 1)[0];
    }

    drawTrainCards(numCards) {
        return this.drawCardsFromDeck('train', numCards);
    }

    drawDestinationCards(numCards) {
        return this.drawCardsFromDeck('destination', numCards);
    }
}