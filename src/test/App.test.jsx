import { render } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import App from "../App";

vi.mock("@lottiefiles/react-lottie-player", () => ({
  Player: () => <div data-testid="lottie-player" />,
}));

describe("App Component", () => {
  it("renders without crashing", () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );

    expect(document.body).toBeTruthy();
  });
});
