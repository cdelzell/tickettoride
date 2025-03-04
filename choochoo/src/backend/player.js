class Player {
    constructor(user, trainCards) {
        this.user = user;
        this.trainCardHand = trainCards;
        this.destinationCardHand = [];
        this.trainAmount;
        this.scoredPoints = 0;
    }
}


let player = new Player(null)