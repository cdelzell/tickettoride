import GameBoard from "./gameBoard";
import Player from "./player";
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
 * This class contains all backend logic and state management for a single game
 * Players and the gameboard, along with all cards, are stored and manipulated through here
 * This class also determines how the backend hooks into the frontend
 * This logic is compartmentalized into functions the frontend can call after specific game events
 * All frontend getter functions are setup to return formats most useable for frontend
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
    //users is a list of usernames
    this.gameID = lobbyCode;
    this.gameBoard = new GameBoard(); //Handles all card initialization
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

  /*
    Called when deck is clicked
  */
  drawTrainCardsFromDeck() {
    let card = this.gameBoard.drawSingleTrainCard();
    this.players[this.currentPlayer].addTrainCardToHand(card);
  }

  /*
    Called when a faceup card is clicked
  */
  drawFaceupTrainCard(index: number) {
    let card = this.gameBoard.takeFaceUpTrainCard(index);
    if (card) {
      this.players[this.currentPlayer].addTrainCardToHand(card);
    }
  }

  /*
    Called when route claimed during route claiming steps
    Relies on the route numbers in the backend being the same as how they are portrayed in the frontend
  */
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

  /*
    Called by self when a route is claimed to see if the game should finish
  */
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

  /*
    Gets the three destination cards the user can choose from when drawing
    Removes them from deck and adds them to a new pile to allow for easier tracking and selection
    Any cards not chosen need to be added back to the original pile
  */
  getDestinationCardPossibilities(): DestinationCard[] {
    this.destinationCardsToDraw = this.gameBoard.drawDestinationCards(3);
    return this.destinationCardsToDraw;
  }

  /*
    Called when a user submits their destination card choses on the frontend
  */
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

  /*
    Updates the current player once a turn ends
    Called after any player ends turn
  */
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

  /*
    Return a dictionary with keys of colors as strings and values of the number of that card the cahracter has
    Called after card drawn or route claimed
  */
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

  /*
    This gets the destination cards for the main player
    Called after a player draws destination cards
  */
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

  /*
    Gets the player who is now in charge of the game, so their profile can be highlighted
    Called after any player's turn ends
  */
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
  /*
    Handles logic for serializing this object into a storable state.
    This can be sent to the database and pulled by other players
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
        //console.log(newRunner); //For debug purposes to see the gamerunner
      }
    });
  }
}

export default GameRunner;
