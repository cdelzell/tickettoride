import TrainRoute from "./train-route";
import Destination from "./destination";

export const Cities: Destination[] = [
  new Destination("New York", 504, 153), // 0
  new Destination("Chicago", 382, 150), // 1
  new Destination("Denver", 230, 185), // 2
  new Destination("Los Angeles", 89, 212), // 3
  new Destination("Tyville", 175, 120), // 4
  new Destination("Clara City", 270, 90), // 5
  new Destination("Palo Noah", 430, 250), // 6
  new Destination("Riddhi Rapids", 76, 120), // 7
  new Destination("Firestone Rouge", 340, 195), // 8
  new Destination("Seattle", 110, 55), // 9
  new Destination("Miami", 475, 325), // 10
  new Destination("Phoenix", 165, 240), // 11
  new Destination("Houston", 315, 300), // 12
  new Destination("Washington", 485, 192), // 13
  new Destination("Oklahoma City", 300, 233), // 14
  new Destination("Albuquerque", 220, 232), // 15
];

export const Routes: TrainRoute[] = [
  new TrainRoute(Cities[0].getName(), Cities[1].getName(), 4, "red", "#b03517"), // ny to chicago
  new TrainRoute(
    Cities[1].getName(),
    Cities[6].getName(),
    3,
    "yellow",
    "#e6c10e"
  ),
  new TrainRoute(
    Cities[1].getName(),
    Cities[5].getName(),
    5,
    "black",
    "#1e1b1c"
  ),
  new TrainRoute(
    Cities[0].getName(),
    Cities[13].getName(),
    1,
    "green",
    "#72922e"
  ),
  new TrainRoute(
    Cities[1].getName(),
    Cities[8].getName(),
    2,
    "purple",
    "#a77daf"
  ),
  new TrainRoute(
    Cities[5].getName(),
    Cities[8].getName(),
    4,
    "blue",
    "#519bdb"
  ),
  new TrainRoute(
    Cities[7].getName(),
    Cities[3].getName(),
    3,
    "blue",
    "#519bdb"
  ), // riddhi rapids to LA
  new TrainRoute(
    Cities[7].getName(),
    Cities[4].getName(),
    3,
    "brown",
    "#c18135"
  ), // riddhi rapids to tyville
  new TrainRoute(
    Cities[4].getName(),
    Cities[5].getName(),
    3,
    "white",
    "#e6e5e3"
  ), // ty ville to clara city
  new TrainRoute(Cities[2].getName(), Cities[5].getName(), 3, "red", "#b03517"), // denver to clara city
  new TrainRoute(
    Cities[3].getName(),
    Cities[2].getName(),
    4,
    "yellow",
    "#e6c10e"
  ), // LA to denver
  new TrainRoute(
    Cities[4].getName(),
    Cities[2].getName(),
    3,
    "black",
    "#1e1b1c"
  ), // tyville to denver
  new TrainRoute(
    Cities[3].getName(),
    Cities[8].getName(),
    6,
    "green",
    "#72922e"
  ), // LA to firestone rouge
  new TrainRoute(
    Cities[2].getName(),
    Cities[8].getName(),
    4,
    "purple",
    "#a77daf"
  ),
  new TrainRoute(
    Cities[6].getName(),
    Cities[8].getName(),
    5,
    "blue",
    "#519bdb"
  ), // palo noah to firestone rouge
  new TrainRoute(
    Cities[14].getName(),
    Cities[12].getName(),
    2,
    "brown",
    "#c18135"
  ),
  new TrainRoute(
    Cities[11].getName(),
    Cities[12].getName(),
    5,
    "white",
    "#e6e5e3"
  ), // phoenix to houston
  new TrainRoute(
    Cities[11].getName(),
    Cities[3].getName(),
    2,
    "red",
    "#b03517"
  ),
  new TrainRoute(
    Cities[11].getName(),
    Cities[15].getName(),
    1,
    "yellow",
    "#e6c10e"
  ),
  new TrainRoute(
    Cities[8].getName(),
    Cities[14].getName(),
    1,
    "black",
    "#1e1b1c"
  ),
  new TrainRoute(
    Cities[7].getName(),
    Cities[9].getName(),
    3,
    "green",
    "#72922e"
  ), // rr to seattle
  new TrainRoute(
    Cities[5].getName(),
    Cities[9].getName(),
    6,
    "purple",
    "#a77daf"
  ), // cc to seattle
  new TrainRoute(
    Cities[6].getName(),
    Cities[10].getName(),
    4,
    "blue",
    "#519bdb"
  ), // pn to miami
  new TrainRoute(
    Cities[1].getName(),
    Cities[13].getName(),
    4,
    "brown",
    "#c18135"
  ), // chicago to washington
  new TrainRoute(
    Cities[6].getName(),
    Cities[13].getName(),
    4,
    "white",
    "#e6e5e3"
  ), // palo noah to washington
  new TrainRoute(
    Cities[6].getName(),
    Cities[12].getName(),
    5,
    "red",
    "#b03517"
  ), // palo noah to houston
  new TrainRoute(
    Cities[15].getName(),
    Cities[12].getName(),
    5,
    "yellow",
    "#e6c10e"
  ), // ALB to houston
  new TrainRoute(
    Cities[15].getName(),
    Cities[14].getName(),
    3,
    "black",
    "#1e1b1c"
  ), // ALB to OC
  new TrainRoute(
    Cities[6].getName(),
    Cities[14].getName(),
    5,
    "green",
    "#72922e"
  ), // palo noah to OC
];
