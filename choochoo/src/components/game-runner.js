import GameBoard from './game-board.js'
import Player from './player.js'

const START_TRAIN_CARD_NUM = 4;

class GameRunner {
    constructor(users) {
        this.gameBoard = new GameBoard;
        this.players = []
        for (let i = 0; i < users.length; i++) {
            this.players.push(new Player(i, users[i], this.gameBoard.drawTrainCards(START_TRAIN_CARD_NUM)))
        }
    }

    claimRoute(route, player) {
        if (player.checkIfCanClaimRoute(route)) {
            let usedCards = player.claimRoute(route);
            route.claimRoute(player.getId())
            this.gameBoard.addDiscardsFromUsedTrainCards(usedCards);
            return true;
        }
        return false;
    }
}

export default GameRunner;