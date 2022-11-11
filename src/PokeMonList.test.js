import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { rest } from "msw";
import { setupServer } from "msw/node";

import PokeMonList from "./PokeMonList";

const handlers = [
  rest.get(
    "https://pokeapi.co/api/v2/pokemon",
    (request, response, context) => {
      if (
        request.url.searchParams.get("offset") == 3 &&
        request.url.searchParams.get("limit") == 3
      ) {
        response(
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
        response(
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

describe("The PokMonList component", () => {
  let user;

  beforeAll(() => server.listen());

  beforeEach(() => {
    user = userEvent.setup();
  });

  // afterEach(() => server.resetHandlers());

  afterAll(() => server.close());

  it("displays a loading message before request is finished", () => {
    render(<PokeMonList />);

    const waitingText = screen.getByText("Hol'up a minit...");

    expect(waitingText).toBeInTheDocument();
  });

  it("displays the pokemons after a successful requests", async () => {
    render(<PokeMonList />);

    const firstElement = await screen.findByText("bulbasaur");

    expect(firstElement).toBeInTheDocument();
  });

  it("displays the next button if there is another page of results", async () => {
    render(<PokeMonList />);

    const nextButton = await screen.findByRole("button", { name: /next/i });

    expect(nextButton).toBeInTheDocument();
  });

  it("switch to the next page of results when user clicks the 'Next' button", async () => {
    render(<PokeMonList />);

    const nextButton = await screen.findByRole("button", { name: /next/i });

    expect(nextButton).toBeInTheDocument();

    await user.pointer({ keys: "[MouseLeft]", target: nextButton });

    const firstElement = await screen.findByText("charmander");

    expect(firstElement).toBeInTheDocument();
  });

  it("disables the 'Next' button if there is no more results page", async () => {
    render(<PokeMonList />);

    let nextButton = await screen.findByRole("button", { name: /next/i });

    expect(nextButton).toBeInTheDocument();

    await user.pointer({ keys: "[MouseLeft]", target: nextButton });

    nextButton = await screen.findByRole("button", { name: /next/i });

    expect(nextButton).toBeDisabled();
  });
});
