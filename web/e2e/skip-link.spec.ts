import { expect, test, type Page } from "@playwright/test";

async function expectSkipLinkFlow(page: Page) {
  await page.locator("body").focus();

  await page.keyboard.press("Tab");
  const skip = page.getByRole("link", { name: "Skip to content" });
  await expect(skip).toBeFocused();

  await page.keyboard.press("Enter");
  await expect(page.locator("main#main")).toBeFocused();
}

test("home: first Tab lands on the skip link; activating it focuses #main", async ({
  page,
}) => {
  await page.goto("/");
  await expectSkipLinkFlow(page);
});

test("dashboard: first Tab lands on the skip link; activating it focuses #main", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Continue with Google" }).click();
  await page.waitForURL("**/dashboard");

  await page.goto("/dashboard");
  await expect(page.locator("main#main")).toBeVisible();
  await expectSkipLinkFlow(page);
});
