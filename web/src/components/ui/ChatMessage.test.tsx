import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import ChatMessage from "./ChatMessage";

describe("ChatMessage", () => {
  it("draws the user turn as a right-aligned tinted bubble", () => {
    render(<ChatMessage author="user">Make the ball faster</ChatMessage>);
    const root = screen.getByTestId("chat-message");
    expect(root).toHaveAttribute("data-author", "user");
    expect(root).toHaveClass("flex", "justify-end");
    const body = screen.getByTestId("chat-message-body");
    expect(body).toHaveClass(
      "max-w-80",
      "rounded-lg",
      "bg-accent-subtle",
      "px-3",
      "py-2",
      "text-body-sm",
      "text-text-primary",
    );
    expect(body).toHaveTextContent("You: Make the ball faster");
    expect(screen.getByText("You:")).toHaveClass("sr-only");
    expect(screen.queryByTestId("chat-message-mark")).not.toBeInTheDocument();
  });

  it("draws the assistant turn as text beside its mark", () => {
    render(
      <ChatMessage author="assistant">The ball is now faster.</ChatMessage>,
    );
    const root = screen.getByTestId("chat-message");
    expect(root).toHaveAttribute("data-author", "assistant");
    expect(root).toHaveClass("flex", "gap-3");
    expect(root).not.toHaveClass("justify-end");
    expect(screen.getByTestId("chat-message-mark")).toHaveClass(
      "h-7",
      "w-7",
      "rounded-full",
      "border-border-default",
      "bg-bg-raised",
    );
    const body = screen.getByTestId("chat-message-body");
    expect(body).toHaveClass("flex-1", "text-body-sm", "text-text-primary");
    expect(body).not.toHaveClass("bg-accent-subtle");
    expect(body).toHaveTextContent("Consoless: The ball is now faster.");
    expect(screen.getByText("Consoless:")).toHaveClass("sr-only");
  });

  it("merges className for both authors", () => {
    const { rerender } = render(
      <ChatMessage author="user" className="mt-4">
        Hi
      </ChatMessage>,
    );
    expect(screen.getByTestId("chat-message")).toHaveClass("mt-4");
    rerender(
      <ChatMessage author="assistant" className="mt-4">
        Hi
      </ChatMessage>,
    );
    expect(screen.getByTestId("chat-message")).toHaveClass("mt-4");
  });
});
