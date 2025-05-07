import BoardGraph from "./boardGraph";
import Player from "./player";
import TrainRoute from "./trainRoute";

/**
 * Calculates final scores for all players based on routes claimed and destination card completed
 * @param players Array of Players
 * @param boardGraph Completed boardGraph of routes and destinations
 * @returns A record of player usernames to their final score
 */
export function calculateGameScores(
  players: Player[],
  boardGraph: BoardGraph
): { playerPoints: Record<string, number>; winner: string } {
  let playerPoints: Record<string, number> = {};
  let winner = "";
  let maxScore = -1;
  for (const player of players) {
    let score = calculatePlayerScore(player, boardGraph);
    if (score > maxScore) {
      winner = player.getUsername();
      maxScore = score;
    }
    playerPoints[player.getUsername()] = score;
  }

  return { playerPoints, winner };
}

/**
 * Calculates score of individiual player
 * @returns number final score value
 */
function calculatePlayerScore(player: Player, boardGraph: BoardGraph): number {
  let score =
    getPlayerPointsFromDestinationCards(player, boardGraph) +
    getPlayerPointsFromRouteValues(player.getUsername(), boardGraph);
  return score;
}

/**
 * Calculates the total score from claimed routes for a player
 * @param claimer The player who claimed routes
 * @param boardGraph The graph to pull routes from
 * @returns score as number
 */
function getPlayerPointsFromRouteValues(
  claimer: string,
  boardGraph: BoardGraph
): number {
  let score = 0;
  for (const route of boardGraph.getRoutesForPlayer(claimer)) {
    score += route.getPointValue();
  }
  return score;
}
/**
 * Calculates total score from completed destination cards
 * Subtracts incomplete destination cards from score
 * @param player Player object, contains destination cards to check
 * @param boardGraph Contains routes and destinations to check connections
 * @returns score as a positive or negative number
 */
function getPlayerPointsFromDestinationCards(
  player: Player,
  boardGraph: BoardGraph
): number {
  let score: number = 0;

  const routes = boardGraph.getRoutesForPlayer(player.getUsername());
  const networks = getConnectedNetworks(routes); //An array of sets of destinations that they've touched, put into sets based on how they're linked
  for (const card of player.getDestinationCardHandAsCards()) {
    const destinations = card.getDestinationsAsArray();
    if (isDestinationCardInNetworks(destinations, networks)) {
      score += card.getPointValue();
    } else {
      score -= card.getPointValue(); //Takes away points if they don't meet the card, leading to big negatives
    }
  }
  return score;
}

/**
 * Given routes, determines all destinations connected by those routes
 * Handles cases with several unconnected networks
 * Used for easy checking of destination card completeness
 * @param routes Array of routes to check connections
 * @returns An array of destination name sets, where all destinations in a set are somehow connected to each other
 */
function getConnectedNetworks(routes: TrainRoute[]): Set<string>[] {
  let networks: Set<string>[] = [];

  //Make networks containing all routes
  for (const route of routes) {
    const destinations = route.getDestinations();
    let matchingSets: number[] = [];

    //Check each network to see if it contains either of the destinations in the route
    for (let i = 0; i < networks.length; i++) {
      if (
        networks[i].has(destinations[0]) ||
        networks[i].has(destinations[1])
      ) {
        //If it does, add it to the list of matching sets
        matchingSets.push(i);
      }
    }

    if (matchingSets.length === 0) {
      //No networks matched, have to add a new network
      networks.push(new Set<string>(destinations));
    } else {
      //At least one network matched. Add to that network and combine matching networks
      //This handles the case that two networks become connected by this route
      let newNetwork = new Set<string>(destinations);
      for (const matchIndex of matchingSets.reverse()) {
        //Adds each destination from the old set to the new set
        for (const destination of networks[matchIndex]) {
          newNetwork.add(destination);
        }
        networks.splice(matchIndex, 1);
      }
      networks.push(newNetwork);
    }
  }

  return networks;
}

/**
 * Checks if a destination card is completed by any network of destinations
 * i.e. if both destinations from the card are in the network
 * @param destinations the two destinations from the card
 * @param networks The networks of destinations as a an array of sets of names
 * @returns boolean, true if complete
 */
function isDestinationCardInNetworks(
  destinations: string[],
  networks: Set<string>[]
): boolean {
  for (const network of networks) {
    if (network.has(destinations[0]) && network.has(destinations[1])) {
      return true;
    }
  }
  return false;
}

export default calculateGameScores;
