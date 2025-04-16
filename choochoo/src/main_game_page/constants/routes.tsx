import cities from "./cities";

export interface Route {
  source: City;
  target: City;
  dashed?: boolean;
  color?: string;
  game_color: string;
  trains: number;
  claimer?: string | null;
}

export interface City {
  name: string;
  x: number;
  y: number;
  color?: string;
}

// 29 routes

const routes: Route[] = [
  {
    source: cities[0],
    target: cities[1],
    dashed: true,
    color: "#b03517",
    game_color: "red",
    trains: 4,
  },
  {
    source: cities[1],
    target: cities[6],
    dashed: true,
    color: "#e6c10e",
    game_color: "yellow",
    trains: 3,
  },
  {
    source: cities[1],
    target: cities[5],
    dashed: true,
    color: "#1e1b1c",
    game_color: "black",
    trains: 5,
  },
  {
    source: cities[0],
    target: cities[13],
    dashed: true,
    color: "#72922e",
    game_color: "green",
    trains: 1,
  },
  {
    source: cities[1],
    target: cities[8],
    dashed: true,
    color: "#a77daf",
    game_color: "purple",
    trains: 2,
  },
  {
    source: cities[5],
    target: cities[8],
    dashed: true,
    color: "#519bdb",
    game_color: "blue",
    trains: 4,
  },
  {
    source: cities[7],
    target: cities[3],
    dashed: true,
    color: "#519bdb",
    game_color: "blue",
    trains: 3,
  }, // riddhi rapids to LA
  {
    source: cities[7],
    target: cities[4],
    dashed: true,
    color: "#c18135",
    game_color: "brown",
    trains: 3,
  }, // riddhi rapids to tyville

  {
    source: cities[4],
    target: cities[5],
    dashed: true,
    color: "#e6e5e3",
    game_color: "white",

    trains: 3,
  }, // ty ville to clara city
  {
    source: cities[2],
    target: cities[5],
    dashed: true,
    color: "#b03517",
    game_color: "red",
    trains: 3,
  }, // denver to clara city
  {
    source: cities[3],
    target: cities[2],
    dashed: true,
    color: "#e6c10e",
    game_color: "yellow",
    trains: 4,
  }, // LA to denver
  {
    source: cities[4],
    target: cities[2],
    dashed: true,
    color: "#1e1b1c",
    game_color: "black",
    trains: 3,
  }, // tyville to denver
  {
    source: cities[3],
    target: cities[8],
    dashed: true,
    color: "#72922e",
    game_color: "green",
    trains: 6,
  }, // LA to firestone rouge
  {
    source: cities[2],
    target: cities[8],
    dashed: true,
    color: "#a77daf",
    game_color: "purple",
    trains: 4,
  },
  {
    source: cities[6],
    target: cities[8],
    dashed: true,
    color: "#519bdb",
    game_color: "blue",
    trains: 5,
  }, // palo noah to firestone rouge
  {
    source: cities[14],
    target: cities[12],
    dashed: true,
    color: "#c18135",
    game_color: "brown",
    trains: 2,
  },
  {
    source: cities[11],
    target: cities[12],
    dashed: true,
    color: "#e6e5e3",
    game_color: "white",
    trains: 5,
  }, // phoenix to houston
  {
    source: cities[11],
    target: cities[3],
    dashed: true,
    color: "#b03517",
    game_color: "red",
    trains: 2,
  },
  {
    source: cities[11],
    target: cities[15],
    dashed: true,
    color: "#e6c10e",
    game_color: "yellow",
    trains: 1,
  },
  {
    source: cities[8],
    target: cities[14],
    dashed: true,
    color: "#1e1b1c",
    game_color: "black",
    trains: 1,
  },
  {
    source: cities[7],
    target: cities[9],
    dashed: true,
    color: "#72922e",
    game_color: "green",
    trains: 3,
  }, // rr to seattle
  {
    source: cities[5],
    target: cities[9],
    dashed: true,
    color: "#a77daf",
    game_color: "purple",
    trains: 6,
  }, // cc to seattle
  {
    source: cities[6],
    target: cities[10],
    dashed: true,
    color: "#519bdb",
    game_color: "blue",
    trains: 4,
  }, // pn to miami
  {
    source: cities[1],
    target: cities[13],
    dashed: true,
    color: "#c18135",
    game_color: "brown",
    trains: 4,
  }, //chicago to washington
  {
    source: cities[6],
    target: cities[13],
    dashed: true,
    color: "#e6e5e3",
    game_color: "white",
    trains: 4,
  }, //palo noah to washington
  {
    source: cities[6],
    target: cities[12],
    dashed: true,
    color: "#b03517",
    game_color: "red",
    trains: 5,
  }, //palo noah to houston
  {
    source: cities[15],
    target: cities[12],
    dashed: true,
    color: "#e6c10e",
    game_color: "yellow",
    trains: 5,
  }, //ALB to houston
  {
    source: cities[15],
    target: cities[14],
    dashed: true,
    color: "#1e1b1c",
    game_color: "black",
    trains: 3,
  }, //ALB to OC
  {
    source: cities[6],
    target: cities[14],
    dashed: true,
    color: "#72922e",
    game_color: "green",
    trains: 5,
  }, //palo noah to oc
];

export default routes;
