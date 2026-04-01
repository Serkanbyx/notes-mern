import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import ConfirmDialog from "../components/ConfirmDialog";

describe("ConfirmDialog", () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    onConfirm: vi.fn(),
    title: "Delete item?",
    message: "This cannot be undone.",
  };

  it("renders nothing when isOpen is false", () => {
    const { container } = render(
      <ConfirmDialog {...defaultProps} isOpen={false} />,
    );
    expect(container.firstChild).toBeNull();
  });

  it("renders title and message when open", () => {
    render(<ConfirmDialog {...defaultProps} />);

    expect(screen.getByText("Delete item?")).toBeInTheDocument();
    expect(screen.getByText("This cannot be undone.")).toBeInTheDocument();
  });

  it("calls onConfirm when delete button is clicked", async () => {
    const onConfirm = vi.fn();
    render(<ConfirmDialog {...defaultProps} onConfirm={onConfirm} />);

    await userEvent.click(screen.getByText("Delete"));
    expect(onConfirm).toHaveBeenCalledOnce();
  });

  it("calls onClose when cancel button is clicked", async () => {
    const onClose = vi.fn();
    render(<ConfirmDialog {...defaultProps} onClose={onClose} />);

    await userEvent.click(screen.getByText("Cancel"));
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("shows loading state and disables buttons", () => {
    render(<ConfirmDialog {...defaultProps} loading={true} />);

    expect(screen.getByText("Deleting…")).toBeInTheDocument();
    expect(screen.getByText("Deleting…")).toBeDisabled();
    expect(screen.getByText("Cancel")).toBeDisabled();
  });

  it("closes on Escape key press", async () => {
    const onClose = vi.fn();
    render(<ConfirmDialog {...defaultProps} onClose={onClose} />);

    await userEvent.keyboard("{Escape}");
    expect(onClose).toHaveBeenCalledOnce();
  });
});
