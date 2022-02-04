import './App.css';
import Game from "./game/Game";
import patterns from "./front/patterns/Patterns";

function App() {

   let keys = Array.from(patterns.keys());
   let randomPattern = keys[Math.floor(Math.random() * keys.length)];

  return (
    <div className="App">
      <h1>Play Chess!</h1>
      <h3>Player 1</h3>
      <Game boardPattern={randomPattern}/>
      <h3>Player 2</h3>
    </div>
  );
}

export default App;
