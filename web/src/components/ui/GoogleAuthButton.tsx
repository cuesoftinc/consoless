"use client";

/**
 * GoogleAuthButton (docs/design.md section 3): the only sign-in call to
 * action (C-3). Presentational: the caller owns the sign-in. MI-2: while
 * loading, the label reads "Signing in…" and the glyph becomes a spinner.
 * The Google glyph keeps its official colours, the documented raw-hex
 * exception for this file.
 */

import { cn } from "@/lib/cn";

export interface GoogleAuthButtonProps {
  onClick?: () => void;
  loading?: boolean;
  disabled?: boolean;
  label?: string;
  className?: string;
}

export default function GoogleAuthButton({
  onClick,
  loading = false,
  disabled = false,
  label = "Continue with Google",
  className,
}: GoogleAuthButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      data-state={loading ? "loading" : "default"}
      className={cn(
        "inline-flex h-12 items-center justify-center gap-3 rounded-md border border-border-strong bg-bg-raised px-6 text-label-md text-text-primary",
        "transition-colors duration-fast ease-enter hover:bg-bg-hover motion-reduce:transition-none",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring",
        "disabled:cursor-not-allowed disabled:opacity-40",
        className,
      )}
    >
      {loading ? (
        <span
          data-testid="google-auth-loading"
          aria-hidden
          className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent motion-reduce:animate-none"
        />
      ) : (
        <svg aria-hidden="true" viewBox="0 0 48 48" className="h-5 w-5">
          <path
            fill="#EA4335"
            d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
          />
          <path
            fill="#4285F4"
            d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
          />
          <path
            fill="#FBBC05"
            d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
          />
          <path
            fill="#34A853"
            d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
          />
        </svg>
      )}
      <span>{loading ? "Signing in…" : label}</span>
    </button>
  );
}
