// __tests__/player.test.ts
import Player from '../src/backend/player';
import TrainCard from '../src/backend/trainCard';
import TrainRoute from '../src/backend/trainRoute';
import DestinationCard from '../src/backend/destinationCard';

class MockTrainRoute extends TrainRoute {
  constructor(
    dest1: string,
    dest2: string,
    length: number,
    color: string,
    claimer: string | null
  ) {
    super(dest1, dest2, length, color, '#000000', false, null, null);
    this.claimer = claimer;
  }
}

describe('Player class', () => {
  let player: Player;

  beforeEach(() => {
    // no starter cards
    player = new Player('0', 'TestUser', []);
  });

  test('initial trainCardHand starts with zeros for all colors', () => {
    const hand = player.getTrainCardHand();
    const colors = [
      'red',
      'yellow',
      'black',
      'green',
      'purple',
      'blue',
      'brown',
      'white',
      'wild',
    ];
    for (const color of colors) {
      expect(hand[color]).toBe(0);
    }
  });

  test('addTrainCardToHand increments the correct color and leaves others unchanged', () => {
    // dummy card implementing getColor()
    const redCard = new TrainCard('red');
    player.addTrainCardToHand(redCard);

    const hand = player.getTrainCardHand();
    expect(hand.red).toBe(1);
    // others still zero
    expect(hand.wild).toBe(0);
    expect(hand.blue).toBe(0);
  });

  describe('checkIfCanClaimRoute', () => {
    test('returns true when enough colored cards', () => {
      const route = new MockTrainRoute('A', 'B', 3, 'red', null);
      player.trainCardHand['red'] = 3;
      const result = player.checkIfCanClaimRoute(route);
      expect(result).toBe(true);
    });

    test('returns true when enough wild cards', () => {
      const length = 4;
      player.trainCardHand['wild'] = 4;
      player.trainCardHand['blue'] = 0;
      const route = new MockTrainRoute('X', 'Y', length, 'blue', null);
      expect(player.checkIfCanClaimRoute(route)).toBe(true);
    });

    test('returns true when combination of color and wild meets length', () => {
      const length = 5;
      player.trainCardHand['purple'] = 2;
      player.trainCardHand['wild'] = 3;
      const route = new MockTrainRoute('M', 'N', length, 'purple', null);
      expect(player.checkIfCanClaimRoute(route)).toBe(true);
    });

    test('returns false when insufficient cards', () => {
      player.trainCardHand['yellow'] = 1;
      player.trainCardHand['wild'] = 1;
      const route = new MockTrainRoute('P', 'Q', 3, 'yellow', null);
      expect(player.checkIfCanClaimRoute(route)).toBe(false);
    });

    test('returns false if route is already claimed', () => {
      const route = new MockTrainRoute('A', 'B', 2, 'red', null);
      route.claimRoute('SomeoneElse');
      player.trainCardHand['red'] = 2;
      player.trainCardHand['wild'] = 0;
      expect(player.checkIfCanClaimRoute(route)).toBe(false);
    });
  });

  describe('claimRoute', () => {
    test('uses colored cards before wilds and updates trainCardHand and trainAmount', () => {
      player.trainCardHand['red'] = 2;
      player.trainCardHand['wild'] = 2;
      const route = new TrainRoute(
        'A',
        'B',
        3,
        'red',
        '#000000',
        false,
        null,
        null
      );

      const initialHand = { ...player.getTrainCardHand() };
      const initialTrains = player.getTrainAmount();

      const used = player.claimRoute(route);
      expect(used).toEqual(['red', 'red', 'wild']);

      // Hand updated
      expect(player.getTrainCardHand().red).toBe(initialHand.red - 2);
      expect(player.getTrainCardHand().wild).toBe(initialHand.wild - 1);

      // Train amount reduced by route length
      expect(player.getTrainAmount()).toBe(initialTrains - 3);
    });

    test('returns empty array and does not mutate when passed invalid route', () => {
      const fake = {} as any;
      const beforeHand = { ...player.getTrainCardHand() };
      const beforeTrains = player.getTrainAmount();

      const used = player.claimRoute(fake);
      expect(used).toEqual([]);
      expect(player.getTrainCardHand()).toEqual(beforeHand);
      expect(player.getTrainAmount()).toBe(beforeTrains);
    });
  });
});

describe('Player JSON serialization', () => {
  test('toJSON returns a plain object with all fields', () => {
    const startCards = [
      new TrainCard('red'),
      new TrainCard('wild'),
      new TrainCard('red'),
    ];
    const p = new Player('p42', 'JsonUser', startCards);
    // mutate a bit
    p.addDestinationCardToHand({
      destination1: 'X',
      destination2: 'Y',
      pointValue: 8,
    });
    p.trainAmount = 30;

    const obj = p.toJSON();
    // It should be a POJO, not a Player instance
    expect(typeof obj).toBe('object');
    expect(obj).not.toBeInstanceOf(Player);

    // Check key fields
    expect(obj.id).toBe('p42');
    expect(obj.username).toBe('JsonUser');
    expect(obj.trainAmount).toBe(30);

    // trainCardHand should reflect the three starter cards
    expect(obj.trainCardHand.red).toBe(2);
    expect(obj.trainCardHand.wild).toBe(1);

    // destinationCardHand should be an array of JSON-ed cards
    expect(Array.isArray(obj.destinationCardHand)).toBe(true);
    expect(obj.destinationCardHand[0]).toEqual({
      destination1: 'X',
      destination2: 'Y',
      pointValue: 8,
    });
  });

  test('fromJSON reconstructs a Player with the same state', () => {
    // start with an object shaped like what toJSON gives you
    const data = {
      id: 'p99',
      username: 'Bob',
      trainCardHand: {
        red: 1,
        yellow: 2,
        black: 0,
        green: 0,
        purple: 0,
        blue: 0,
        brown: 0,
        white: 0,
        wild: 1,
      },
      destinationCardHand: [
        { destination1: 'A', destination2: 'B', pointValue: 5 },
      ],
      trainAmount: 20,
    };

    const p2 = Player.fromJSON(data);

    // It should be an actual Player instance
    expect(p2).toBeInstanceOf(Player);
    expect(p2.getId()).toBe('p99');
    expect(p2.getUsername()).toBe('Bob');
    expect(p2.getTrainAmount()).toBe(20);

    // The trainCardHand property should be copied over
    expect(p2.getTrainCardHand().yellow).toBe(2);
    expect(p2.getTrainCardHand().wild).toBe(1);

    // And the destination cards should be real DestinationCard instances
    const dests = p2.getDestinationCardHand();
    expect(dests.length).toBe(1);
    expect(dests[0]).toBeInstanceOf(DestinationCard);
    expect(dests[0].getPointValue()).toBe(5);
    expect(dests[0].getDestinationsAsArray()).toEqual(['A', 'B']);
  });

  test('round‑trip: fromJSON(toJSON(p)) yields equivalent state', () => {
    const p = new Player('pRT', 'RoundTrip', []);
    p.addDestinationCardToHand({
      destination1: 'M',
      destination2: 'N',
      pointValue: 4,
    });
    p.trainAmount = 33;

    const obj = p.toJSON();
    const copy = Player.fromJSON(obj);

    expect(copy.getId()).toBe(p.getId());
    expect(copy.getUsername()).toBe(p.getUsername());
    expect(copy.getTrainAmount()).toBe(p.getTrainAmount());
    expect(copy.getTrainCardHand()).toEqual(p.getTrainCardHand());

    // Check dest cards
    expect(copy.getDestinationCardHandAsCards().length).toBe(
      p.getDestinationCardHandAsCards().length
    );
    expect(copy.getDestinationCardHandAsCards()[0].getPointValue()).toBe(
      p.getDestinationCardHandAsCards()[0].getPointValue()
    );
  });
});
