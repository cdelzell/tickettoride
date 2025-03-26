
import Destination from "./destination";
import TrainRoute from "./train-route";

const TEST_DESTINATIONS = [
    new Destination('1', '1', 0, 0),
    new Destination('2', '2', 100, 100)
];

const TEST_ROUTES = [
    new TrainRoute('1', '2', 5, 'Red')
]

class BoardGraph {
    destinations: Destination[];
    routes: TrainRoute[]

    constructor() {
        this.destinations = this.#makeDestinations();
        this.routes = this.#makeRoutes();
    }

    #makeDestinations(): Destination[] {
        return TEST_DESTINATIONS;
    }

    #makeRoutes(): TrainRoute[] {
        return TEST_ROUTES;
    }

    getRouteGraphForPlayer(playerId: string) {
        const claimedRoutes = this.routes.filter(r => r.claimer === playerId);
        
    }

    getRouteByIndex(index: number) {
        return this.routes[index];
    }
}

export default BoardGraph;