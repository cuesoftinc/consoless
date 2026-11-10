import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AgeCheck, { type AgeCheckProps } from "./AgeCheck";

function setup(overrides: Partial<AgeCheckProps> = {}) {
  const props: AgeCheckProps = {
    step: "ask",
    saving: false,
    error: null,
    onConfirm: vi.fn(),
    onUnder16: vi.fn(),
    onBack: vi.fn(),
    onSignOut: vi.fn(),
    ...overrides,
  };
  render(<AgeCheck {...props} />);
  return props;
}

describe("AgeCheck", () => {
  it("asks once, without asking for a date of birth", async () => {
    const props = setup();
    expect(
      screen.getByRole("heading", { level: 1, name: "One quick check" }),
    ).toBeInTheDocument();
    expect(screen.getByText(/do not ask for your date of birth/)).toBeVisible();
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();

    await userEvent.click(
      screen.getByRole("button", { name: "I am 16 or older" }),
    );
    expect(props.onConfirm).toHaveBeenCalledTimes(1);
    await userEvent.click(
      screen.getByRole("button", { name: "I am under 16" }),
    );
    expect(props.onUnder16).toHaveBeenCalledTimes(1);
  });

  it("disables both answers while saving", () => {
    setup({ saving: true });
    expect(screen.getByRole("button", { name: /16 or older/ })).toBeDisabled();
    expect(
      screen.getByRole("button", { name: "I am under 16" }),
    ).toBeDisabled();
  });

  it("announces a failed save", () => {
    setup({ error: "We could not save that. Try again." });
    expect(screen.getByRole("alert")).toHaveTextContent(
      "We could not save that. Try again.",
    );
  });

  it("tells under-16s that playing stays open", async () => {
    const props = setup({ step: "under-16" });
    expect(screen.getByTestId("age-check")).toHaveAttribute(
      "data-step",
      "under-16",
    );
    expect(
      screen.getByRole("heading", { level: 1, name: "You can still play" }),
    ).toBeInTheDocument();
    expect(screen.getByText(/playing them needs no account/)).toBeVisible();

    await userEvent.click(screen.getByRole("button", { name: "Back" }));
    expect(props.onBack).toHaveBeenCalledTimes(1);
    await userEvent.click(screen.getByRole("button", { name: "Sign out" }));
    expect(props.onSignOut).toHaveBeenCalledTimes(1);
  });
});
