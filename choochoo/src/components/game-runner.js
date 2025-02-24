import GameBoard from './game-board.js'
import Player from './player.js'

const START_TRAIN_CARD_NUM = 5;

class GameRunner {
    constructor(users) {
        this.gameBoard = new GameBoard;
        this.players = []
        for (let i = 0; i < users.length; i++) {
            this.players.push(new Player(users[i], this.gameBoard.drawTrainCards(START_TRAIN_CARD_NUM)))
        }
    }
}

export default GameRunner;