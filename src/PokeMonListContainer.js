import { useState } from "react";
import useFetch from "./hooks/useFetch";

export default function PokemonListcontainer({ renderList }) {
  const [ page, setPage ] = useState("https://pokeapi.co/api/v2/pokemon");
  const { status, value } = useFetch(page);

  return status === "success" ? (
    <div>
      { renderList({ pokemons: value.results }) }
      <button
        disabled={typeof value.previous !== "string"}
        onClick={() => {
          setPage(value.previous);
        }}
      >
        &lt; Previous
      </button>
      <button
        disabled={typeof value.next !== "string"}
        onClick={() => {
          setPage(value.next);
        }}
      >
        Next &gt;
      </button>
    </div>
  ) : status === "error" ? (
    "Oops! A network error occurred... Try to refresh the page. Maybe."
  ) : "Hol'up a minit...";
}