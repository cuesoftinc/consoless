import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import GoogleAuthButton from "./GoogleAuthButton";

describe("GoogleAuthButton", () => {
  it("is the Continue with Google button and fires onClick", async () => {
    const onClick = vi.fn();
    render(<GoogleAuthButton onClick={onClick} />);
    const button = screen.getByRole("button", { name: "Continue with Google" });
    expect(button).toHaveAttribute("data-state", "default");
    await userEvent.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("shows the signing-in state and cannot be pressed while loading", async () => {
    const onClick = vi.fn();
    render(<GoogleAuthButton onClick={onClick} loading />);
    const button = screen.getByRole("button", { name: "Signing in…" });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("aria-busy", "true");
    expect(screen.getByTestId("google-auth-loading")).toBeInTheDocument();
    await userEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("supports a custom label and the disabled state", () => {
    render(<GoogleAuthButton label="Sign in with Google" disabled />);
    expect(
      screen.getByRole("button", { name: "Sign in with Google" }),
    ).toBeDisabled();
  });
});
