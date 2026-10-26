import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

const MOCK_TIP = "Hug the left wall to skip the first ambush.";
const MOCK_LOBBY_CHATTER = "Lobby is live. Let's make this run legendary!";

async function expectNoCriticalViolations(page: Page): Promise<void> {
  const results = await new AxeBuilder({ page }).analyze();
  const critical = results.violations.filter(
    (violation) => violation.impact === "critical",
  );
  expect(
    critical.map((violation) => `${violation.id} x${violation.nodes.length}`),
  ).toEqual([]);
}

async function signIn(page: Page): Promise<void> {
  await page.goto("/");
  await page.getByRole("button", { name: "Log In" }).first().click();
  const dialog = page.getByRole("dialog", { name: "Welcome Back" });
  await dialog.getByLabel("Email").fill("player@example.com");
  await dialog.getByLabel("Password").fill("password");
  await dialog.getByRole("button", { name: /Log In/ }).click();
  await page.waitForURL("**/dashboard");
}

test("home renders and has zero critical axe violations", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { level: 1, name: /Play Anything\./ }),
  ).toBeVisible();
  await expectNoCriticalViolations(page);
});

test("the dashboard sends signed-out visitors home", async ({ page }) => {
  await page.goto("/dashboard/wallet");
  await page.waitForURL((url) => url.pathname === "/");
  await expect(
    page.getByRole("heading", { level: 1, name: /Play Anything\./ }),
  ).toBeVisible();
});

const dashboardRoutes = [
  { path: "/dashboard", heading: /Command Center/ },
  { path: "/dashboard/rentals", heading: /Console Market/ },
  { path: "/dashboard/library", heading: /Game Library/ },
  { path: "/dashboard/tournaments", heading: /Tournaments/ },
  { path: "/dashboard/leaderboard", heading: /Global Rankings/ },
  { path: "/dashboard/wallet", heading: /Virtual Wallet/ },
];

for (const route of dashboardRoutes) {
  test(`${route.path} renders and has zero critical axe violations`, async ({
    page,
  }) => {
    await signIn(page);
    await page.goto(route.path);
    await expect(
      page.getByRole("heading", { level: 1, name: route.heading }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: /Rentals/ }).first(),
    ).toBeVisible();
    await expectNoCriticalViolations(page);
  });
}

test("library play opens rentals filtered to that game", async ({ page }) => {
  await signIn(page);
  await page.getByRole("link", { name: "Game Library" }).click();
  await page.waitForURL("**/dashboard/library");
  const firstPlay = page.getByRole("button", { name: /^Play / }).first();
  await firstPlay.hover();
  await firstPlay.click();
  await page.waitForURL("**/dashboard/rentals?game=*");
  await expect(
    page.getByRole("heading", { level: 1, name: /^Play / }),
  ).toBeVisible();
});

test("a rental starts a session whose AI calls hit the mocks", async ({
  page,
}) => {
  await signIn(page);
  await page.getByRole("link", { name: "Rentals" }).click();
  await page.waitForURL("**/dashboard/rentals");
  await page
    .getByRole("button", { name: /Select & Play/ })
    .first()
    .click();

  const library = page.getByRole("dialog");
  await expect(library).toBeVisible();
  await library.getByRole("button").nth(1).click();
  await page.waitForURL("**/dashboard/session");

  await expect(page.getByRole("button", { name: "END SESSION" })).toBeVisible();
  await expect(page.getByText(MOCK_LOBBY_CHATTER)).toBeVisible({
    timeout: 10_000,
  });

  await page.getByRole("button", { name: /Ask AI/ }).click();
  await expect(page.getByText(MOCK_TIP)).toBeVisible();

  await expectNoCriticalViolations(page);

  await page.getByRole("button", { name: "END SESSION" }).click();
  await page.waitForURL("**/dashboard");
});
