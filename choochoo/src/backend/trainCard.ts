class TrainCard {
  color: string;

  constructor(color: string) {
    this.color = color;
  }

  getColor(): string {
    return this.color.toLowerCase();
  }

  toJSON() {
    return {
      color: this.color,
    };
  }

  static fromJSON(data: any): TrainCard {
    return new TrainCard(data.color);
  }
}

export default TrainCard;
