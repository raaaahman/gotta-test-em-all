import { useState } from "react";
import useFetch from "./hooks/useFetch";

export default function PokeMonList() {
  const [ page, setPage ] = useState("https://pokeapi.co/api/v2/pokemon");
  const { status, value } = useFetch(page);

  return status === "success" ? (
    <div>
      <ul>
        {value.results.map((pokemon) => (
          <li key={pokemon.name}>{pokemon.name}</li>
        ))}
      </ul>
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
