// __tests__/score-calculator.test.ts
import { calculateGameScores } from '../src/backend/scoreCalculator';
import Player from '../src/backend/player';
import BoardGraph from '../src/backend/boardGraph';
import TrainRoute from '../src/backend/trainRoute';
import DestinationCard from '../src/backend/destinationCard';

class MockPlayer extends Player {
  constructor(username: string, cards: DestinationCard[]) {
    super('mock-id', username, []);
    this.destinationCardHand = cards;
  }
}

class MockTrainRoute extends TrainRoute {
  constructor(
    dest1: string,
    dest2: string,
    length: number,
    color: string,
    claimer: string
  ) {
    super(dest1, dest2, length, color, '#000000', false, null, null);
    this.claimer = claimer;
  }

  getClaimer(): string {
    return this.claimer ?? '';
  }
  // inherit real getPointValue()
}

class MockBoardGraph extends BoardGraph {
  constructor(routes: TrainRoute[]) {
    super();
    this.routes = routes;
  }

  getRoutesForPlayer(username: string): TrainRoute[] {
    return this.routes.filter((route) => route.getClaimer() === username);
  }
}

class MockDestinationCard extends DestinationCard {
  constructor(a: string, b: string, points: number) {
    super(a, b, points);
  }
}

describe('calculateGameScores with real point mapping', () => {
  test('player gets points for connected destination card and route values', () => {
    const player = new MockPlayer('Alice', [
      new MockDestinationCard('A', 'C', 10),
    ]);
    const board = new MockBoardGraph([
      new MockTrainRoute('A', 'B', 4, 'Red', 'Alice'),
      new MockTrainRoute('B', 'C', 4, 'Red', 'Alice'),
    ]);
    // 4→7 points each: 7 + 7 + 10 = 24
    const scores = calculateGameScores([player], board);
    expect(scores['Alice']).toBe(24);
  });

  test('uncompleted destination subtracts points using real mapping', () => {
    const player = new MockPlayer('Bob', [
      new MockDestinationCard('X', 'Y', 7),
    ]);
    const board = new MockBoardGraph([
      new MockTrainRoute('X', 'Z', 3, 'Red', 'Bob'),
    ]);
    // 3→4 points; 4 - 7 = -3
    const scores = calculateGameScores([player], board);
    expect(scores['Bob']).toBe(-3);
  });

  test('multiple players with mixed completion and real mapping', () => {
    const alice = new MockPlayer('Alice', [
      new MockDestinationCard('A', 'B', 5),
    ]);
    const bob = new MockPlayer('Bob', [new MockDestinationCard('X', 'Y', 7)]);
    const board = new MockBoardGraph([
      new MockTrainRoute('A', 'B', 3, 'Red', 'Alice'),
      new MockTrainRoute('X', 'Z', 2, 'Red', 'Bob'),
    ]);
    // Alice: 3→4 + 5 = 9
    // Bob:   2→2 - 7 = -5
    const scores = calculateGameScores([alice, bob], board);
    expect(scores['Alice']).toBe(9);
    expect(scores['Bob']).toBe(-5);
  });

  test('completing a destination card A–C that crosses A–B–C', () => {
    const player = new MockPlayer('Player1', [
      new MockDestinationCard('A', 'C', 10),
    ]);
    const board = new MockBoardGraph([
      new MockTrainRoute('A', 'B', 3, 'Blue', 'Player1'),
      new MockTrainRoute('B', 'C', 3, 'Blue', 'Player1'),
    ]);
    // 3→4 points each: 4 + 4 + 10 = 18
    const scores = calculateGameScores([player], board);
    expect(scores['Player1']).toBe(18);
  });

  test('claims destination cards in two separate clusters', () => {
    const player = new MockPlayer('Player2', [
      new MockDestinationCard('X', 'Z', 8),
      new MockDestinationCard('P', 'R', 6),
    ]);
    const board = new MockBoardGraph([
      // Cluster 1: X–Y–Z
      new MockTrainRoute('X', 'Y', 2, 'Green', 'Player2'),
      new MockTrainRoute('Y', 'Z', 2, 'Green', 'Player2'),
      // Cluster 2: P–Q–R
      new MockTrainRoute('P', 'Q', 3, 'Yellow', 'Player2'),
      new MockTrainRoute('Q', 'R', 3, 'Yellow', 'Player2'),
    ]);
    // Routes: 2→2 + 2→2 + 3→4 + 3→4 = 12
    // Cards: 8 + 6 = 14
    // Total: 12 + 14 = 26
    const scores = calculateGameScores([player], board);
    expect(scores['Player2']).toBe(26);
  });

  test('cross-cluster destination card not claimed when clusters separated', () => {
    const player = new MockPlayer('Player3', [
      new MockDestinationCard('X', 'Z', 8),
      new MockDestinationCard('P', 'R', 6),
      new MockDestinationCard('Z', 'P', 12),
    ]);
    const board = new MockBoardGraph([
      // Cluster 1: X–Y–Z
      new MockTrainRoute('X', 'Y', 2, 'Green', 'Player3'),
      new MockTrainRoute('Y', 'Z', 2, 'Green', 'Player3'),
      // Cluster 2: P–Q–R
      new MockTrainRoute('P', 'Q', 3, 'Yellow', 'Player3'),
      new MockTrainRoute('Q', 'R', 3, 'Yellow', 'Player3'),
    ]);
    // Routes: 2→2 + 2→2 + 3→4 + 3→4 = 12
    // Cards: +8 +6 -12 = +2
    // Total: 12 + 2 = 14
    const scores = calculateGameScores([player], board);
    expect(scores['Player3']).toBe(14);
  });
});
