import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { getAuthProvider } from "@/auth";
import SignInGate from "./SignInGate";
import SigninView, { PRIVACY_URL, TERMS_URL } from "./SigninView";

const push = vi.fn();
const replace = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push, replace }),
}));

beforeEach(() => {
  push.mockClear();
  replace.mockClear();
  window.sessionStorage.clear();
});

describe("SignInGate", () => {
  it("shows the sign-in screen to a signed-out visitor", async () => {
    render(
      <SignInGate>
        <SigninView />
      </SignInGate>,
    );
    expect(screen.getByTestId("signin-gate")).toHaveAttribute(
      "aria-busy",
      "true",
    );
    expect(
      await screen.findByRole("heading", {
        level: 1,
        name: "Sign in to start building",
      }),
    ).toBeInTheDocument();
    expect(replace).not.toHaveBeenCalled();
  });

  it("replaces a signed-in visitor to the dashboard and never shows the screen", async () => {
    await getAuthProvider().signInWithGoogle();
    render(
      <SignInGate>
        <SigninView />
      </SignInGate>,
    );
    await waitFor(() => expect(replace).toHaveBeenCalledWith("/dashboard"));
    expect(screen.queryByRole("heading", { level: 1 })).not.toBeInTheDocument();
  });
});

describe("SigninView", () => {
  it("offers Google only, with the legal links", () => {
    render(<SigninView />);
    expect(
      screen.getByRole("button", { name: "Continue with Google" }),
    ).toBeInTheDocument();
    expect(screen.queryByLabelText(/password/i)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/email/i)).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Terms" })).toHaveAttribute(
      "href",
      TERMS_URL,
    );
    expect(
      screen.getByRole("link", { name: "Privacy Policy" }),
    ).toHaveAttribute("href", PRIVACY_URL);
  });

  it("signs in and opens the dashboard", async () => {
    render(<SigninView />);
    await userEvent.click(
      screen.getByRole("button", { name: "Continue with Google" }),
    );
    await waitFor(() => expect(push).toHaveBeenCalledWith("/dashboard"));
  });
});
