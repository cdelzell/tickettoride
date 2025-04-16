class TrainCard {
  color: string;

  constructor(color: string) {
    this.color = color;
  }

  getColor(): string {
    return this.color;
  }
}

export default TrainCard;