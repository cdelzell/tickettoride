class Destination {
  name: string;
  x: number;
  y: number;
  constructor(name: string, x: number, y: number) {
    this.name = name;
    this.x = x;
    this.y = y;
  }

  getName() {
    return this.name;
  }
}

export default Destination;
