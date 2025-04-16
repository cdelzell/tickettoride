import "./DrawPile.css";
import drawPileImg from "@/assets/draw_pile.jpg";

function DrawTrains({
  updateTrains,
  drawClickCount,
  setDrawClickCount,
  playClickCount,
  destClickCount,
  handleDrawPileClick,
}: {
  updateTrains: (color: string, amount: number) => void;
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
        setDrawClickCount={setDrawClickCount}
        playClickCount={playClickCount}
        destClickCount={destClickCount}
        handleDrawPileClick={handleDrawPileClick}
      />
    </div>
  );
}

function DrawPile({
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
    <div>
      <p>Cards drawn: {drawClickCount}/2</p>
      <button
        className="draw_pile"
        onClick={handleDrawPileClick}
        disabled={drawClickCount >= 2 || playClickCount > 0 || destClickCount > 0}
      >
        <img src={drawPileImg} alt="draw pile" />
      </button>
    </div>
  );
}

export default DrawTrains;