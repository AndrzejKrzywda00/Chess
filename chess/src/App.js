import './App.css';
import Game from "./game/Game";
import patterns from "./front/patterns/Patterns";

function App() {

   let keys = Array.from(patterns.keys());
   let randomKey = keys[Math.floor(Math.random() * keys.length)];
   let randomPattern = patterns.get(randomKey);

  return (
    <div className="App">
      <Game
          boardPattern={randomPattern}
          chooseGradientOverPattern={false}
      />
    </div>
  );
}

export default App;
