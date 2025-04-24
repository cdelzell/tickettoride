// __tests__/gameboard.test.ts
import GameBoard from '../src/backend/game-board';
import TrainCard from '../src/backend/train-card';
import DestinationCard from '../src/backend/destination-card';
import BoardGraph from '../src/backend/board-graph';

describe('GameBoard (with subclass mocks)', () => {
  // Subclass mocks for full type compatibility
  class MockTrainCard extends TrainCard {
    constructor(color: string) {
      super(color);
    }
  }

  class MockDestinationCard extends DestinationCard {
    constructor(a: string, b: string, pointValue: number) {
      super(a, b, pointValue);
    }
  }

  class MockBoardGraph {
    toJSON() {
      return { stub: true };
    }
    static fromJSON(_data: any) {
      return new BoardGraph();
    }
  }

  class MockGameBoard extends GameBoard {
    constructor(
      public trainCardDrawPile: TrainCard[],
      public trainCardDiscardPile: TrainCard[],
      public destinationCardDrawPile: DestinationCard[],
      public faceUpTrainCards: TrainCard[]
    ) {
      super();
      // Override the internal boardGraph with our stub
      this.boardGraph = new MockBoardGraph() as any;
      // Override piles
      this.trainCardDrawPile = trainCardDrawPile;
      this.trainCardDiscardPile = trainCardDiscardPile;
      this.destinationCardDrawPile = destinationCardDrawPile;
      this.faceUpTrainCards = faceUpTrainCards;
    }
  }

  let gb: MockGameBoard;
  let red: MockTrainCard, blue: MockTrainCard, green: MockTrainCard;
  let destA: MockDestinationCard, destB: MockDestinationCard;

  beforeEach(() => {
    red = new MockTrainCard('red');
    blue = new MockTrainCard('blue');
    green = new MockTrainCard('green');
    destA = new MockDestinationCard('X', 'Y', 5);
    destB = new MockDestinationCard('A', 'B', 7);

    // default empty piles
    gb = new MockGameBoard([], [], [], []);
  });

  test('drawSingleTrainCard removes & returns the top card', () => {
    gb.trainCardDrawPile = [red, blue];
    const card = gb.drawSingleTrainCard();
    expect(card).toBe(red);
    expect(gb.trainCardDrawPile).toEqual([blue]);
  });

  test('drawTrainCards removes & returns top N cards', () => {
    gb.trainCardDrawPile = [red, blue, green];
    const drawn = gb.drawTrainCards(2);
    expect(drawn).toEqual([red, blue]);
    expect(gb.trainCardDrawPile).toEqual([green]);
  });

  test('drawTrainCards reshuffles discard into draw when needed', () => {
    gb.trainCardDrawPile = [red];
    gb.trainCardDiscardPile = [blue];

    // force deterministic shuffle
    const realRandom = Math.random;
    Math.random = () => 0;

    const drawn = gb.drawTrainCards(2);

    Math.random = realRandom;

    // ensure both cards drawn (order agnostic after shuffle)
    expect(new Set(drawn)).toEqual(new Set([red, blue]));
    expect(gb.trainCardDrawPile).toHaveLength(0);
    expect(gb.trainCardDiscardPile).toHaveLength(0);
  });

  test('drawTrainCards returns empty array if no cards available', () => {
    gb.trainCardDrawPile = [];
    gb.trainCardDiscardPile = [];
    expect(gb.drawTrainCards(3)).toEqual([]);
  });

  test('drawDestinationCards removes & returns top destination cards', () => {
    gb.destinationCardDrawPile = [destA, destB];
    const drawn = gb.drawDestinationCards(1);
    expect(drawn).toEqual([destA]);
    expect(gb.destinationCardDrawPile).toEqual([destB]);
  });

  test('drawDestinationCards returns empty array when none left', () => {
    gb.destinationCardDrawPile = [];
    expect(gb.drawDestinationCards(2)).toEqual([]);
  });

  test('addBackDestinationCards adds cards to bottom of deck', () => {
    gb.destinationCardDrawPile = [destA];
    gb.addBackDestinationCards([destB]);
    expect(gb.destinationCardDrawPile).toEqual([destA, destB]);
  });

  test('takeFaceUpTrainCard replaces the taken card with a draw', () => {
    const yellow = new MockTrainCard('yellow');
    gb.faceUpTrainCards = [red, blue];
    gb.trainCardDrawPile = [yellow];

    const taken = gb.takeFaceUpTrainCard(1);
    expect(taken).toBe(blue);
    expect(gb.faceUpTrainCards[1]).toBe(yellow);
  });

  test('takeFaceUpTrainCard shuffles discard into draw when draw empty', () => {
    gb.faceUpTrainCards = [red];
    gb.trainCardDrawPile = [];
    gb.trainCardDiscardPile = [blue];

    const taken = gb.takeFaceUpTrainCard(0);
    expect(taken).toBe(red);
    expect(gb.faceUpTrainCards[0]).toBe(blue);
    expect(gb.trainCardDiscardPile).toHaveLength(0);
  });

  test('getFaceupTrainCardsAsList returns array of color strings', () => {
    gb.faceUpTrainCards = [red, green];
    expect(gb.getFaceupTrainCardsAsList()).toEqual(['red', 'green']);
  });

  test('addDiscardsFromUsedTrainCards appends TrainCard instances', () => {
    gb.trainCardDiscardPile = [];
    gb.addDiscardsFromUsedTrainCards(['purple', 'wild']);
    expect(gb.trainCardDiscardPile).toHaveLength(2);
    expect(gb.trainCardDiscardPile[0]).toBeInstanceOf(TrainCard);
    expect(gb.trainCardDiscardPile[0].getColor()).toBe('purple');
    expect(gb.trainCardDiscardPile[1].getColor()).toBe('wild');
  });

  describe('GameBoard JSON serialization', () => {
    test('toJSON outputs correct structure and uses stubbed boardGraph', () => {
      const red = new MockTrainCard('red');
      const blue = new MockTrainCard('blue');
      const green = new MockTrainCard('green');
      const destA = new MockDestinationCard('X', 'Y', 5);
      const destB = new MockDestinationCard('A', 'B', 7);

      // Inject deterministic state
      const board = new MockGameBoard(
        [red, blue], // draw pile
        [green], // discard pile
        [destA, destB], // destination pile
        [red] // face-up cards
      );

      const json = board.toJSON();

      // Top-level keys
      expect(json).toHaveProperty('boardGraph');
      expect(json).toHaveProperty('trainCardDrawPile');
      expect(json).toHaveProperty('trainCardDiscardPile');
      expect(json).toHaveProperty('destinationCardDrawPile');
      expect(json).toHaveProperty('faceUpTrainCards');

      // boardGraph should use the stub
      expect(json.boardGraph).toEqual({ stub: true });

      // Piles should serialize correctly
      expect(json.trainCardDrawPile).toEqual([
        expect.objectContaining({ color: 'red' }),
        expect.objectContaining({ color: 'blue' }),
      ]);
      expect(json.trainCardDiscardPile).toEqual([
        expect.objectContaining({ color: 'green' }),
      ]);
      expect(json.destinationCardDrawPile).toEqual([
        { destination1: 'X', destination2: 'Y', pointValue: 5 },
        { destination1: 'A', destination2: 'B', pointValue: 7 },
      ]);
      expect(json.faceUpTrainCards).toEqual([
        expect.objectContaining({ color: 'red' }),
      ]);
    });

    test('fromJSON reconstructs GameBoard with correct instances', () => {
      const sample = {
        boardGraph: { any: 'data' },
        trainCardDrawPile: [{ color: 'red' }, { color: 'blue' }],
        trainCardDiscardPile: [{ color: 'green' }],
        destinationCardDrawPile: [
          { destination1: 'X', destination2: 'Y', pointValue: 5 },
        ],
        faceUpTrainCards: [{ color: 'yellow' }],
      };

      const copy = GameBoard.fromJSON(sample);
      expect(copy).toBeInstanceOf(GameBoard);

      // Verify draw pile
      expect(copy.trainCardDrawPile).toHaveLength(2);
      expect(copy.trainCardDrawPile[0]).toBeInstanceOf(TrainCard);
      expect((copy.trainCardDrawPile[0] as any).getColor()).toBe('red');

      // Verify discard pile
      expect(copy.trainCardDiscardPile[0]).toBeInstanceOf(TrainCard);
      expect((copy.trainCardDiscardPile[0] as any).getColor()).toBe('green');

      // Verify destination pile
      expect(copy.destinationCardDrawPile[0]).toBeInstanceOf(DestinationCard);
      expect(copy.destinationCardDrawPile[0].getDestinationsAsArray()).toEqual([
        'X',
        'Y',
      ]);
      expect(copy.destinationCardDrawPile[0].getPointValue()).toBe(5);

      // Verify face-up cards
      expect(copy.faceUpTrainCards[0]).toBeInstanceOf(TrainCard);
      expect((copy.faceUpTrainCards[0] as any).getColor()).toBe('yellow');
    });

    test('round-trip toJSON→fromJSON preserves card data', () => {
      const red = new MockTrainCard('red');
      const blue = new MockTrainCard('blue');
      const dest = new MockDestinationCard('X', 'Y', 5);

      const orig = new MockGameBoard([red], [blue], [dest], [red]);
      const obj = orig.toJSON();
      const clone = GameBoard.fromJSON(obj);

      // Colors and point values should match
      expect((clone.trainCardDrawPile[0] as any).getColor()).toBe('red');
      expect((clone.trainCardDiscardPile[0] as any).getColor()).toBe('blue');
      expect(clone.destinationCardDrawPile[0].getPointValue()).toBe(5);
      expect((clone.faceUpTrainCards[0] as any).getColor()).toBe('red');
    });
  });
});
