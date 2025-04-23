import Destination from "./destination";
import TrainRoute from "./trainRoute";
import { Routes } from "./hardcodedMap";
import { Cities } from "./hardcodedMap";

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
      // serialize each route via its own toJSON (we’ll expand it next)
      routes: this.routes.map((r) => r.toJSON()),
    };
  }

  static fromJSON(data: any): BoardGraph {
    // 1) Always build your defaults first
    const graph = new BoardGraph();

    if (Array.isArray(data.routes)) {
      graph.routes = data.routes.map((r: any) => TrainRoute.fromJSON(r));
    }

    return graph;
  }
}

export default BoardGraph;
