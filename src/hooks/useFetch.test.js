import "@testing-library/jest-dom"
import { renderHook, waitFor } from "@testing-library/react"
import { rest } from "msw"
import { setupServer } from "msw/node"

import useFetch from "./useFetch"

const pokemonEndpoint = jest.fn()

const handlers = [
    rest.get("https://pokeapi.co/api/v2/pokemon", pokemonEndpoint)
]

const server = setupServer(...handlers)

describe("The useFetch hook", () => {
    beforeAll(() => server.listen())

    afterAll(() => server.close())

    it("automatically fetches the given URL when called", async () => {
        const { result } = renderHook(() => useFetch("https://pokeapi.co/api/v2/pokemon"))
    
        await waitFor(() => expect(result.current.status).toBe("fetching"))
        expect(pokemonEndpoint).toHaveBeenCalled()
    })
})