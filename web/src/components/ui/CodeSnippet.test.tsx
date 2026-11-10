import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CodeSnippet from "./CodeSnippet";

const TABS = [
  {
    id: "compose",
    label: "Docker Compose",
    code: "git clone repo\ncd repo && docker compose up",
  },
  { id: "npm", label: "npm", code: "git clone repo\ncd repo/web && npm ci" },
];

const writeText = vi.fn();

beforeEach(() => {
  writeText.mockReset();
  writeText.mockResolvedValue(undefined);
  Object.defineProperty(navigator, "clipboard", {
    configurable: true,
    value: { writeText },
  });
});

describe("CodeSnippet", () => {
  it("is a dark block that shows the first tab's commands", () => {
    render(<CodeSnippet tabs={TABS} label="Self-host commands" />);
    expect(screen.getByTestId("code-snippet")).toHaveAttribute(
      "data-theme",
      "dark",
    );
    expect(screen.getByRole("tab", { name: "Docker Compose" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(screen.getByRole("tabpanel")).toHaveTextContent(
      "cd repo && docker compose up",
    );
  });

  it("copies the open tab without the prompts, and confirms it", async () => {
    const onCopy = vi.fn();
    render(
      <CodeSnippet tabs={TABS} label="Self-host commands" onCopy={onCopy} />,
    );
    await userEvent.click(
      screen.getByRole("button", { name: "Copy commands" }),
    );
    expect(writeText).toHaveBeenCalledWith(TABS[0].code);
    expect(onCopy).toHaveBeenCalledWith("compose");
    expect(screen.getByRole("button", { name: "Copied" })).toHaveAttribute(
      "data-state",
      "copied",
    );
    expect(screen.getByRole("status")).toHaveTextContent("Commands copied.");
  });

  it("switches tabs, resets the confirmation and copies the new tab", async () => {
    render(<CodeSnippet tabs={TABS} label="Self-host commands" />);
    await userEvent.click(
      screen.getByRole("button", { name: "Copy commands" }),
    );
    await userEvent.click(screen.getByRole("tab", { name: "npm" }));
    expect(screen.getByRole("tabpanel")).toHaveTextContent("npm ci");
    const copy = screen.getByRole("button", { name: "Copy commands" });
    await userEvent.click(copy);
    expect(writeText).toHaveBeenLastCalledWith(TABS[1].code);
  });

  it("stays idle when the clipboard is blocked", async () => {
    writeText.mockRejectedValue(new Error("denied"));
    render(<CodeSnippet tabs={TABS} label="Self-host commands" />);
    await userEvent.click(
      screen.getByRole("button", { name: "Copy commands" }),
    );
    await waitFor(() => expect(writeText).toHaveBeenCalled());
    expect(
      screen.getByRole("button", { name: "Copy commands" }),
    ).toBeInTheDocument();
  });

  it("shows no tab list for a single method", () => {
    render(<CodeSnippet tabs={[TABS[0]]} label="Self-host commands" />);
    expect(screen.queryByRole("tablist")).not.toBeInTheDocument();
    expect(screen.getByLabelText("Self-host commands")).toHaveTextContent(
      "git clone repo",
    );
  });
});
