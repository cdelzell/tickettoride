import "./DrawPile.css";

function DrawTrains() {
  return (
    <div className="draw_trains">
      <div className="draw_train_rules">
        <p>You may:</p>
        <p>a) draw a random train</p>
        <p>b) draw a train from the face-up cards</p>
        <p>c) a combination of both</p>
      </div>

      <DrawPile></DrawPile>
    </div>
  );
}

function DrawPile() {
  return (
    <button className="draw_pile">
      <img src="./src/assets/draw_pile.jpg" alt="draw pile" />
    </button>
  );
}

export default DrawTrains;
