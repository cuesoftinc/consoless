import { expect, test } from "@playwright/test";

// Theme contract: `data-theme` on <html> carries the resolved theme, set
// before first paint. No stored preference = light, the design default
// (P-04). The preference persists at localStorage `consoless.theme`.
test.describe("theme boot", () => {
  test("boots light when no preference is stored", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  });

  test("applies a stored dark preference on load", async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem("consoless.theme", "dark");
    });
    await page.goto("/");
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  });

  test("resolves a stored system preference from the OS setting", async ({
    page,
  }) => {
    await page.emulateMedia({ colorScheme: "dark" });
    await page.addInitScript(() => {
      window.localStorage.setItem("consoless.theme", "system");
    });
    await page.goto("/");
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  });
});
