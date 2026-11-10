import { expect, test } from "@playwright/test";

// The single auth screen: Google only (C-3), with the legal links. In
// TEST_MODE the button signs in a local test user without contacting Google.
test.describe("sign in", () => {
  test("offers Google only, with the Terms and Privacy links", async ({
    page,
  }) => {
    await page.goto("/signin");
    await expect(
      page.getByRole("heading", {
        level: 1,
        name: "Sign in to start building",
      }),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Continue with Google" }),
    ).toBeVisible();
    // One way in: no second provider, no email form.
    await expect(
      page.getByRole("button", {
        name: /continue with|sign in|sign up|log in/i,
      }),
    ).toHaveCount(1);
    await expect(page.locator("input")).toHaveCount(0);
    await expect(page.getByRole("link", { name: "Terms" })).toHaveAttribute(
      "href",
      "https://terms.cuesoft.io",
    );
    await expect(
      page.getByRole("link", { name: "Privacy Policy" }),
    ).toHaveAttribute("href", "https://privacy.cuesoft.io");
  });

  test("signing in opens the dashboard", async ({ page }) => {
    await page.goto("/signin");
    await page.getByRole("button", { name: "Continue with Google" }).click();
    await page.waitForURL("**/dashboard");
  });

  test("a signed-out visitor to the dashboard lands on sign in", async ({
    page,
  }) => {
    await page.goto("/dashboard");
    await page.waitForURL((url) => url.pathname === "/signin");
  });

  test("a signed-in visitor never sees the sign-in screen", async ({
    page,
  }) => {
    await page.goto("/signin");
    await page.getByRole("button", { name: "Continue with Google" }).click();
    await page.waitForURL("**/dashboard");
    await page.goto("/signin");
    await page.waitForURL("**/dashboard");
  });
});
