import GameBoard from './game-board'
import Player from './player'
import User from './user';
import TrainRoute from './train-route';

const START_TRAIN_CARD_NUM = 4;

class GameRunner {
    players: Player[];
    gameBoard: GameBoard;

    constructor(users: User[]) {
        this.gameBoard = new GameBoard;
        this.players = []
        for (let i = 0; i < users.length; i++) {
            this.players.push(new Player(i.toString(), users[i], this.gameBoard.drawTrainCards(START_TRAIN_CARD_NUM)))
        }
    }

    claimRoute(route: TrainRoute, player: Player) {
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