// __tests__/score-calculator.test.ts
import { calculateGameScores } from "../src/backend/scoreCalculator";
import Player from "../src/backend/player";
import BoardGraph from "../src/backend/boardGraph";
import TrainRoute from "../src/backend/trainRoute";
import DestinationCard from "../src/backend/destinationCard";

class MockPlayer extends Player {
  constructor(username: string, cards: DestinationCard[]) {
    super("mock-id", username, []);
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
    super(dest1, dest2, length, color, "#000000", false, null, null);
    this.claimer = claimer;
  }

  getClaimer(): string {
    return this.claimer ?? "";
  }
  // Inherit real getPointValue(), which uses the point_vals map:
  // 1→1, 2→2, 3→4, 4→7, 5→10, 6→15
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

describe("calculateGameScores with real point mapping", () => {
  test("player gets points for connected destination card and route values", () => {
    const player = new MockPlayer("Alice", [
      new MockDestinationCard("A", "C", 10),
    ]);

    const board = new MockBoardGraph([
      new MockTrainRoute("A", "B", 4, "Red", "Alice"),
      new MockTrainRoute("B", "C", 4, "Red", "Alice"),
    ]);

    // length=4 → 7 points each: 7 + 7 + 10 = 24
    const scores = calculateGameScores([player], board);
    expect(scores["Alice"]).toBe(24);
  });

  test("uncompleted destination subtracts points using real mapping", () => {
    const player = new MockPlayer("Bob", [
      new MockDestinationCard("X", "Y", 7),
    ]);

    const board = new MockBoardGraph([
      new MockTrainRoute("X", "Z", 3, "Red", "Bob"),
    ]);

    // length=3 → 4 points; 4 - 7 = -3
    const scores = calculateGameScores([player], board);
    expect(scores["Bob"]).toBe(-3);
  });

  test("multiple players with mixed completion and real mapping", () => {
    const alice = new MockPlayer("Alice", [
      new MockDestinationCard("A", "B", 5),
    ]);
    const bob = new MockPlayer("Bob", [new MockDestinationCard("X", "Y", 7)]);

    const board = new MockBoardGraph([
      new MockTrainRoute("A", "B", 3, "Red", "Alice"),
      new MockTrainRoute("X", "Z", 2, "Red", "Bob"),
    ]);

    // Alice: length=3 → 4 + 5 = 9
    // Bob:   length=2 → 2 - 7 = -5
    const scores = calculateGameScores([alice, bob], board);
    expect(scores["Alice"]).toBe(9);
    expect(scores["Bob"]).toBe(-5);
  });
});
