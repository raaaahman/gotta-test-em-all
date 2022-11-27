import React from "react";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import PokemonListPresenter from "./PokemonListPresenter";

const POKEMONS = [
    { name: "bulbasaur" },
    { name: "ivysaur" },
    { name: "venusaur" },
];

describe("The PokemonListPresenter component", () => {
    it("displays the names of the pokemons that are passed as props", () => {
        render(<PokemonListPresenter pokemons={POKEMONS} />);

        expect(screen.getByText(/bulbasaur/i)).toBeInTheDocument();
        expect(screen.getByText(/ivysaur/i)).toBeInTheDocument();
        expect(screen.getByText(/venusaur/i)).toBeInTheDocument();
    });
})
