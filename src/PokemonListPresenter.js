export default function PokemonListPresenter({ pokemons }) {
    return pokemons 
        ? (<ul>
        {pokemons.map((pokemon) => (
            <li key={pokemon.name}>{pokemon.name}</li>
        ))}
        </ul>)
        : "No more pokemons...";
}