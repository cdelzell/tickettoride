class DestinationCard {
  destination1: string;
  destination2: string;
  pointValue: number;

  constructor(destination1: string, destination2: string, pointValue: number) {
    this.destination1 = destination1;
    this.destination2 = destination2;
    this.pointValue = pointValue;
  }

  getDestinationsAsArray(): string[] {
    return [this.destination1, this.destination2];
  }

  getPointValue(): number {
    return this.pointValue;
  }

  toJSON() {
    return {
      destination1: this.destination1,
      destination2: this.destination2,
      pointValue: this.pointValue,
    };
  }

  static fromJSON(data: any): DestinationCard {
    return new DestinationCard(
      data.destination1,
      data.destination2,
      data.pointValue
    );
  }
}

export default DestinationCard;
