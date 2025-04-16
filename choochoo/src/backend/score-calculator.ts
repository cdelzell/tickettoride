import BoardGraph from './board-graph';
import Player from './player';
import TrainRoute from './train-route';
import DestinationCard from './destination-card';

function calculateGameScores(
  players: Player[],
  boardGraph: BoardGraph
): { [key: string]: number } {
  let playerPoints: { [key: string]: number } = {};
  for (const player of players) {
    let score = calculatePlayerScore(player, boardGraph);
    playerPoints[player.getUsername()] = score;
  }

  return playerPoints;
}

function calculatePlayerScore(player: Player, boardGraph: BoardGraph): number {
  let score =
    getPlayerPointsFromDestinationCards(player, boardGraph) +
    getPlayerPointsFromRouteValues(player.getId(), boardGraph);
  return score;
}

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

function getPlayerPointsFromDestinationCards(
  player: Player,
  boardGraph: BoardGraph
): number {
  let score: number = 0;

  const routes = boardGraph.getRoutesForPlayer(player.getId());
  const networks = getConnectedNetworks(routes); //An array of sets of destinations that they've touched, put into sets based on how they're linked
  for (const card of player.getDestinationCardHandAsCards()) {
    const destinations = card.getDestinationsAsArray();
    if (isDestinationCardInNetworks(destinations, networks)) {
      score += card.getPointValue();
    } else {
      score -= card.getPointValue(); //OPTIONAL, MAY WANT TO REMOVE. Takes away points if they don't meet the card, leading to big negatives
    }
  }
  return score;
}

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
  }

  return networks;
}

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
