import {
  albMiami,
  albTyville,
  chicagoMiami,
  chicagoPhoenix,
  claraHouston,
  claraLa,
  claraNy,
  denverPalo,
  firestonePhoenix,
  firestoneRiddhi,
  miamiRiddhi,
  nyHouston,
  nyOklahoma,
  nyTyville,
  paloLa,
  paloPhoenix,
  seattleAlb,
  seattleHouston,
  tyvillePalo,
  tyvillePhoenix,
  tyvilleWash,
  washDenver,
} from "@/image_imports";

export interface DestinationCardInfo {
  destination1: string;
  destination2: string;
  points: number;
  imagePath: string; // this is now a URL from an imported image
}

const destination_cards: DestinationCardInfo[] = [
  { destination1: "Albuquerque", destination2: "Miami", points: 11, imagePath: albMiami },
  { destination1: "Albuquerque", destination2: "Tyville", points: 9, imagePath: albTyville },
  { destination1: "Chicago", destination2: "Miami", points: 7, imagePath: chicagoMiami },
  { destination1: "Chicago", destination2: "Phoenix", points: 11, imagePath: chicagoPhoenix },
  { destination1: "Clara City", destination2: "Houston", points: 9, imagePath: claraHouston },
  { destination1: "Clara City", destination2: "Los Angeles", points: 9, imagePath: claraLa },
  { destination1: "Clara City", destination2: "New York", points: 10, imagePath: claraNy },
  { destination1: "Denver", destination2: "Palo Noah", points: 9, imagePath: denverPalo },
  { destination1: "Albuquerque", destination2: "Phoenix", points: 9, imagePath: firestonePhoenix },
  { destination1: "Firestone Rouge", destination2: "Phoenix", points: 8, imagePath: firestonePhoenix },
  { destination1: "Firestone Rouge", destination2: "Riddhi Rapids", points: 9, imagePath: firestoneRiddhi },
  { destination1: "Miami", destination2: "Riddhi Rapids", points: 18, imagePath: miamiRiddhi },
  { destination1: "New York", destination2: "Houston", points: 12, imagePath: nyHouston },
  { destination1: "New York", destination2: "Oklahoma City", points: 11, imagePath: nyOklahoma },
  { destination1: "New York", destination2: "Tyville", points: 14, imagePath: nyTyville },
  { destination1: "Palo Noah", destination2: "Los Angeles", points: 16, imagePath: paloLa },
  { destination1: "Palo Noah", destination2: "Phoenix", points: 12, imagePath: paloPhoenix },
  { destination1: "Seattle", destination2: "Albuquerque", points: 10, imagePath: seattleAlb },
  { destination1: "Seattle", destination2: "Houston", points: 15, imagePath: seattleHouston },
  { destination1: "Tyville", destination2: "Palo Noah", points: 11, imagePath: tyvillePalo },
  { destination1: "Tyville", destination2: "Phoenix", points: 7, imagePath: tyvillePhoenix },
  { destination1: "Tyville", destination2: "Washington", points: 13, imagePath: tyvilleWash },
  { destination1: "Washington", destination2: "Denver", points: 10, imagePath: washDenver },
];

export default destination_cards;
