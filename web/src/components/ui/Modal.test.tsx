import { describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Button from "./Button";
import Modal from "./Modal";

describe("Modal", () => {
  it("renders nothing while closed", () => {
    render(
      <Modal open={false} onOpenChange={() => undefined} title="Rename project">
        <p>Body</p>
      </Modal>,
    );
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("opens as a named modal dialog with its title, description and body", () => {
    render(
      <Modal
        open
        onOpenChange={() => undefined}
        title="Rename project"
        description="The new name shows on your profile."
      >
        <p>Body</p>
      </Modal>,
    );
    const dialog = screen.getByRole("dialog", { name: "Rename project" });
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(dialog).toHaveAttribute("data-kind", "default");
    expect(dialog).toHaveAttribute("data-size", "md");
    expect(dialog).toHaveAccessibleDescription(
      "The new name shows on your profile.",
    );
    expect(dialog).toHaveClass(
      "z-modal",
      "w-[calc(100vw-2rem)]",
      "max-w-130",
      "rounded-xl",
      "border-border-default",
      "bg-bg-surface",
      "p-6",
      "shadow-lg",
      "gap-4",
    );
    expect(dialog).toHaveClass("motion-reduce:transition-none");
    expect(screen.getByRole("heading", { name: "Rename project" })).toHaveClass(
      "text-heading-md",
      "text-text-primary",
    );
    expect(screen.getByText("The new name shows on your profile.")).toHaveClass(
      "text-body-md",
      "text-text-secondary",
    );
    expect(within(dialog).getByText("Body")).toBeInTheDocument();
    expect(screen.getByTestId("modal-overlay")).toHaveClass(
      "fixed",
      "inset-0",
      "z-modal",
      "bg-overlay-scrim",
      "duration-base",
      "motion-reduce:transition-none",
    );
    expect(screen.queryByTestId("modal-footer")).not.toBeInTheDocument();
  });

  it("supports the small size, the destructive kind and className", () => {
    render(
      <Modal
        open
        onOpenChange={() => undefined}
        title="Delete project"
        size="sm"
        kind="destructive"
        className="mt-2"
      />,
    );
    const dialog = screen.getByRole("dialog", { name: "Delete project" });
    expect(dialog).toHaveAttribute("data-kind", "destructive");
    expect(dialog).toHaveAttribute("data-size", "sm");
    expect(dialog).toHaveClass("max-w-110", "mt-2");
    expect(dialog).not.toHaveClass("max-w-130");
    expect(dialog).not.toHaveAttribute("aria-describedby");
  });

  it("asks to close from the close button", async () => {
    const onOpenChange = vi.fn();
    render(<Modal open onOpenChange={onOpenChange} title="Rename project" />);
    await userEvent.click(screen.getByRole("button", { name: "Close" }));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("asks to close on Escape", async () => {
    const onOpenChange = vi.fn();
    render(<Modal open onOpenChange={onOpenChange} title="Rename project" />);
    await userEvent.keyboard("{Escape}");
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("asks to close on a scrim click", async () => {
    const onOpenChange = vi.fn();
    render(<Modal open onOpenChange={onOpenChange} title="Rename project" />);
    await userEvent.click(screen.getByTestId("modal-overlay"));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("renders the footer actions in a right-aligned row", async () => {
    const onConfirm = vi.fn();
    render(
      <Modal
        open
        onOpenChange={() => undefined}
        title="Delete project"
        kind="destructive"
        footer={
          <>
            <Button kind="ghost">Cancel</Button>
            <Button kind="danger" onClick={onConfirm}>
              Delete project
            </Button>
          </>
        }
      />,
    );
    const footer = screen.getByTestId("modal-footer");
    expect(footer).toHaveClass("flex", "justify-end", "gap-3");
    expect(
      within(footer).getByRole("button", { name: "Cancel" }),
    ).toBeInTheDocument();
    await userEvent.click(
      within(footer).getByRole("button", { name: "Delete project" }),
    );
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });
});
