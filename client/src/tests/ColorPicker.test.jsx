import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import ColorPicker from "../components/ColorPicker";

describe("ColorPicker", () => {
  const colors = ["yellow", "green", "blue", "purple", "pink", "orange"];

  it("renders all 6 color buttons", () => {
    render(<ColorPicker selectedColor="yellow" onSelect={() => {}} />);

    colors.forEach((color) => {
      expect(
        screen.getByLabelText(`Select ${color} color`),
      ).toBeInTheDocument();
    });
  });

  it("calls onSelect when a color is clicked", async () => {
    const handleSelect = vi.fn();
    render(<ColorPicker selectedColor="yellow" onSelect={handleSelect} />);

    await userEvent.click(screen.getByLabelText("Select blue color"));
    expect(handleSelect).toHaveBeenCalledWith("blue");
  });

  it("highlights the selected color with scale and border", () => {
    render(<ColorPicker selectedColor="green" onSelect={() => {}} />);

    const selected = screen.getByLabelText("Select green color");
    expect(selected.className).toContain("scale-110");
    expect(selected.className).toContain("border-gray-700");
  });

  it("does not highlight non-selected colors", () => {
    render(<ColorPicker selectedColor="green" onSelect={() => {}} />);

    const unselected = screen.getByLabelText("Select yellow color");
    expect(unselected.className).toContain("border-transparent");
  });
});
