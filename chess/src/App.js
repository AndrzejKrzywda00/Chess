import './App.css';
import Game from "./game/Game";

function App() {

  return (
    <div className="App">
      <h1>Play Chess!</h1>
      <h3>Player 1</h3>
      <Game/>
      <h3>Player 2</h3>
    </div>
  );
}

export default App;
