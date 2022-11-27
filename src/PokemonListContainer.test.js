import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { rest } from "msw";
import { setupServer } from "msw/node";

import PokemonListContainer from "./PokeMonListContainer";

const handlers = [
  rest.get(
    "https://pokeapi.co/api/v2/pokemon",
    (request, response, context) => {
      if (
        request.url.searchParams.get("offset") == 3 &&
        request.url.searchParams.get("limit") == 3
      ) {
        return response(
          context.status(200),
          context.json({
            next: null,
            previous: 'https://pokeapi.co/api/v2/pokemon"',
            results: [
              { name: "charmander" },
              { name: "charmeleon" },
              { name: "charizard" }
            ]
          })
        );
      } else {
        return response(
          context.status(200),
          context.json({
            next: "https://pokeapi.co/api/v2/pokemon/?offset=3&limit=3",
            previous: null,
            results: [
              { name: "bulbasaur" },
              { name: "ivysaur" },
              { name: "venusaur" }
            ]
          })
        );
      }
    }
  )
];

const server = setupServer(...handlers);

describe("The PokemonListContainer component", () => {
  let user;

  beforeAll(() => server.listen());

  beforeEach(() => {
    user = userEvent.setup();
  });

  afterAll(() => server.close());

  it("displays a loading message before request is finished", () => {
    render(<PokemonListContainer />);

    const waitingText = screen.getByText("Hol'up a minit...");

    expect(waitingText).toBeInTheDocument();
  });

  it("displays the pokemons after a successful requests", async () => {
    render(<PokemonListContainer />);

    const firstElement = await screen.findByText("bulbasaur");

    expect(firstElement).toBeInTheDocument();
  });

  it("enables the next button if there is another page of results", async () => {
    render(<PokemonListContainer />);

    const nextButton = await screen.findByRole("button", { name: /next/i });

    expect(nextButton).not.toBeDisabled();
  });

  it("switch to the next page of results when user clicks the 'Next' button", async () => {
    render(<PokemonListContainer />);

    const nextButton = await screen.findByRole("button", { name: /next/i });

    await user.pointer({ keys: "[MouseLeft]", target: nextButton });

    const firstElement = await screen.findByText("charmander");

    expect(firstElement).toBeInTheDocument();
  });

  it("disables the 'Next' button if there is no more results page", async () => {
    render(<PokemonListContainer />);

    let nextButton = await screen.findByRole("button", { name: /next/i });

    await user.pointer({ keys: "[MouseLeft]", target: nextButton });

    nextButton = await screen.findByRole("button", { name: /next/i });

    expect(nextButton).toBeDisabled();
  });

  it("disables the 'Previous' button if there it is the first results page", async () => {
    render(<PokemonListContainer />);

    const previousButton = await screen.findByRole("button", { name: /previous/i });

    expect(previousButton).toBeDisabled();
  });

  it("switches to the previous page of results when the user clicks the 'Previous' button", async () => {
    render(<PokemonListContainer />);

    const nextButton = await screen.findByRole("button", { name: /next/i });

    await user.pointer({ keys: "[MouseLeft]", target: nextButton});
    
    const previousButton = await screen.findByRole("button", { name: /next/i });

    await user.pointer({ keys: "[MouseLeft]", target: previousButton });

    const firstElement = await screen.findByText("charmander");

    expect(firstElement).toBeInTheDocument();
  });
});
