//Relates length of a route to its point value
//Key = length, value = point value
const point_vals = {
    1: 1,
    2: 2,
    3: 4,
    4: 7,
    5: 10,
    6: 15
}

class TrainRoute {
    constructor(destination1, destination2, length, color) {
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

    claimRoute(playerId) {
        this.claimer = playerId;
    }

    getPointValue() {
        return point_vals[length]
    }
}
export default TrainRoute;