import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

async function expectNoBlockingViolations(page: Page): Promise<void> {
  const results = await new AxeBuilder({ page }).analyze();
  const blocking = results.violations.filter(
    (violation) =>
      violation.impact === "critical" || violation.impact === "serious",
  );
  expect(
    blocking.map(
      (violation) =>
        `${violation.id} x${violation.nodes.length}: ${violation.nodes
          .slice(0, 3)
          .map((node) => node.target.join(" "))
          .join(" | ")}`,
    ),
  ).toEqual([]);
}

async function signInAs(page: Page, userId: string): Promise<void> {
  await page.request.post("/api/mock/v1/testing/reset", {
    data: { user_id: userId },
  });
  await page.addInitScript((id) => {
    window.localStorage.setItem("consoless.test-user", id);
  }, userId);
  await page.goto("/signin");
  await page.getByRole("button", { name: "Continue with Google" }).click();
  await page.waitForURL("**/dashboard");
}

const games = (page: Page) => page.getByRole("main").getByRole("listitem");

test.describe("arcade", () => {
  test("anyone can browse without an account", async ({ page }) => {
    await page.goto("/arcade");
    await expect(
      page.getByRole("heading", { level: 1, name: "Arcade" }),
    ).toBeVisible();
    await expect(games(page)).toHaveCount(8);
    await expect(games(page).first()).toContainText("Neon Stack");
    await expect(games(page).first()).toContainText("by Player One");
    await expect(page.getByRole("link", { name: "Sign in" })).toBeVisible();
    await expectNoBlockingViolations(page);
  });

  test("search and the style filter narrow the list", async ({ page }) => {
    await page.goto("/arcade");
    await page.getByRole("searchbox", { name: "Search" }).fill("stack");
    await expect(games(page)).toHaveCount(2);

    await page.getByRole("combobox", { name: "Console style" }).click();
    await page.getByRole("option", { name: "8-bit" }).click();
    await expect(page.getByText("No games match")).toBeVisible();

    await page.getByRole("button", { name: "Clear search" }).click();
    await expect(games(page)).toHaveCount(8);
  });

  test("shows an error with a way to retry", async ({ page }) => {
    await page.goto("/arcade?fail=1");
    await expect(page.getByRole("main").getByRole("alert")).toContainText(
      "We could not load the Arcade.",
    );
    await expect(page.getByRole("button", { name: "Try again" })).toBeVisible();
  });

  test("fits a phone without sideways scrolling", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/arcade");
    await expect(games(page)).toHaveCount(8);
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - window.innerWidth,
    );
    expect(overflow).toBeLessThanOrEqual(0);
  });

  test("the Dark theme passes the accessibility checks", async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem("consoless.theme", "dark");
    });
    await page.goto("/arcade");
    await expect(games(page)).toHaveCount(8);
    await expectNoBlockingViolations(page);
  });
});

test.describe("game page", () => {
  test("shows the game, its prompt and the leaderboard", async ({ page }) => {
    await page.goto("/arcade");
    await page.getByRole("link", { name: /Neon Stack/ }).click();
    await page.waitForURL("**/arcade/neon-stack");
    await expect(
      page.getByRole("heading", { level: 1, name: "Neon Stack" }),
    ).toBeVisible();
    await expect(
      page.getByText(
        "A falling-block puzzle on a handheld with a green screen",
      ),
    ).toBeVisible();
    const board = page.getByRole("region", { name: "Leaderboard" });
    await expect(board.getByRole("listitem")).toHaveCount(4);
    await expect(board.getByRole("listitem").first()).toContainText("Mei");
    await expect(board.getByRole("listitem").first()).toContainText("48,200");
    await expectNoBlockingViolations(page);
  });

  test("a remix credits the original and links to it", async ({ page }) => {
    await page.goto("/arcade/moss-stack");
    await expect(page.getByText(/A remix of/)).toContainText("by Player One");
    await page
      .getByRole("main")
      .getByRole("link", { name: "Neon Stack" })
      .click();
    await page.waitForURL("**/arcade/neon-stack");
  });

  test("a game with no scores says so", async ({ page }) => {
    await page.goto("/arcade/harbour-dash");
    await expect(page.getByTestId("no-scores")).toHaveText("No scores yet.");
  });

  test("an unknown game explains itself and links back", async ({ page }) => {
    await page.goto("/arcade/not-a-game");
    await expect(page.getByText("This game is not available")).toBeVisible();
    await page.getByRole("link", { name: "Browse the Arcade" }).click();
    await page.waitForURL((url) => url.pathname === "/arcade");
  });

  test("share copies the public link", async ({ page, context }) => {
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await page.goto("/arcade/coin-run");
    await page.getByRole("button", { name: "Share" }).click();
    const dialog = page.getByRole("dialog", { name: "Share Coin Run" });
    await expect(dialog.getByLabel("Link")).toHaveValue(/\/arcade\/coin-run$/);
    await expectNoBlockingViolations(page);
    await dialog.getByRole("button", { name: "Copy link" }).click();
    await expect(
      dialog.getByRole("button", { name: "Link copied" }),
    ).toBeVisible();
    const copied = await page.evaluate(() => navigator.clipboard.readText());
    expect(copied).toMatch(/\/arcade\/coin-run$/);
  });

  test("anyone can report a game", async ({ page }) => {
    await page.goto("/arcade/comet-guard");
    await page.getByRole("button", { name: "Report" }).click();
    const dialog = page.getByRole("dialog", { name: "Report Comet Guard" });
    const send = dialog.getByRole("button", { name: "Send report" });
    await expect(send).toBeDisabled();
    await dialog.getByRole("radio", { name: "It does not work" }).click();
    await send.click();
    await expect(
      page.getByRole("dialog", { name: "Report sent" }),
    ).toBeVisible();
  });

  test("a visitor is asked to sign in before remixing", async ({ page }) => {
    await page.goto("/arcade/orbit-drop");
    await page.getByRole("button", { name: "Remix" }).click();
    const dialog = page.getByRole("dialog", { name: "Sign in to remix" });
    await dialog.getByRole("link", { name: "Sign in" }).click();
    await page.waitForURL((url) => url.pathname === "/signin");
  });

  test("a signed-in player remixes a game into My Games", async ({ page }) => {
    await signInAs(page, "usr_remix");
    await page.getByRole("link", { name: "Arcade" }).click();
    await page.waitForURL((url) => url.pathname === "/arcade");
    await expect(page.getByRole("link", { name: "My Games" })).toBeVisible();

    await page.getByRole("link", { name: /Orbit Drop/ }).click();
    await page.getByRole("button", { name: "Remix" }).click();
    await page
      .getByRole("dialog", { name: "Remix Orbit Drop?" })
      .getByRole("button", { name: "Remix" })
      .click();

    await page.waitForURL("**/dashboard");
    await expect(
      page.getByRole("article", { name: "Orbit Drop remix" }),
    ).toContainText("Draft");
  });
});
