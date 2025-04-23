import { trainCardImages } from "@/image_imports";

const colors = ["red", "yellow", "black", "green", "purple", "blue", "brown", "white", "wild"];

const train_cards = colors.map((color) => ({
  color: trainCardImages[color],
  game_color: color,
}));

export default train_cards;