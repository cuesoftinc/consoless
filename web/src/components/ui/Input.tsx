"use client";

/**
 * Input (docs/design.md section 3): a labelled text field, 48px tall.
 * The helper line sits under the field. An error replaces the helper,
 * is announced with role="alert" and marks the field aria-invalid, so
 * colour is never the only signal.
 */

import { useId, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export type InputState = "default" | "error" | "disabled";

export interface InputProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "className"
> {
  /** Visible label, wired to the field. */
  label: string;
  /** Hint under the field. */
  helper?: string;
  /** Error message. Replaces the helper. */
  error?: string;
  /** Merged onto the wrapper. */
  className?: string;
}

export default function Input({
  label,
  helper,
  error,
  className,
  id,
  disabled,
  type = "text",
  "aria-describedby": describedBy,
  ...rest
}: InputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const messageId = `${inputId}-message`;
  const message = error || helper;
  const state: InputState = disabled ? "disabled" : error ? "error" : "default";

  return (
    <div
      data-testid="input-root"
      data-state={state}
      className={cn("flex w-full flex-col gap-2", className)}
    >
      <label htmlFor={inputId} className="text-label-md text-text-secondary">
        {label}
      </label>
      <input
        id={inputId}
        type={type}
        disabled={disabled}
        aria-invalid={error ? "true" : undefined}
        aria-describedby={
          cn(describedBy, message ? messageId : undefined) || undefined
        }
        className={cn(
          "h-12 w-full rounded-md border bg-bg-inset px-3 text-body-md text-text-primary placeholder:text-text-muted",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring",
          "disabled:cursor-not-allowed disabled:opacity-40",
          error ? "border-danger-default" : "border-border-default",
        )}
        {...rest}
      />
      {error ? (
        <p
          id={messageId}
          role="alert"
          className="text-caption text-danger-text"
        >
          {error}
        </p>
      ) : helper ? (
        <p id={messageId} className="text-caption text-text-muted">
          {helper}
        </p>
      ) : null}
    </div>
  );
}
