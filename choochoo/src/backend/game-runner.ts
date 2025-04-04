import GameBoard from './game-board';
import Player from './player';
import User from './user';
import TrainRoute from './train-route';
import DestinationCard from './destination-card';
import { writeGameToDatabase } from '../Firebase/FirebaseWriteGameData';
import { findGameByGameID } from '../Firebase/FirebaseReadGameData';

const START_TRAIN_CARD_NUM = 4;

class GameRunner {
  gameID: number;
  players: Player[];
  gameBoard: GameBoard;
  currentPlayer: number;
  gameOver: boolean;
  destinationCardsToDraw: DestinationCard[];

  constructor(users: User[]) {
    this.gameID = Math.random();
    this.gameBoard = new GameBoard();
    this.players = [];
    for (let i = 0; i < users.length; i++) {
      this.players.push(
        new Player(
          i.toString(),
          users[i],
          this.gameBoard.drawTrainCards(START_TRAIN_CARD_NUM)
        )
      );
    }
    this.currentPlayer = 0;
    this.gameOver = false;
    this.destinationCardsToDraw = [];
  }

  //PLAN PLAN PLAN
  //Functions to handle player action:
  //draw_train_card_from_deck ✓
  //      Called when deck is clicked (users have already selected draw card)
  //draw_faceup_card(index) ✓
  //      Called when a faceup card is clicked (users have already selected draw card)
  //claim_route(route) ✓
  //      Called when route claimed (users have already selected claim route)
  //get_destination_card_possibilities ✓
  //      Called when users select claiming a route
  //claim_destination_cards(list of indexes) ✓
  //      Called when users select destination cards to take (always after get_destination_card_possibilities)
  //update_current_player ✓
  //      Called when player's turn ends and it moves to the next one
  //
  //
  //
  //Functions to get info for the frontend
  //get_player_train_count ✓
  //      Called after route claim
  //get_player_train_cards ✓
  //      Called after card drawn, route claim
  //      Return numeric array of cards in order
  //get_player_destination_cards ✓
  //      Called after destination card claim (or maybe every time they cycle through a destination card?)
  //get_other_players_train_count(player) ✓
  //      Called after other player's turn is finished (during board retrieval update)
  //get_faceup_train_cards ✓
  //      Called after card drawn, other player's turn is finished
  //get_map ✓
  //      Called after route claimed, other player's turn finished
  //get_current_player ✓
  //      Get current player index, called after any player's turn ends
  //
  //I'll tell you what you need to tell gamerunner when things happen
  //Format for the getter functions
  //
  //
  //Handling game over:
  //I'm not sure how to do this right now. Maybe when a route is claimed, game over checks are run and a boolean is flipped?
  //Then the frontend checks, or is told, that the game finished and displays winners.
  //Not sure how to make it work with the server though. Maybe the gameover thing also calls a turn finished thing, which contacts the server.
  //Then when the server sends the file to all other players, the first thing that's checked is that boolean. If it's flipped, then they also display game over and contact the server to add stats.

  //Called when deck is clicked
  drawTrainCardsFromDeck() {
    let card = this.gameBoard.drawSingleTrainCard();
    this.players[this.currentPlayer].addTrainCardToHand(card);
  }

  //Called when a faceup card is clicked
  drawFaceupTrainCard(index: number) {
    let card = this.gameBoard.takeFaceUpTrainCard(index);
    this.players[this.currentPlayer].addTrainCardToHand(card);
  }

  //Called when route claimed during route claiming steps.
  //This relies
  claimRoute(route: number): boolean {
    let player = this.players[this.currentPlayer];
    let routeObj = this.gameBoard.getRouteByIndex(route);
    if (player.checkIfCanClaimRoute(routeObj)) {
      let usedCards = player.claimRoute(routeObj);
      routeObj.claimRoute(player.getId());
      this.gameBoard.addDiscardsFromUsedTrainCards(usedCards);
      this.checkGameOverAfterRouteClaim();
      return true;
    }
    return false;
  }

  checkGameOverAfterRouteClaim() {
    if (this.players[this.currentPlayer].getTrainAmount() < 3) {
      this.gameOver = true;
    }
  }

  getDestinationCardPossibilities(): DestinationCard[] {
    this.destinationCardsToDraw = this.gameBoard.drawDestinationCards(3);
    return this.destinationCardsToDraw;
  }

  claimDestinationCards(indices: number[]) {
    //Adds cards back to player and removes them from here.
    for (const index of indices) {
      this.players[this.currentPlayer].destinationCardHand.push(
        this.destinationCardsToDraw[index]
      );
      this.destinationCardsToDraw.splice(index, 1);
    }

    //Let gameboard handle adding cards back
    this.gameBoard.addBackDestinationCards(this.destinationCardsToDraw);

    //Empty out the temporary draw pile
    this.destinationCardsToDraw = [];
  }

  //Updates the current player once a turn ends
  //Called after any player ends turn
  updateCurrentPlayer() {
    if (this.currentPlayer == this.players.length - 1) {
      this.currentPlayer = 0;
    } else {
      this.currentPlayer += 1;
    }
  }

  //HERE IS ALL GETTER FUNCTIONS FOR FRONTEND STUFF

  //Returns the number of trains the main player has left
  //Called only after a route claim
  getMainPlayerTrainCount(): number {
    return this.players[this.currentPlayer].getTrainAmount();
  }

  //Return the a dictionary with keys of colors as strings and values of the number of that card the cahracter has
  //Called after card drawn or route claimed
  getMainPlayerTrainCards(): number[] {
    let hand = this.players[this.currentPlayer].getTrainCardHand();
    let handValues = Object.values(hand);
    return handValues;
  }

  //This gets the destination cards for the main player
  //Called after a player draws destination cards
  getPlayerDestinationCards(): string[] {
    return this.players[this.currentPlayer].getDestinationCardHand();
  }

  //Returns the number of trains another player (not the main player) has left
  //Needs the username of a player as a string
  //Called after another player's turn ends
  getOtherPlayersTrainCount(username: string) {
    let player = this.players.find((p) => p.getUsername() === username);
    return player?.getTrainAmount();
  }

  //Gets a list of 5 strings representing color names for each of the faceup cards in slots 1-5
  //Called after card drawn, other player's turn is finished
  getFaceupTrainCards(): string[] {
    return this.gameBoard.getFaceupTrainCardsAsList();
  }

  //Gets the player who is now in charge of the game, so their profile can be highlighted
  //Called after any player's turn ends
  getCurrentPlayer() {
    return this.currentPlayer;
  }

  //TODO Return in the format they want.
  //Called after route claimed or other player's turn finished
  //Should return who has claims to which routes. Need to index routes?
  getMap() {
    return;
  }

  //HERE IS EVERYTHING FOR SERVER COMMUNICATION/UPDATING
  //Here is a list of things that need updating after every player's turn\
  //--Whether or not the game is over (boolean)
  //--The current player
  //--The faceup cards
  //--The state of the draw pile (number of train cards of each color)
  //--The state of the discard pile (number of train cards of each color)
  //--The state of the destination card draw pile (which ones are left)
  //--game-boards' board-graphs' routes' claimers
  //--Every player's train cards
  //--Every player's destination cards
  //--Every player's trains left
  //--The index of the current player
  //
  //It's important to note that the frontend will only need to handle route claimer updates, current player updates, other player's trains left updates, and game over updates when it is not their turn
  //Any updates to the UI that happen on their turn should be handled already by button events, which is nice.
  //This is just to update the gamerunner object

  //I imagine this to be called after the player who owns this instance of gamerunner ends their turn. It will package everything up and send it to the database to update its version of the game
  sendToDatabase(game/*: gameObjectType*/) {
    writeGameToDatabase(game);
  }

  //This needs to happen after any other player's turn ends. The database needs to send all above information, and this gamerunner needs to update it.
  //The frontend also needs to become aware of the above mentioned things somehow.
  async updateFromDatabase(gameID: number) {
    return findGameByGameID(gameID, false);
  }
}

export default GameRunner;
