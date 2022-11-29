import "./styles.css";
import PokeMonListContainer from "./PokeMonListContainer";
import PokemonListPresenter from "./PokemonListPresenter";

export default function App() {
  return (
    <div className="App">
      <h1>Gotta catch'em all!</h1>
      <PokeMonListContainer renderList={PokemonListPresenter} />
    </div>
  );
}
