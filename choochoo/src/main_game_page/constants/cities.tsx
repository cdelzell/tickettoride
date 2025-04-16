export interface City {
  name: string;
  x: number;
  y: number;
  color?: string;
}

const cities: City[] = [
  { name: "New York", x: 504, y: 133 + 20 }, // 0
  { name: "Chicago", x: 382, y: 130 + 20 }, // 1
  { name: "Denver", x: 230, y: 165 + 20 }, // 2
  { name: "Los Angeles", x: 89, y: 192 + 20 }, // 3
  { name: "Tyville", x: 175, y: 100 + 20 }, // 4
  { name: "Clara City", x: 270, y: 70 + 20 }, // 5
  { name: "Palo Noah", x: 430, y: 230 + 20 }, // 6
  { name: "Riddhi Rapids", x: 76, y: 100 + 20 }, // 7
  { name: "Firestone Rouge", x: 340, y: 175 + 20 }, // 8
  { name: "Seattle", x: 110, y: 35 + 20 }, // 9
  { name: "Miami", x: 475, y: 305 + 20 }, // 10
  { name: "Phoenix", x: 165, y: 220 + 20 }, // 11
  { name: "Houston", x: 315, y: 280 + 20 }, // 12
  { name: "Washington", x: 485, y: 172 + 20 }, // 13
  { name: "Oklahoma City", x: 300, y: 213 + 20 }, // 14
  { name: "Albuquerque", x: 220, y: 212 + 20 }, // 15
];

export default cities;
