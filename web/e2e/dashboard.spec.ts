import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

/**
 * The mock server keeps state per user id, so each journey signs in as its
 * own test user and can change data without affecting the others. Ids that
 * begin `usr_new` are first-time users; the rest start with sample games.
 */
async function signInAs(page: Page, userId: string): Promise<void> {
  // Start from this user's seed, even on a server an earlier run used.
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

const card = (page: Page, title: string) =>
  page.getByRole("article", { name: title });

test.describe("age check", () => {
  test("a first-time creator confirms once and reaches My Games", async ({
    page,
  }) => {
    await signInAs(page, "usr_new_confirm");
    await expect(
      page.getByRole("heading", { level: 1, name: "One quick check" }),
    ).toBeVisible();
    await expectNoBlockingViolations(page);

    await page.getByRole("button", { name: "I am 16 or older" }).click();
    await expect(
      page.getByRole("heading", { level: 1, name: "My Games" }),
    ).toBeVisible();
    await expect(page.getByText("No games yet")).toBeVisible();

    // Asked once: it does not come back on the next visit.
    await page.reload();
    await expect(
      page.getByRole("heading", { level: 1, name: "My Games" }),
    ).toBeVisible();
  });

  test("an under-16 answer explains that playing stays open, and Settings still works", async ({
    page,
  }) => {
    await signInAs(page, "usr_new_under");
    await page.getByRole("button", { name: "I am under 16" }).click();
    await expect(
      page.getByRole("heading", { level: 1, name: "You can still play" }),
    ).toBeVisible();

    await page.getByRole("link", { name: "Settings" }).click();
    await expect(
      page.getByRole("heading", { level: 1, name: "Settings" }),
    ).toBeVisible();
    await expect(page.getByLabel("Display name")).toHaveValue("New Player");
  });
});

test.describe("my games", () => {
  test("lists the user's games with their status", async ({ page }) => {
    await signInAs(page, "usr_list");
    await expect(page.getByRole("article")).toHaveCount(4);
    await expect(card(page, "Neon Stack")).toContainText("Published");
    await expect(card(page, "Coin Canyon")).toContainText("In review");
    await expect(card(page, "Starfall Patrol")).toContainText("Draft");
    await expect(card(page, "Kart Draft")).toContainText("Not approved");
    await expectNoBlockingViolations(page);
  });

  test("renames a game", async ({ page }) => {
    await signInAs(page, "usr_rename");
    await page
      .getByRole("button", { name: "Actions for Starfall Patrol" })
      .click();
    await page.getByRole("menuitem", { name: "Rename" }).click();
    const dialog = page.getByRole("dialog", { name: "Rename game" });
    await dialog.getByLabel("Title").fill("Comet Patrol");
    await dialog.getByRole("button", { name: "Save" }).click();

    await expect(dialog).toBeHidden();
    await expect(card(page, "Comet Patrol")).toBeVisible();
    await expect(card(page, "Starfall Patrol")).toHaveCount(0);
    await expect(page.getByText("Game renamed.")).toBeVisible();
  });

  test("unpublishes a game", async ({ page }) => {
    await signInAs(page, "usr_unpublish");
    await page.getByRole("button", { name: "Actions for Neon Stack" }).click();
    await page.getByRole("menuitem", { name: "Unpublish" }).click();
    await page
      .getByRole("dialog", { name: "Unpublish this game?" })
      .getByRole("button", { name: "Unpublish" })
      .click();
    await expect(card(page, "Neon Stack")).toContainText("Draft");
  });

  test("deletes a game only after the username is typed", async ({ page }) => {
    await signInAs(page, "usr_delete");
    await page.getByRole("button", { name: "Actions for Kart Draft" }).click();
    await page.getByRole("menuitem", { name: "Delete" }).click();
    const dialog = page.getByRole("dialog", { name: "Delete this game?" });
    const confirm = dialog.getByRole("button", { name: "Delete game" });
    await expect(confirm).toBeDisabled();
    await expectNoBlockingViolations(page);

    await dialog.getByLabel("Type delete to confirm").fill("delete");
    await confirm.click();
    await expect(card(page, "Kart Draft")).toHaveCount(0);
    await expect(page.getByRole("article")).toHaveCount(3);
  });

  test("shows an error with a way to retry when the list fails", async ({
    page,
  }) => {
    await signInAs(page, "usr_error");
    await page.goto("/dashboard?fail=1");
    await expect(page.getByRole("main").getByRole("alert")).toContainText(
      "We could not load your games.",
    );
    await expect(page.getByRole("button", { name: "Try again" })).toBeVisible();
  });

  test("fits a phone without sideways scrolling", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await signInAs(page, "usr_phone");
    await expect(page.getByRole("article")).toHaveCount(4);
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - window.innerWidth,
    );
    expect(overflow).toBeLessThanOrEqual(0);
  });
});

test.describe("settings", () => {
  test("saves the display name", async ({ page }) => {
    await signInAs(page, "usr_profile");
    await page.goto("/dashboard/settings");
    await page.getByLabel("Display name").fill("Ada Lovelace");
    await page.getByRole("button", { name: "Save" }).click();
    await expect(page.getByText("Profile saved.")).toBeVisible();

    await page.getByRole("button", { name: "Account menu" }).click();
    await expect(page.getByRole("menu", { name: "Account" })).toContainText(
      "Ada Lovelace",
    );
    await expectNoBlockingViolations(page);
  });

  test("the tabs are routes, and Appearance switches the theme", async ({
    page,
  }) => {
    await signInAs(page, "usr_theme");
    await page.goto("/dashboard/settings");
    await page.getByRole("tab", { name: "Appearance" }).click();
    await page.waitForURL("**/dashboard/settings/appearance");
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");

    await page.getByRole("radio", { name: "Dark" }).click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
    await expectNoBlockingViolations(page);
  });

  test("deleting the account asks for the username, then signs out", async ({
    page,
  }) => {
    await signInAs(page, "usr_goodbye");
    await page.goto("/dashboard/settings/data-privacy");
    await page.getByRole("button", { name: "Delete account" }).click();
    const dialog = page.getByRole("dialog", { name: "Delete your account?" });
    const confirm = dialog.getByRole("button", { name: "Delete account" });
    await expect(confirm).toBeDisabled();
    await dialog.getByLabel("Type goodbye to confirm").fill("goodbye");
    await confirm.click();

    await page.waitForURL((url) => url.pathname === "/");
    await page.goto("/dashboard");
    await page.waitForURL((url) => url.pathname === "/signin");
  });

  test("signing out from the account menu returns to sign in", async ({
    page,
  }) => {
    await signInAs(page, "usr_signout");
    await page.getByRole("button", { name: "Account menu" }).click();
    await page.getByRole("menuitem", { name: "Sign out" }).click();
    await page.waitForURL((url) => url.pathname === "/signin");
  });
});
