
import Destination from "./destination";
import TrainRoute from "./train-route";

const TEST_DESTINATIONS = [
    new Destination(1, '1', 0, 0),
    new Destination(2, '2', 100, 100)
]

const TEST_ROUTES = [
    new TrainRoute(1, 2, 5, 'Red')
]

class BoardGraph {
    constructor() {
        this.destinations = this.#makeDestinations()
        this.routes = this.#makeRoutes()
    }

    #makeDestinations() {
        this.destinations = TEST_DESTINATIONS;
    }

    #makeRoutes() {
        this.routes = TEST_ROUTES;
    }

    getRouteGraphForPlayer(playerId) {
        const claimedRoutes = this.routes.filter(r => r.claimer === playerId);
        
    }
}

export default BoardGraph;