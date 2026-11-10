import type { Metadata } from "next";
import SignInGate from "./SignInGate";
import SigninView from "./SigninView";

// The single auth screen, Google only (C-3). SignInGate replaces a
// signed-in visitor to /dashboard; the page stays a server component so
// its metadata is served.
export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to Consoless with Google to start making games.",
};

export default function SignInPage() {
  return (
    <SignInGate>
      <SigninView />
    </SignInGate>
  );
}
