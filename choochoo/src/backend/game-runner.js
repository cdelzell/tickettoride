import GameBoard from './game-board.js'

class GameRunner {
    constructor(users) {
        this.gameBoard = new GameBoard;
        this.players = []
        for (let i = 0; i < length(users); i++) {
            this.players.push(new Player(users[i], this.gameBoard.drawTrainCards(5)))
        }
    }
}