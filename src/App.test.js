import React from "react";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";

import server, { PAGE_1_RESULTS } from "./__test__/server";
import App from "./App";

describe("The App component", () => {
    beforeAll(() => {
        server.listen()
    });

    afterAll(() => {
        server.close()
    });

    it("should render the first page of results on load", async () => {
        render(<App />);

        expect(await screen.findByText(PAGE_1_RESULTS[0].name)).toBeInTheDocument();
        expect(await screen.findByText(PAGE_1_RESULTS[1].name)).toBeInTheDocument();
        expect(await screen.findByText(PAGE_1_RESULTS[2].name)).toBeInTheDocument();
    });
});