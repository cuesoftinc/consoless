"use client";

/**
 * PromptInput (docs/design.md section 3): the Studio composer. A textarea,
 * the console style chip and the Send button. Enter sends; Shift+Enter
 * adds a new line. The whole box takes the focus ring while the textarea
 * has focus.
 */

import type { KeyboardEvent } from "react";
import { ChevronDown, Send, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";
import Button from "./Button";

export type PromptInputState = "empty" | "filled" | "disabled";

export interface PromptInputProps {
  value: string;
  onChange: (value: string) => void;
  /** Called on Enter or Send, only when the trimmed value is not empty. */
  onSubmit: () => void;
  /** Name of the selected console style, shown in the chip. */
  styleLabel: string;
  styleIcon: LucideIcon;
  onStyleClick?: () => void;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
}

export default function PromptInput({
  value,
  onChange,
  onSubmit,
  styleLabel,
  styleIcon: StyleIcon,
  onStyleClick,
  disabled = false,
  placeholder = "Describe your game or a change to it",
  className,
}: PromptInputProps) {
  const canSubmit = !disabled && value.trim().length > 0;
  const state: PromptInputState = disabled
    ? "disabled"
    : value.length > 0
      ? "filled"
      : "empty";

  const onKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key !== "Enter" || event.shiftKey) return;
    // Enter that confirms an IME composition is not a send.
    if (event.nativeEvent.isComposing) return;
    event.preventDefault();
    if (canSubmit) onSubmit();
  };

  return (
    <div
      data-testid="prompt-input"
      data-state={state}
      className={cn(
        "flex flex-col gap-3 rounded-lg border border-border-default bg-bg-inset p-3",
        "focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-focus-ring",
        disabled && "opacity-40",
        className,
      )}
    >
      <textarea
        aria-label="Prompt"
        rows={2}
        value={value}
        disabled={disabled}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={onKeyDown}
        className="w-full resize-none border-0 bg-transparent text-body-md text-text-primary outline-none placeholder:text-text-muted disabled:cursor-not-allowed"
      />
      <div className="flex items-center justify-between">
        <button
          type="button"
          aria-label={`Console style: ${styleLabel}`}
          disabled={disabled}
          onClick={onStyleClick}
          className={cn(
            "inline-flex items-center gap-2 rounded-full border border-border-default bg-bg-raised px-2 py-1 text-label-sm text-text-secondary",
            "transition-colors duration-fast ease-enter hover:bg-bg-hover hover:text-text-primary motion-reduce:transition-none",
            "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring",
            "disabled:cursor-not-allowed",
          )}
        >
          <StyleIcon
            aria-hidden
            data-testid="prompt-input-style-icon"
            className="h-4 w-4"
          />
          <span>{styleLabel}</span>
          <ChevronDown aria-hidden className="h-4 w-4 text-text-muted" />
        </button>
        <Button
          kind="primary"
          size="sm"
          icon={Send}
          disabled={!canSubmit}
          onClick={onSubmit}
        >
          Send
        </Button>
      </div>
    </div>
  );
}
