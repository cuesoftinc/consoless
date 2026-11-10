import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

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
  await page.goto("/signin");
  await page.getByRole("button", { name: "Continue with Google" }).click();
  await page.waitForURL("**/dashboard");
}

test("home renders and has zero critical axe violations", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "Describe it. Play it. Share it.",
    }),
  ).toBeVisible();
  await expectNoCriticalViolations(page);
});

test("the dashboard sends signed-out visitors to sign in", async ({ page }) => {
  await page.goto("/dashboard/leaderboard");
  await page.waitForURL((url) => url.pathname === "/signin");
  await expect(
    page.getByRole("heading", { level: 1, name: "Sign in to start building" }),
  ).toBeVisible();
});

const dashboardRoutes = [
  { path: "/dashboard", heading: /Command Center/ },
  { path: "/dashboard/leaderboard", heading: /Global Rankings/ },
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
      page.getByRole("link", { name: /Leaderboard/ }).first(),
    ).toBeVisible();
    await expectNoCriticalViolations(page);
  });
}
