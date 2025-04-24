// __tests__/game-runner.test.ts
import GameRunner from '../src/backend/gameRunner';
import TrainCard from '../src/backend/trainCard';
import TrainRoute from '../src/backend/trainRoute';
import DestinationCard from '../src/backend/destinationCard';
import Player from '../src/backend/player';

// Mock FirebaseCredentials to avoid import.meta parsing error
jest.mock('../src/firebase/FirebaseCredentials', () => ({ database: {} }));

// Mock GameBoard for isolation
jest.mock('../src/backend/gameBoard', () => ({
  __esModule: true,
  default: class {
    drawSingleTrainCard = jest.fn();
    drawTrainCards = jest.fn((n: number) =>
      Array(n).fill(new TrainCard('red'))
    );
    takeFaceUpTrainCard = jest.fn();
    getRouteByIndex = jest.fn();
    drawDestinationCards = jest.fn();
    addBackDestinationCards = jest.fn();
    getFaceupTrainCardsAsList = jest.fn();
    addDiscardsFromUsedTrainCards = jest.fn();
    toJSON() {
      return { bg: true };
    }
    static fromJSON(data: any) {
      return new this();
    }
  },
}));

describe('GameRunner Unit Tests', () => {
  const users = ['Alice', 'Bob'];
  const lobbyCode = 123;
  let runner: GameRunner;
  let mockBoard: any;

  beforeEach(() => {
    runner = new GameRunner(users, lobbyCode);
    mockBoard = (runner as any).gameBoard;
    jest.clearAllMocks();
  });

  test('drawTrainCardsFromDeck adds top card', () => {
    const card = new TrainCard('blue');
    mockBoard.drawSingleTrainCard.mockReturnValue(card);
    const player = runner['players'][runner['currentPlayer']];
    const initial = player.getTrainCardHand().blue;
    runner.drawTrainCardsFromDeck();
    expect(player.getTrainCardHand().blue).toBe(initial + 1);
  });

  test('drawFaceupTrainCard adds correct faceup card', () => {
    const card = new TrainCard('green');
    mockBoard.takeFaceUpTrainCard.mockReturnValue(card);
    const player = runner['players'][runner['currentPlayer']];
    const initial = player.getTrainCardHand().green;
    runner.drawFaceupTrainCard(2);
    expect(player.getTrainCardHand().green).toBe(initial + 1);
  });

  test('claimRoute succeeds when claimable', () => {
    const route = new TrainRoute('A', 'B', 3, 'red', '#fff', false, null, null);
    mockBoard.getRouteByIndex.mockReturnValue(route);
    const result = runner.claimRoute(0, 'picUrl');
    const player = runner['players'][runner['currentPlayer']];
    expect(result).toBe(true);
    expect(route.getClaimer()).toBe(player.getId());
    expect(route.getClaimerProfilePic()).toBe('picUrl');
    expect(mockBoard.addDiscardsFromUsedTrainCards).toHaveBeenCalled();
  });

  test('claimRoute fails when unclaimable', () => {
    const route = new TrainRoute(
      'X',
      'Y',
      10,
      'black',
      '#000',
      false,
      null,
      null
    );
    mockBoard.getRouteByIndex.mockReturnValue(route);
    const before = { ...runner['players'][0].getTrainCardHand() };
    const result = runner.claimRoute(1);
    expect(result).toBe(false);
    expect(runner['players'][0].getTrainCardHand()).toEqual(before);
  });

  test('claimRoute sets gameOver when too few trains left', () => {
    const route = new TrainRoute(
      'M',
      'N',
      1,
      'blue',
      '#000',
      false,
      null,
      null
    );
    mockBoard.getRouteByIndex.mockReturnValue(route);
    runner['players'][0].trainAmount = 3;
    runner['players'][0].addTrainCardToHand(new TrainCard('blue'));
    const res = runner.claimRoute(0);
    expect(res).toBe(true);
    expect(runner['players'][0].getTrainAmount()).toBe(2);
    expect(runner['gameOver']).toBe(true);
  });

  test('getDestinationCardPossibilities draws and stores', () => {
    const cards = [
      new DestinationCard('A', 'B', 5),
      new DestinationCard('C', 'D', 6),
      new DestinationCard('E', 'F', 7),
    ];
    mockBoard.drawDestinationCards.mockReturnValue(cards);
    const drawn = runner.getDestinationCardPossibilities();
    expect(drawn).toEqual(cards);
    expect(runner['destinationCardsToDraw']).toEqual(cards);
  });

  test('claimDestinationCards moves and returns unselected', () => {
    const cards = [
      new DestinationCard('A', 'B', 5),
      new DestinationCard('C', 'D', 6),
      new DestinationCard('E', 'F', 7),
    ];
    runner['destinationCardsToDraw'] = [...cards];
    runner.claimDestinationCards([cards[0], cards[2]]);
    expect(runner['players'][0].getDestinationCardHand()).toEqual([
      cards[0],
      cards[2],
    ]);
    expect(mockBoard.addBackDestinationCards).toHaveBeenCalledWith([cards[1]]);
  });

  test('updateCurrentPlayer cycles', () => {
    runner['currentPlayer'] = 0;
    runner.updateCurrentPlayer();
    expect(runner.getCurrentPlayer()).toBe(1);
    runner.updateCurrentPlayer();
    expect(runner.getCurrentPlayer()).toBe(0);
  });

  test('frontend getters', () => {
    const p0 = runner['players'][0];
    p0.trainAmount = 12;
    expect(runner.getMainPlayerTrainCount()).toBe(12);
    expect(runner.getMainPlayerTrainCards().length).toBe(9);
    expect(runner.getOtherPlayersTrainCount('Bob')).toBe(
      runner['players'][1].getTrainAmount()
    );
    p0.destinationCardHand = [new DestinationCard('X', 'Y', 5)];
    expect(runner.getPlayerDestinationCards()).toEqual(
      p0.getDestinationCardHand()
    );
    expect(runner.getPlayers()).toBe(runner['players']);
    mockBoard.getFaceupTrainCardsAsList.mockReturnValue(['red', 'green']);
    expect(runner.getFaceupTrainCards()).toEqual(['red', 'green']);
  });

  describe('GameRunner JSON serialization', () => {
    test('toJSON returns correct JSON structure', () => {
      const lobbyCode = 123;
      const stubBG = { toJSON: () => ({ boardStub: true }) };
      runner['gameBoard'] = stubBG as any;
      runner['gameOver'] = true;
      runner['currentPlayer'] = 1;
      runner['destinationCardsToDraw'] = [new DestinationCard('X', 'Y', 5)];
      const json = runner.toJSON();
      expect(json).toHaveProperty('gameID', lobbyCode);
      expect(json).toHaveProperty('gameBoard', { boardStub: true });
      expect(json).toHaveProperty('currentPlayer', 1);
      expect(json).toHaveProperty('gameOver', true);
      expect(json.destinationCardsToDraw).toEqual([
        { destination1: 'X', destination2: 'Y', pointValue: 5 },
      ]);
      expect(Array.isArray(json.players)).toBe(true);
      expect(json.players).toHaveLength(2);
    });

    test('fromJSON recreates GameRunner correctly', () => {
      const playerJSON =
        runner['players'][0].toJSON?.() ?? runner['players'][0];
      const otherJSON = runner['players'][1].toJSON?.() ?? runner['players'][1];
      const sample = {
        gameID: 99,
        currentPlayer: 0,
        gameOver: false,
        players: [playerJSON, otherJSON],
        gameBoard: { boardStub: true },
        destinationCardsToDraw: [
          { destination1: 'A', destination2: 'B', pointValue: 8 },
        ],
      };
      const gr2 = GameRunner.fromJSON(sample);
      expect(gr2).toBeInstanceOf(GameRunner);
      expect(gr2.gameID).toBe(99);
      expect(gr2.currentPlayer).toBe(0);
      expect(gr2.gameOver).toBe(false);
      expect(gr2.players[0]).toBeInstanceOf(Player);
      expect(gr2.players[0].getUsername()).toBe(
        runner['players'][0].getUsername()
      );
      expect(gr2.destinationCardsToDraw[0]).toBeInstanceOf(DestinationCard);
      expect(gr2.destinationCardsToDraw[0].getPointValue()).toBe(8);
    });
  });
});
