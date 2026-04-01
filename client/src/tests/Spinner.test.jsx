import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Spinner from "../components/Spinner";

describe("Spinner", () => {
  it("renders with default medium size", () => {
    render(<Spinner />);
    expect(screen.getByRole("status")).toBeInTheDocument();
    expect(screen.getByText("Loading…")).toBeInTheDocument();
  });

  it("renders with small size", () => {
    const { container } = render(<Spinner size="sm" />);
    const spinner = container.querySelector(".animate-spin");
    expect(spinner).toHaveClass("h-5", "w-5");
  });

  it("renders with large size", () => {
    const { container } = render(<Spinner size="lg" />);
    const spinner = container.querySelector(".animate-spin");
    expect(spinner).toHaveClass("h-12", "w-12");
  });

  it("has accessible loading label", () => {
    render(<Spinner />);
    expect(screen.getByRole("status")).toHaveAttribute(
      "aria-label",
      "Loading",
    );
  });
});
