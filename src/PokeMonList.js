import { useState, useEffect } from "react";

export default function PokeMonList() {
  const [isFetching, setIsFetching] = useState(false);
  const [isError, setIsError] = useState(false);
  const [pokemons, setPokemons] = useState([]);
  const [previous, setPrevious] = useState(null);
  const [next, setNext] = useState(null);
  const [page, setPage] = useState("https://pokeapi.co/api/v2/pokemon");

  useEffect(() => {
    const abortController = new AbortController();

    const fetchPokemons = () => {
      try {
        setIsFetching(true);
        fetch(page, {
          signal: abortController.signal
        })
          .then((response) => response.json())
          .then((pokemons) => {
            setIsFetching(false);
            setPrevious(pokemons.previous);
            setNext(pokemons.next);
            setPokemons(pokemons.results);
          });
      } catch (error) {
        setIsError(true);
      }
    };

    fetchPokemons();

    return () => {
      abortController.abort();
      setIsFetching(false);
    };
  }, [page]);

  return isFetching ? (
    "Hol'up a minit..."
  ) : isError ? (
    "Oops! A network error occurred... Try to refresh the page. Maybe."
  ) : (
    <div>
      <ul>
        {pokemons.map((pokemon) => (
          <li key={pokemon.name}>{pokemon.name}</li>
        ))}
      </ul>
      {previous && (
        <button
          onClick={() => {
            setPage(previous);
          }}
        >
          &lt; Previous
        </button>
      )}
      {next && (
        <button
          onClick={() => {
            setPage(next);
          }}
        >
          Next &gt;
        </button>
      )}
    </div>
  );
}