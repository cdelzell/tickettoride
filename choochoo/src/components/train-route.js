class TrainRoute {
    constructor(destination1, destination2, length, color) {
        this.destination1 = destination1;
        this.destination2 = destination2;
        this.length = length;
        this.color = color;
    }

    getLength() {
        return this.length;
    }

    getColor() {
        return this.color;
    }
}
export default TrainRoute;