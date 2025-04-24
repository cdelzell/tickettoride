import { trainCardImages } from "@/imageImports";

const colors = [
  "red",
  "yellow",
  "black",
  "green",
  "purple",
  "blue",
  "brown",
  "white",
  "wild",
];

const trainCards = colors.map((color) => ({
  color: trainCardImages[color],
  gameColor: color,
}));

export default trainCards;
