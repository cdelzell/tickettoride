import GameBoard from "./gameBoard";
import Player from "./player";
import User from "./user";
import TrainRoute from "./trainRoute";
import DestinationCard from "./destinationCard";
import { writeGameToDatabase } from "../firebase/FirebaseWriteGameData";
import { findGameByGameID } from "../firebase/FirebaseReadGameData";
import calculateGameScores from "./scoreCalculator";
import { ref, onValue } from "firebase/database";
import { database } from "../firebase/FirebaseCredentials";

const START_TRAIN_CARD_NUM = 4;

/**
 * GameRunner Class
 * This class manages the core game logic and state for a Ticket to Ride game.
 * It handles player turns, card management, route claiming, and game state synchronization.
 */
class GameRunner {
  /** Unique identifier for the game instance */
  gameID: number;
  /** Array of players participating in the game */
  players: Player[];
  /** The game board containing routes and cards */
  gameBoard: GameBoard;
  /** Index of the current player in the players array */
  currentPlayer: number;
  /** Flag indicating if the game has ended */
  gameOver: boolean;
  /** Array of destination cards available for drawing */
  destinationCardsToDraw: DestinationCard[];
  /** Function to unsubscribe from real-time updates */
  unsubscribe?: () => void;

  /**
   * Creates a new GameRunner instance
   * @param users - Array of usernames for players
   * @param lobbyCode - Unique identifier for the game lobby
   */
  constructor(users: string[], lobbyCode: number) {
    this.gameID = lobbyCode;
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

  /**
   * Draws a train card from the deck for the current player
   * Called when the deck is clicked and player has selected to draw a card
   */
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
  claimRoute(route: number, profilePic?: string): boolean {
    let player = this.players[this.currentPlayer];
    let routeObj = this.gameBoard.getRouteByIndex(route);
    if (!routeObj || !(routeObj instanceof TrainRoute)) {
      console.error("Invalid route index:", route);
      return false;
    }
    if (player.checkIfCanClaimRoute(routeObj)) {
      let usedCards = player.claimRoute(routeObj);
      routeObj.claimRoute(player.getId(), profilePic); // Pass the profile picture
      this.gameBoard.addDiscardsFromUsedTrainCards(usedCards);
      this.checkGameOverAfterRouteClaim();
      return true;
    }
    return false;
  }

  checkGameOverAfterRouteClaim() {
    //Check if the current player has ended the game through train consumption
    if (this.players[this.currentPlayer].getTrainAmount() < 3) {
      this.gameOver = true;
      return true;
    }

    //Check if any route is unclaimed
    for (const route of this.gameBoard.boardGraph.routes) {
      if (route.claimer === null) {
        return false;
      }
    }

    //There are no routes left to claim
    this.gameOver = true;
    return true;
  }

  getDestinationCardPossibilities(): DestinationCard[] {
    this.destinationCardsToDraw = this.gameBoard.drawDestinationCards(3);
    return this.destinationCardsToDraw;
  }

  claimDestinationCards(cards: DestinationCard[]) {
    // Move selected cards to player's hand
    for (const card of cards) {
      this.players[this.currentPlayer].destinationCardHand.push(card);
    }

    // Remove chosen cards from draw pile
    this.destinationCardsToDraw = this.destinationCardsToDraw.filter(
      (drawCard) =>
        !cards.some(
          (selectedCard) =>
            selectedCard.destination1 === drawCard.destination1 &&
            selectedCard.destination2 === drawCard.destination2
        )
    );
    // Add any unchosen cards back to game board
    this.gameBoard.addBackDestinationCards(this.destinationCardsToDraw);

    // Clear temporary draw pile
    this.destinationCardsToDraw = [];
  }
  moveDestinationCardsBackToDraw() {
    this.gameBoard.addBackDestinationCards(this.destinationCardsToDraw);
  }

  //Updates the current player once a turn ends
  //Called after any player ends turn
  updateCurrentPlayer() {
    if (this.currentPlayer == this.players.length - 1) {
      this.currentPlayer = 0;
    } else {
      this.currentPlayer += 1;
    }
    this.moveDestinationCardsBackToDraw();
  }

  //HERE IS ALL GETTER FUNCTIONS FOR FRONTEND STUFF

  /**
   * Returns the number of trains remaining for the main player
   * Called after a route claim to update the UI
   * @returns Number of trains remaining
   */
  getMainPlayerTrainCount(): number {
    return this.players[this.currentPlayer].getTrainAmount();
  }

  //Return the a dictionary with keys of colors as strings and values of the number of that card the cahracter has
  //Called after card drawn or route claimed
  getMainPlayerTrainCards(): number[] {
    return this.getOtherPlayerTrainCards(
      this.players[this.currentPlayer].getUsername()
    );
  }

  getOtherPlayerTrainCards(username: string): number[] {
    let player = this.players.find((p) => p.getUsername() === username);
    if (player) {
      let hand = player.getTrainCardHand();
      const order = [
        "red",
        "yellow",
        "black",
        "green",
        "purple",
        "blue",
        "brown",
        "white",
        "wild",
      ];
      const sortedList = order.map((color) => hand[color]);
      let handValues = Object.values(sortedList);
      return handValues;
    }

    return [];
  }

  //This gets the destination cards for the main player
  //Called after a player draws destination cards
  getPlayerDestinationCards(): DestinationCard[] {
    return this.players[this.currentPlayer].getDestinationCardHand();
  }

  /**
   * Returns the list of all players in the game
   * @returns Array of Player objects
   */
  getPlayers() {
    return this.players;
  }

  /**
   * Gets the number of trains remaining for a specific player
   * @param username - Username of the player to check
   * @returns Number of trains remaining for the specified player
   */
  getOtherPlayersTrainCount(username: string) {
    let player = this.players.find((p) => p.getUsername() === username);
    return player?.getTrainAmount();
  }

  /**
   * Gets the current face-up train cards
   * @returns Array of color names for the face-up cards
   */
  getFaceupTrainCards(): string[] {
    return this.gameBoard.getFaceupTrainCardsAsList();
  }

  //Gets the player who is now in charge of the game, so their profile can be highlighted
  //Called after any player's turn ends
  getCurrentPlayer() {
    return this.currentPlayer;
  }

  /**
   * Gets the current state of the game map
   * @returns Object containing route claim information
   */
  getMap() {
    return;
  }

  /**
   * Calculates and returns end game information including scores
   * @returns Object containing final scores and game statistics
   */
  getEndGameInfo() {
    return calculateGameScores(this.players, this.gameBoard.boardGraph);
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

  /**
   * Converts the game state to a JSON object for storage
   * @returns JSON representation of the game state
   */
  toJSON() {
    return {
      gameID: this.gameID,
      players: this.players.map((p) => p.toJSON?.() ?? p),
      gameBoard: this.gameBoard.toJSON?.() ?? this.gameBoard,
      currentPlayer: this.currentPlayer,
      gameOver: this.gameOver,
      destinationCardsToDraw: this.destinationCardsToDraw.map(
        (d) => d.toJSON?.() ?? d
      ),
    };
  }

  /**
   * Creates a GameRunner instance from JSON data
   * @param data - JSON data representing a game state
   * @returns New GameRunner instance
   */
  static fromJSON(data: any): GameRunner {
    const runner = Object.create(GameRunner.prototype) as GameRunner;

    runner.gameID = data.gameID ?? 0;
    runner.currentPlayer = data.currentPlayer ?? 0;
    runner.gameOver = data.gameOver ?? false;

    runner.players = Array.isArray(data.players)
      ? data.players.map((p: any) => Player.fromJSON(p))
      : [];

    runner.gameBoard = data.gameBoard
      ? GameBoard.fromJSON(data.gameBoard)
      : new GameBoard();

    runner.destinationCardsToDraw = Array.isArray(data.destinationCardsToDraw)
      ? data.destinationCardsToDraw.map((d: any) => DestinationCard.fromJSON(d))
      : [];

    return runner;
  }

  /**
   * Sends the current game state to the database
   * Called after a player ends their turn
   */
  sendToDatabase() {
    const json = this.toJSON();
    writeGameToDatabase(json, this.gameID);
  }

  /**
   * Updates the game state from the database
   * @param game_ID - ID of the game to update from
   * @returns Promise resolving to the updated game state
   */
  async updateFromDatabase(game_ID: number) {
    return findGameByGameID(game_ID, true);
  }

  /**
   * Starts listening for real-time updates from the database
   * @param callback - Function to call when updates are received
   */
  startListeningForUpdates(callback: (newGameRunner: GameRunner) => void) {
    const gameRef = ref(database, `activeGames/${this.gameID}`); //  correct path

    this.unsubscribe = onValue(gameRef, (snapshot) => {
      if (snapshot.exists()) {
        const rawData = snapshot.val();
        const newRunner = GameRunner.fromJSON(rawData); // deserialize immediately
        callback(newRunner);
        console.log(newRunner);
      }
    });
  }
}

export default GameRunner;
