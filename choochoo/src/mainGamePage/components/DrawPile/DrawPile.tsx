import "./DrawPile.css";
import { drawPile } from "@/imageImports";

/*
  Sets the action box display for when a player is drawing cards
  Provides instructions and renders the draw pile component
*/
function DrawTrains({
  drawClickCount,
  setDrawClickCount,
  playClickCount,
  destClickCount,
  handleDrawPileClick,
}: {
  drawClickCount: number;
  setDrawClickCount: (num: number) => void;
  playClickCount: number;
  destClickCount: number;
  handleDrawPileClick: () => void;
}) {
  return (
    <div className="draw_trains">
      <div className="draw_train_rules">
        <p>You may:</p>
        <p>a) draw a random train</p>
        <p>b) draw a train from the face-up cards</p>
        <p>c) a combination of both</p>
      </div>
      <DrawPile
        drawClickCount={drawClickCount}
        playClickCount={playClickCount}
        destClickCount={destClickCount}
        handleDrawPileClick={handleDrawPileClick}
      />
    </div>
  );
}

/*
  Creates the actual draw pile component button
  When clicked gives a user a random train card
  Disabled when the player has taken another action or drawn 2 cards already
*/
function DrawPile({
  drawClickCount,
  playClickCount,
  destClickCount,
  handleDrawPileClick,
}: {
  drawClickCount: number;
  playClickCount: number;
  destClickCount: number;
  handleDrawPileClick: () => void;
}) {
  return (
    <div>
      <p>Cards drawn: {drawClickCount}/2</p>
      <button
        className="draw_pile"
        onClick={handleDrawPileClick}
        disabled={
          drawClickCount >= 2 || playClickCount > 0 || destClickCount > 0
        }
      >
        <img src={drawPile} alt="draw pile" />
      </button>
    </div>
  );
}

export default DrawTrains;
