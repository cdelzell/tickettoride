import Destination from './destination';
import TrainRoute from './train-route';
import { Routes } from './hardcoded-map';
import { Cities } from './hardcoded-map';

class BoardGraph {
  destinations: Destination[];
  routes: TrainRoute[];

  constructor() {
    this.destinations = this.#makeDestinations();
    this.routes = this.#makeRoutes();
  }

  #makeDestinations(): Destination[] {
    return Cities;
  }

  #makeRoutes(): TrainRoute[] {
    return Routes;
  }

  getRoutesForPlayer(name: string): TrainRoute[] {
    const claimedRoutes = this.routes.filter((r) => r.claimer === name);
    return claimedRoutes;
  }

  getRouteByIndex(index: number): TrainRoute {
    return this.routes[index];
  }

  getRoutesForFrontend(): string[] {
    let returnVals: string[] = [];
    for (const route of this.routes) {
      let claimer = route.getClaimer();
      if (claimer === null) {
        returnVals.push('none');
      } else {
        returnVals.push(claimer);
      }
    }

    return returnVals;
  }
}

export default BoardGraph;
