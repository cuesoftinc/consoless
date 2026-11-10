/**
 * ChatMessage (docs/design.md section 3): one turn in the Studio chat.
 * The user's turn is a tinted bubble on the right; the assistant's turn
 * is plain text beside its mark. A visually hidden prefix names the
 * speaker, so the side and the tint are never the only signal.
 */

import type { ReactNode } from "react";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/cn";

export type ChatMessageAuthor = "user" | "assistant";

export interface ChatMessageProps {
  /** Who is speaking. Named `author` because `role` is a DOM attribute. */
  author: ChatMessageAuthor;
  children: ReactNode;
  className?: string;
}

export default function ChatMessage({
  author,
  children,
  className,
}: ChatMessageProps) {
  if (author === "user") {
    return (
      <div
        data-testid="chat-message"
        data-author="user"
        className={cn("flex justify-end", className)}
      >
        <div
          data-testid="chat-message-body"
          className="max-w-80 rounded-lg bg-accent-subtle px-3 py-2 text-body-sm text-text-primary"
        >
          <span className="sr-only">You: </span>
          {children}
        </div>
      </div>
    );
  }

  return (
    <div
      data-testid="chat-message"
      data-author="assistant"
      className={cn("flex gap-3", className)}
    >
      <span
        data-testid="chat-message-mark"
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-border-default bg-bg-raised"
      >
        <Sparkles aria-hidden className="h-4 w-4 text-accent-text" />
      </span>
      <div
        data-testid="chat-message-body"
        className="flex-1 text-body-sm text-text-primary"
      >
        <span className="sr-only">Consoless: </span>
        {children}
      </div>
    </div>
  );
}
