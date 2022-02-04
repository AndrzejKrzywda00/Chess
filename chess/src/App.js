import './App.css';
import Game from "./game/Game";
import patterns from "./front/patterns/Patterns";

function App() {

   let keys = Array.from(patterns.keys());
   let randomKey = keys[Math.floor(Math.random() * keys.length)];
   let randomPattern = patterns.get(randomKey);

  return (
    <div className="App">
      <h1>Play Chess!</h1>
      <h3>Player 1</h3>
      <Game
          boardPattern={randomPattern}
          chooseGradientOverPattern={false}
      />
      <h3>Player 2</h3>
    </div>
  );
}

export default App;
