"use client";

/**
 * The sign-in screen: Google is the only login method (C-3). Playing
 * published games needs no account.
 */

import Link from "next/link";
import GoogleAuthButton from "@/components/ui/GoogleAuthButton";
import LogoPlaceholder from "@/components/ui/LogoPlaceholder";
import { useAuthController } from "@/controllers/auth";

export const TERMS_URL = "https://terms.cuesoft.io";
export const PRIVACY_URL = "https://privacy.cuesoft.io";

const linkClass =
  "underline underline-offset-2 hover:text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring";

export default function SigninView() {
  const { loading, error, signInWithGoogle } = useAuthController();

  return (
    <div className="flex min-h-screen flex-col bg-bg-base text-text-primary">
      <header className="mx-auto flex h-16 w-full max-w-[1312px] items-center px-4 md:px-8">
        <Link
          href="/"
          aria-label="Consoless home"
          className="rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
        >
          <LogoPlaceholder />
        </Link>
      </header>
      <main
        id="main"
        tabIndex={-1}
        className="flex flex-1 items-center justify-center px-4 py-12"
      >
        <div className="flex w-full max-w-110 flex-col items-center gap-6 rounded-xl border border-border-default bg-bg-surface p-8">
          <div className="flex flex-col gap-2 text-center">
            <h1 className="text-heading-lg">Sign in to start building</h1>
            <p className="text-body-md text-text-secondary">
              Playing published games needs no account.
            </p>
          </div>
          {error ? (
            <p role="alert" className="text-body-sm text-danger-text">
              {error}
            </p>
          ) : null}
          <GoogleAuthButton
            className="w-full"
            loading={loading}
            onClick={() => void signInWithGoogle()}
          />
          <p className="text-center text-caption text-text-muted">
            By continuing you agree to the{" "}
            <a
              href={TERMS_URL}
              target="_blank"
              rel="noreferrer"
              className={linkClass}
            >
              Terms
            </a>{" "}
            and{" "}
            <a
              href={PRIVACY_URL}
              target="_blank"
              rel="noreferrer"
              className={linkClass}
            >
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </main>
    </div>
  );
}
