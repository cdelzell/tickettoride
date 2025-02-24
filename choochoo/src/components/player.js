class Player {
    constructor(user, trainCards) {
        this.user = user;
        this.trainCardHand = this.setStarterTrainCards(trainCards);
        this.destinationCardHand = [];
        this.trainAmount;
        this.scoredPoints = 0;
    }

    addTrainCardToHand(trainCard) {
        this.trainCardHand[trainCard.getColor()] += 1;
    }

    addMultipleTrainCardsToHand(trainCards) {
        for (let i = 0; i < trainCards.length; i++) {
            this.addTrainCardToHand(trainCards[i]);
        }
    }
    
    //Simple check to see if a player has enough cards of a route's type to claim it
    //Includes wild card functionality
    //TODO: A way to tell players they are going to use wild cards
    checkIfCanClaimRoute(route) {
        if (this.trainCardHand[route.getColor()] + this.trainCardHand['Wild'] >= route.getLength()) {
            return true;
        }
        return false;
    }

    //Claims a route by removing the right number of colored cards from their hand. Supports wilds.
    //Returns an array of cards used.
    claimRoute(route) {
        let usedTrainCardColors = []
        for (let i = 0; i < route.getLength(); i++) {
            let routeColor = route.getColor()
            if (this.trainCardHand[routeColor] > 0) {
                this.trainCardHand[routeColor] -= 1;
                usedTrainCardColors.push(routeColor);
            }
            else {
                this.trainCardHand['Wild'] -= 1;
                usedTrainCardColors.push('Wild');
            }
        }
        return usedTrainCardColors;
    }
    
    setStarterTrainCards(trainCards) {
        let hand = {'Purple': 0, 'White': 0, 'Blue': 0, 'Yellow': 0, 'Orange': 0, 'Black': 0, 'Red': 0, 'Green': 0, 'Wild': 0};
        for (let i = 0; i < trainCards.length; i++) {
            hand[trainCards[i].getColor()] += 1;
        }
        return hand;
    }

}

export default Player