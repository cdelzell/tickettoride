import Destination from "./destination";
import TrainRoute from "./train-route";
import { Routes } from "./hardcoded-map";
import { Cities } from "./hardcoded-map";

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
        returnVals.push("none");
      } else {
        returnVals.push(claimer);
      }
    }

    return returnVals;
  }

  toJSON() {
    return {
      routeClaimers: this.routes.map((r) => r.getClaimer()),
    };
  }

  static fromJSON(data: any): BoardGraph {
    const graph = new BoardGraph();
    const claimers = data.routeClaimers ?? [];

    for (let i = 0; i < claimers.length; i++) {
      if (claimers[i]) {
        graph.routes[i].claimRoute(claimers[i]);
      }
    }

    return graph;
  }
}

export default BoardGraph;
