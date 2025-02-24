class Player {
    constructor(user, trainCards) {
        this.user = user;
        this.trainCardHand = this.setStarterTrainCards(trainCards);
        this.destinationCardHand = [];
        this.trainAmount;
        this.scoredPoints = 0;
    }

    setStarterTrainCards(trainCards) {
        let hand = {'Purple': 0, 'White': 0, 'Blue': 0, 'Yellow': 0, 'Orange': 0, 'Black': 0, 'Red': 0, 'Green': 0, 'Wild': 0};
        for (let i = 0; i < trainCards.length; i++) {
            hand[trainCards[i].getColor()] += 1;
        }
        return hand;
    }

    addTrainCardToHand(trainCard) {
        this.trainCardHand[trainCard.getColor()] += 1;
    }

    addMultipleTrainCardsToHand(trainCards) {
        for (let i = 0; i < trainCards.length; i++) {
            this.addTrainCardToHand(trainCards[i]);
        }
    }
}

export default Player