import TrainRoute from "./trainRoute";
import Destination from "./destination";

/**
 * Hardcoded destinations for the whole map
 * Order is important for establishing routes!
 */
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

/**
 * Hardcoded routes for the whole map (0-28)
 * Order is important for the rest of the code!
 */
export const Routes: TrainRoute[] = [
  new TrainRoute(
    Cities[0].getName(),
    Cities[1].getName(),
    4,
    "red",
    "#b03517",
    true,
    null,
    null
  ), // ny to chicago
  new TrainRoute(
    Cities[1].getName(),
    Cities[6].getName(),
    3,
    "yellow",
    "#e6c10e",
    true,
    null,
    null
  ),
  new TrainRoute(
    Cities[1].getName(),
    Cities[5].getName(),
    5,
    "black",
    "#1e1b1c",
    true,
    null,
    null
  ),
  new TrainRoute(
    Cities[0].getName(),
    Cities[13].getName(),
    1,
    "green",
    "#72922e",
    true,
    null,
    null
  ),
  new TrainRoute(
    Cities[1].getName(),
    Cities[8].getName(),
    2,
    "purple",
    "#a77daf",
    true,
    null,
    null
  ),
  new TrainRoute(
    Cities[5].getName(),
    Cities[8].getName(),
    4,
    "blue",
    "#519bdb",
    true,
    null,
    null
  ),
  new TrainRoute(
    Cities[7].getName(),
    Cities[3].getName(),
    3,
    "blue",
    "#519bdb",
    true,
    null,
    null
  ), // riddhi rapids to LA
  new TrainRoute(
    Cities[7].getName(),
    Cities[4].getName(),
    3,
    "brown",
    "#c18135",
    true,
    null,
    null
  ), // riddhi rapids to tyville
  new TrainRoute(
    Cities[4].getName(),
    Cities[5].getName(),
    3,
    "white",
    "#e6e5e3",
    true,
    null,
    null
  ), // ty ville to clara city
  new TrainRoute(
    Cities[2].getName(),
    Cities[5].getName(),
    3,
    "red",
    "#b03517",
    true,
    null,
    null
  ), // denver to clara city
  new TrainRoute(
    Cities[3].getName(),
    Cities[2].getName(),
    4,
    "yellow",
    "#e6c10e",
    true,
    null,
    null
  ), // LA to denver
  new TrainRoute(
    Cities[4].getName(),
    Cities[2].getName(),
    3,
    "black",
    "#1e1b1c",
    true,
    null,
    null
  ), // tyville to denver
  new TrainRoute(
    Cities[3].getName(),
    Cities[8].getName(),
    6,
    "green",
    "#72922e",
    true,
    null,
    null
  ), // LA to firestone rouge
  new TrainRoute(
    Cities[2].getName(),
    Cities[8].getName(),
    4,
    "purple",
    "#a77daf",
    true,
    null,
    null
  ),
  new TrainRoute(
    Cities[6].getName(),
    Cities[8].getName(),
    5,
    "blue",
    "#519bdb",
    true,
    null,
    null
  ), // palo noah to firestone rouge
  new TrainRoute(
    Cities[14].getName(),
    Cities[12].getName(),
    2,
    "brown",
    "#c18135",
    true,
    null,
    null
  ),
  new TrainRoute(
    Cities[11].getName(),
    Cities[12].getName(),
    5,
    "white",
    "#e6e5e3",
    true,
    null,
    null
  ), // phoenix to houston
  new TrainRoute(
    Cities[11].getName(),
    Cities[3].getName(),
    2,
    "red",
    "#b03517",
    true,
    null,
    null
  ),
  new TrainRoute(
    Cities[11].getName(),
    Cities[15].getName(),
    1,
    "yellow",
    "#e6c10e",
    true,
    null,
    null
  ),
  new TrainRoute(
    Cities[8].getName(),
    Cities[14].getName(),
    1,
    "black",
    "#1e1b1c",
    true,
    null,
    null
  ),
  new TrainRoute(
    Cities[7].getName(),
    Cities[9].getName(),
    3,
    "green",
    "#72922e",
    true,
    null,
    null
  ), // rr to seattle
  new TrainRoute(
    Cities[5].getName(),
    Cities[9].getName(),
    6,
    "purple",
    "#a77daf",
    true,
    null,
    null
  ), // cc to seattle
  new TrainRoute(
    Cities[6].getName(),
    Cities[10].getName(),
    4,
    "blue",
    "#519bdb",
    true,
    null,
    null
  ), // pn to miami
  new TrainRoute(
    Cities[1].getName(),
    Cities[13].getName(),
    4,
    "brown",
    "#c18135",
    true,
    null,
    null
  ), // chicago to washington
  new TrainRoute(
    Cities[6].getName(),
    Cities[13].getName(),
    4,
    "white",
    "#e6e5e3",
    true,
    null,
    null
  ), // palo noah to washington
  new TrainRoute(
    Cities[6].getName(),
    Cities[12].getName(),
    5,
    "red",
    "#b03517",
    true,
    null,
    null
  ), // palo noah to houston
  new TrainRoute(
    Cities[15].getName(),
    Cities[12].getName(),
    5,
    "yellow",
    "#e6c10e",
    true,
    null,
    null
  ), // ALB to houston
  new TrainRoute(
    Cities[15].getName(),
    Cities[14].getName(),
    3,
    "black",
    "#1e1b1c",
    true,
    null,
    null
  ), // ALB to OC
  new TrainRoute(
    Cities[6].getName(),
    Cities[14].getName(),
    5,
    "green",
    "#72922e",
    true,
    null,
    null
  ), // palo noah to OC
];
