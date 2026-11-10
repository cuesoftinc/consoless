import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import FAQItem from "./FAQItem";

describe("FAQItem", () => {
  it("hides the answer while closed and asks to toggle on click", async () => {
    const onToggle = vi.fn();
    render(
      <FAQItem
        question="Do I need to know how to code?"
        answer="No."
        expanded={false}
        onToggle={onToggle}
      />,
    );
    const button = screen.getByRole("button", {
      name: "Do I need to know how to code?",
    });
    expect(button).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByRole("region")).not.toBeInTheDocument();
    await userEvent.click(button);
    expect(onToggle).toHaveBeenCalledTimes(1);
  });

  it("shows the answer in a region labelled by the question when open", () => {
    render(
      <FAQItem
        question="Is it free?"
        answer="The hosted service is free."
        expanded
        onToggle={() => undefined}
      />,
    );
    expect(screen.getByRole("button")).toHaveAttribute("aria-expanded", "true");
    expect(
      screen.getByRole("region", { name: "Is it free?" }),
    ).toHaveTextContent("The hosted service is free.");
  });
});
