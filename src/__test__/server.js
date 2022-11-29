import { rest } from "msw";
import { setupServer } from "msw/lib/node";

export const PAGE_1_RESULTS = [
    { name: "bulbasaur" },
    { name: "ivysaur" },
    { name: "venusaur" }
];

export const PAGE_2_RESULTS = [
    { name: "charmander" },
    { name: "charmeleon" },
    { name: "charizard" }
];
  
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
              previous: "https://pokeapi.co/api/v2/pokemon",
              results: PAGE_2_RESULTS
            })
          );
        } else {
          return response(
            context.status(200),
            context.json({
              next: "https://pokeapi.co/api/v2/pokemon/?offset=3&limit=3",
              previous: null,
              results: PAGE_1_RESULTS
            })
          );
        }
      }
    )
];
  
const server = setupServer(...handlers);

export default server;