/**
 * DesinationCard class
 * Represents a destination on the game board
 * Contains information about the destination name, coordinates, and methods for accessing it
 */
class Destination {
  /** The name of the destination */
  name: string;
  /** The x-coordinate of the destination */
  x: number;
  /** The y-coordinate of the destination */
  y: number;

  constructor(name: string, x: number, y: number) {
    this.name = name;
    this.x = x;
    this.y = y;
  }

  /**
   * Gets the name of the destination
   * @returns The name of the destination
   */
  getName() {
    return this.name;
  }
}

export default Destination;
