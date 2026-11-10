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

const chat = (page: Page) => page.getByRole("region", { name: "Chat" });
const prompt = (page: Page) => chat(page).getByRole("textbox");

test.describe("studio", () => {
  test("a prompt becomes a game, and a follow-up saves a new version", async ({
    page,
  }) => {
    await signInAs(page, "usr_make");
    await page.getByRole("link", { name: "New game" }).click();
    await page.waitForURL("**/dashboard/studio/new");
    await expectNoBlockingViolations(page);

    await page.getByRole("radio", { name: /8-bit/ }).click();
    await page
      .getByRole("textbox")
      .fill("A platformer where you collect coins");
    await page.getByRole("button", { name: "Send" }).click();
    await page.waitForURL(/\/dashboard\/studio\/prj_/);

    // The prompt box is locked while the game is being built.
    await expect(prompt(page)).toBeDisabled();
    await expect(chat(page).getByText("Version 1 is ready")).toBeVisible({
      timeout: 20_000,
    });
    await expect(page.getByTestId("preview-frame")).toHaveAttribute(
      "data-style",
      "8bit",
    );
    await expect(
      page.getByRole("list", { name: "Versions" }).getByRole("listitem"),
    ).toHaveCount(1);
    await expectNoBlockingViolations(page);

    await prompt(page).fill("Add a second level");
    await prompt(page).press("Enter");
    await expect(chat(page).getByText("Version 2 is ready")).toBeVisible({
      timeout: 20_000,
    });
    await expect(
      page.getByRole("list", { name: "Versions" }).getByRole("listitem"),
    ).toHaveCount(2);

    // It is in My Games, and opens again from there.
    await page.getByRole("link", { name: "Back to My Games" }).click();
    await page.waitForURL((url) => url.pathname === "/dashboard");
    await page.getByRole("link", { name: "Platformer Collect Coins" }).click();
    await expect(
      page.getByRole("heading", { level: 1, name: "Platformer Collect Coins" }),
    ).toBeVisible();
  });

  test("a failed build keeps the last version and offers another try", async ({
    page,
  }) => {
    await signInAs(page, "usr_fail");
    await page.goto("/dashboard/studio/prj_starfall");
    await prompt(page).fill("Add a boss [fail]");
    await prompt(page).press("Enter");
    await expect(chat(page).getByText("We could not build this")).toBeVisible({
      timeout: 20_000,
    });
    await expect(page.getByTestId("preview-frame")).toHaveAttribute(
      "data-version",
      "2",
    );
    await expect(
      chat(page).getByRole("button", { name: "Try again" }),
    ).toBeVisible();
  });

  test("a prompt that breaks the rules is refused without using a generation", async ({
    page,
  }) => {
    await signInAs(page, "usr_refuse");
    await page.goto("/dashboard/studio/prj_starfall");
    const meter = page.getByRole("meter", { name: "Generations left today" });
    await expect(meter).toHaveAttribute("aria-valuenow", "14");
    await prompt(page).fill("Something not allowed [refuse]");
    await prompt(page).press("Enter");
    await expect(chat(page).getByText(/did not use a generation/)).toBeVisible({
      timeout: 20_000,
    });
    await expect(meter).toHaveAttribute("aria-valuenow", "14");
    await expect(prompt(page)).toBeEnabled();
  });

  test("an older version can be previewed and restored", async ({ page }) => {
    await signInAs(page, "usr_versions");
    await page.goto("/dashboard/studio/prj_neonstack");
    const versions = page.getByRole("list", { name: "Versions" });
    await expect(versions.getByRole("listitem")).toHaveCount(6);

    await versions.getByRole("button", { name: /Version 2/ }).click();
    await expect(page.getByTestId("preview-frame")).toHaveAttribute(
      "data-version",
      "2",
    );
    await page.getByRole("button", { name: "Restore this version" }).click();
    await expect(versions.getByRole("listitem")).toHaveCount(7);
    await expect(versions.getByRole("listitem").first()).toContainText(
      "Restored version 2",
    );
    await expect(page.getByTestId("preview-frame")).toHaveAttribute(
      "data-version",
      "7",
    );
  });

  test("switching the console style changes the frame and makes no version", async ({
    page,
  }) => {
    await signInAs(page, "usr_style");
    await page.goto("/dashboard/studio/prj_starfall");
    await page.getByRole("tab", { name: "Style" }).click();
    await page.getByRole("radio", { name: /Modern/ }).click();
    await expect(page.getByTestId("preview-frame")).toHaveAttribute(
      "data-style",
      "modern",
    );
    await page.getByRole("tab", { name: "Versions" }).click();
    await expect(
      page.getByRole("list", { name: "Versions" }).getByRole("listitem"),
    ).toHaveCount(2);
  });

  test("a code edit that fails its check is kept and names the line; a fixed one becomes a version", async ({
    page,
  }) => {
    await signInAs(page, "usr_code");
    await page.goto("/dashboard/studio/prj_starfall");
    await page.getByRole("tab", { name: "Code" }).click();
    const code = page.getByRole("textbox", { name: "Code" });
    await expect(code).toHaveValue(/defineGame/);
    await expectNoBlockingViolations(page);

    await code.fill("export default {\n  speed: 9,\n");
    await page.getByRole("button", { name: "Save" }).click();
    await expect(page.getByRole("main").getByRole("alert")).toContainText(
      "Line 3: Expected '}'.",
      { timeout: 15_000 },
    );
    await expect(code).toHaveValue("export default {\n  speed: 9,\n");

    await code.fill("export default {\n  speed: 9,\n};\n");
    await page.getByRole("button", { name: "Save" }).click();
    await expect(
      page.getByText("Your edit passed its checks and is a new version."),
    ).toBeVisible({ timeout: 15_000 });
    await expect(
      page
        .getByRole("list", { name: "Versions" })
        .getByRole("listitem")
        .first(),
    ).toContainText("Edited the code by hand");
  });

  test("publishing sends the game for review", async ({ page }) => {
    await signInAs(page, "usr_publish");
    await page.goto("/dashboard/studio/prj_starfall");
    await page.getByRole("button", { name: "Publish" }).click();
    const dialog = page.getByRole("dialog", {
      name: "Publish Starfall Patrol?",
    });
    await expectNoBlockingViolations(page);
    await dialog.getByRole("button", { name: "Send for review" }).click();
    await expect(dialog).toBeHidden();
    await expect(page.getByText(/This game is in review/)).toBeVisible();
    await expect(page.getByRole("button", { name: "Publish" })).toBeDisabled();
  });

  test("an unknown game explains itself", async ({ page }) => {
    await signInAs(page, "usr_missing");
    await page.goto("/dashboard/studio/prj_nope");
    await expect(page.getByText("We could not find this game")).toBeVisible();
    await page.getByRole("link", { name: "Go to My Games" }).click();
    await page.waitForURL((url) => url.pathname === "/dashboard");
  });

  test("fits a phone without sideways scrolling", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await signInAs(page, "usr_studiophone");
    await page.goto("/dashboard/studio/prj_starfall");
    await expect(page.getByTestId("preview-frame")).toBeVisible();
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - window.innerWidth,
    );
    expect(overflow).toBeLessThanOrEqual(0);
  });
});
