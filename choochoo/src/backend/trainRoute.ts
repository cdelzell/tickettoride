//Relates length of a route to its point value
//Key = length, value = point value
const point_vals = new Map<number, number>([
  [1, 1],
  [2, 2],
  [3, 4],
  [4, 7],
  [5, 10],
  [6, 15],
]);

/**
 * TrainRoute class
 * This class holds the information for a single train route connecting two destinations
 */
class TrainRoute {
  destination1: string;
  destination2: string;
  length: number; //Number of trains required to claim
  gameColor: string; //For backend, used for train card comparison
  hexColor: string; //For frontend display
  dashed: boolean; //For frontend display, faalse (solid) if claimed
  claimer: string | null;
  claimerProfilePic: string | null; //Used for frontend display

  constructor(
    destination1: string,
    destination2: string,
    length: number,
    gameColor: string,
    hexColor: string,
    dashed: boolean,
    claimer: string | null,
    claimerProfilePic: string | null
  ) {
    this.destination1 = destination1;
    this.destination2 = destination2;
    this.length = length;
    this.gameColor = gameColor;
    this.hexColor = hexColor;
    this.dashed = dashed;
    this.claimer = claimer ?? null;
    this.claimerProfilePic = claimerProfilePic ?? null;
  }

  getLength() {
    return this.length;
  }

  getGameColor() {
    return this.gameColor;
  }

  getHexColor() {
    return this.hexColor;
  }

  /*
    Given a player, claims the route and updates necessary
  */
  claimRoute(playerId: string, profilePic?: string) {
    this.claimer = playerId;
    if (profilePic) {
      this.claimerProfilePic = profilePic;
    }
  }

  /*
    Gets the point value of the route based on the length
    These are usually different numbers
  */
  getPointValue(): number {
    return point_vals.get(this.length) ?? 0;
  }

  getDestinations(): string[] {
    return [this.destination1, this.destination2];
  }

  getClaimer(): string | null {
    return this.claimer;
  }

  toJSON() {
    return {
      destination1: this.destination1,
      destination2: this.destination2,
      length: this.length,
      gameColor: this.gameColor,
      hexColor: this.hexColor,
      dashed: this.dashed,
      claimer: this.claimer,
      claimerProfilePic: this.claimerProfilePic,
    };
  }

  static fromJSON(data: any): TrainRoute {
    const route = new TrainRoute(
      data.destination1,
      data.destination2,
      data.length,
      data.gameColor,
      data.hexColor,
      data.dashed,
      data.claimer,
      data.claimerProfilePic
    );
    route.claimer = data.claimer ?? null;
    return route;
  }

  getClaimerProfilePic(): string | null {
    return this.claimerProfilePic;
  }
}

export default TrainRoute;
