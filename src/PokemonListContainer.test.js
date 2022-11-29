import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import server, { PAGE_1_RESULTS, PAGE_2_RESULTS } from "./__test__/server";
import PokemonListContainer from "./PokeMonListContainer";

describe("The PokemonListContainer component", () => {
  let user, renderListMock = jest.fn();

  beforeAll(() => server.listen());

  beforeEach(() => {
    user = userEvent.setup();
    jest.resetAllMocks();
  });

  afterAll(() => server.close());

  it("displays a loading message before request is finished", () => {
    render(<PokemonListContainer renderList={renderListMock} />);

    const waitingText = screen.getByText("Hol'up a minit...");

    expect(waitingText).toBeInTheDocument();
  });

  it("enables the next button if there is another page of results", async () => {
    render(<PokemonListContainer renderList={renderListMock}/>);

    const nextButton = await screen.findByRole("button", { name: /next/i });

    expect(nextButton).not.toBeDisabled();
  });

  it("switch to the next page of results when user clicks the 'Next' button", async () => {
    render(<PokemonListContainer renderList={renderListMock} />);

    let nextButton = await screen.findByRole("button", { name: /next/i });

    await user.pointer({ keys: "[MouseLeft]", target: nextButton });

    nextButton = await screen.findByRole("button", { name: /next/i });

    expect(renderListMock).toHaveBeenLastCalledWith({ pokemons: PAGE_2_RESULTS });
  });

  it("disables the 'Next' button if there is no more results page", async () => {
    render(<PokemonListContainer renderList={renderListMock} />);

    let nextButton = await screen.findByRole("button", { name: /next/i });

    await user.pointer({ keys: "[MouseLeft]", target: nextButton });

    nextButton = await screen.findByRole("button", { name: /next/i });

    expect(nextButton).toBeDisabled();
  });

  it("disables the 'Previous' button if there it is the first results page", async () => {
    render(<PokemonListContainer renderList={renderListMock} />);

    const previousButton = await screen.findByRole("button", { name: /previous/i });

    expect(previousButton).toBeDisabled();
  });

  it("switches to the previous page of results when the user clicks the 'Previous' button", async () => {
    render(<PokemonListContainer renderList={renderListMock} />);

    const nextButton = await screen.findByRole("button", { name: /next/i });

    await user.pointer({ keys: "[MouseLeft]", target: nextButton});
    
    let previousButton = await screen.findByRole("button", { name: /previous/i });

    await user.pointer({ keys: "[MouseLeft]", target: previousButton });

    previousButton = await screen.findByRole("button", { name: /next/i });

    expect(renderListMock).toHaveBeenLastCalledWith({ pokemons: PAGE_1_RESULTS });
  });
});
