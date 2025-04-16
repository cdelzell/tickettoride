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
  color: string;
  claimer: string | null;

  constructor(
    destination1: string,
    destination2: string,
    length: number,
    color: string
  ) {
    //Store destination ids
    this.destination1 = destination1;
    this.destination2 = destination2;
    this.length = length;
    this.color = color;
    this.claimer = null; //Will be set when claimed
  }

  getLength() {
    return this.length;
  }

  getColor() {
    return this.color;
  }

  claimRoute(playerId: string) {
    this.claimer = playerId;
  }

  getPointValue(): number {
    return point_vals.get(this.length) ?? 0;
  }

  getDestinations(): string[] {
    return [this.destination1, this.destination2];
  }
}
export default TrainRoute;
