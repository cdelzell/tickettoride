import "./DrawPile.css";

function DrawTrains({
  updateTrains,
}: {
  updateTrains: (color: string, amount: number) => void;
}) {
  return (
    <div className="draw_trains">
      <div className="draw_train_rules">
        <p>You may:</p>
        <p>a) draw a random train</p>
        <p>b) draw a train from the face-up cards</p>
        <p>c) a combination of both</p>
      </div>

      <DrawPile updateTrains={updateTrains}></DrawPile>
    </div>
  );
}

function DrawPile({
  updateTrains,
}: {
  updateTrains: (color: string, amount: number) => void;
}) {
  //import noah's function and draw and return a single train card
  //onClick={() => updateTrains(color, 1)}
  return (
    <button className="draw_pile">
      <img src="./src/assets/draw_pile.jpg" alt="draw pile" />
    </button>
  );
}

export default DrawTrains;
