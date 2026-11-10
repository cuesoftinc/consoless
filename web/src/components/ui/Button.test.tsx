import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Send } from "lucide-react";
import Button, { buttonClasses } from "./Button";

describe("Button", () => {
  it("defaults to a primary, medium, type=button button", () => {
    render(<Button>Start building</Button>);
    const button = screen.getByRole("button", { name: "Start building" });
    expect(button).toHaveAttribute("type", "button");
    expect(button).toHaveAttribute("data-kind", "primary");
    expect(button).toHaveClass("bg-accent-default", "text-accent-on-accent");
    expect(button).toHaveClass("h-11");
  });

  it("binds each kind to its tokens", () => {
    const { rerender } = render(<Button kind="secondary">Export</Button>);
    expect(screen.getByRole("button")).toHaveClass(
      "bg-bg-raised",
      "border-border-strong",
    );
    rerender(<Button kind="ghost">Cancel</Button>);
    expect(screen.getByRole("button")).toHaveClass("text-text-secondary");
    rerender(<Button kind="danger">Delete project</Button>);
    expect(screen.getByRole("button")).toHaveClass(
      "bg-danger-default",
      "text-danger-on-danger",
    );
    rerender(<Button kind="quiet-danger">Remove</Button>);
    expect(screen.getByRole("button")).toHaveClass("text-danger-text");
    expect(screen.getByRole("button")).not.toHaveClass("bg-danger-default");
  });

  it("supports the small size and a leading icon", () => {
    render(
      <Button size="sm" icon={Send}>
        Send
      </Button>,
    );
    const button = screen.getByRole("button", { name: "Send" });
    expect(button).toHaveClass("h-9");
    expect(screen.getByTestId("button-icon")).toHaveAttribute(
      "aria-hidden",
      "true",
    );
  });

  it("fires onClick, and not when disabled", async () => {
    const onClick = vi.fn();
    const { rerender } = render(<Button onClick={onClick}>Publish</Button>);
    await userEvent.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledTimes(1);
    rerender(
      <Button onClick={onClick} disabled>
        Publish
      </Button>,
    );
    await userEvent.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("loading disables the button and shows the spinner", () => {
    render(<Button loading>Saving</Button>);
    expect(screen.getByRole("button")).toBeDisabled();
    expect(screen.getByRole("button")).toHaveAttribute("aria-busy", "true");
    expect(screen.getByTestId("button-spinner")).toBeInTheDocument();
  });

  it("buttonClasses gives links the same look", () => {
    expect(buttonClasses("secondary", "sm")).toContain("h-9");
    expect(buttonClasses("secondary", "sm")).toContain("bg-bg-raised");
  });
});
