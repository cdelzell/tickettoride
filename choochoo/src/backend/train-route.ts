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

class TrainRoute {
  destination1: string;
  destination2: string;
  length: number;
  gameColor: string;
  hexColor: string;
  claimer: string | null;
  claimerProfilePic: string | null;

  constructor(
    destination1: string,
    destination2: string,
    length: number,
    gameColor: string,
    hexColor: string
  ) {
    this.destination1 = destination1;
    this.destination2 = destination2;
    this.length = length;
    this.gameColor = gameColor;
    this.hexColor = hexColor;
    this.claimer = null;
    this.claimerProfilePic = null;
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

  claimRoute(playerId: string, profilePic?: string) {
    this.claimer = playerId;
    if (profilePic) {
      this.claimerProfilePic = profilePic;
    }
  }

  getPointValue(): number {
    return point_vals.get(this.length) ?? 0;
  }

  getDestinations(): string[] {
    return [this.destination1, this.destination2];
  }

  getClaimer(): string | null {
    return this.claimer;
  }

  getClaimerProfilePic(): string | null {
    return this.claimerProfilePic;
  }
}

export default TrainRoute;