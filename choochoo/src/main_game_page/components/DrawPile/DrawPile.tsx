import "./DrawPile.css";

function DrawTrains({
  updateTrains,
  drawClickCount,
  setDrawClickCount,
  playClickCount,
  destClickCount,
}: {
  updateTrains: (color: string, amount: number) => void;
  drawClickCount: number;
  setDrawClickCount: (num: number) => void;
  playClickCount: number;
  destClickCount: number;
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
        updateTrains={updateTrains}
        drawClickCount={drawClickCount}
        setDrawClickCount={setDrawClickCount}
        playClickCount={playClickCount}
        destClickCount={destClickCount}
      ></DrawPile>
    </div>
  );
}

function DrawPile({
  updateTrains,
  drawClickCount,
  setDrawClickCount,
  playClickCount,
  destClickCount,
}: {
  updateTrains: (color: string, amount: number) => void;
  drawClickCount: number;
  setDrawClickCount: (num: number) => void;
  playClickCount: number;
  destClickCount: number;
}) {
  //import noah's function and draw and return a single train card
  const color = "red";

  const handleClick = () => {
    if (drawClickCount < 2 && playClickCount == 0 && destClickCount == 0) {
      setDrawClickCount(drawClickCount + 1);
      updateTrains(color, 1);
    }
  };
  return (
    <button className="draw_pile" onClick={handleClick}>
      <img src="./src/assets/draw_pile.jpg" alt="draw pile" />
    </button>
  );
}

export default DrawTrains;
