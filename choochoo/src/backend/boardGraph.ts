import Destination from "./destination";
import TrainRoute from "./trainRoute";
import { Routes } from "./hardcodedMap";
import { Cities } from "./hardcodedMap";

class BoardGraph {
  destinations: Destination[];
  routes: TrainRoute[];

  /**
   * Constructor for BoardGraph
   * Initializes the destinations and routes for the board
   */
  constructor() {
    this.destinations = this.#makeDestinations();
    this.routes = this.#makeRoutes();
  }
  /**
   * Creates the destinations for the board
   * @returns Array of Destination objects
   */
  #makeDestinations(): Destination[] {
    return Cities;
  }

  /**
   * Creates the routes for the board
   * @returns Array of TrainRoute objects
   */
  #makeRoutes(): TrainRoute[] {
    return Routes;
  }

  /**
   * Gets the routes claimed by a specific player
   * @param name - Name of the player
   * @returns Array of TrainRoute objects claimed by the player
   */   
  getRoutesForPlayer(name: string): TrainRoute[] {
    const claimedRoutes = this.routes.filter((r) => r.claimer === name);
    return claimedRoutes;
  }

  /**
   * Gets a route by its index
   * @param index - Index of the route
   * @returns TrainRoute object at the specified index
   */ 
  getRouteByIndex(index: number): TrainRoute {
    return this.routes[index];
  }

  /**
   * Gets the claimers for all routes
   * @returns Array of claimers for all routes
   */
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
