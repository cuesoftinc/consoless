import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

// The component gallery doubles as the check that design tokens reach the
// rendered page: a token utility that compiles to nothing leaves a control
// without its fill, which unit tests (class names only) cannot see.
const GALLERY = "/dev/components";

test.describe("component gallery", () => {
  test("token colours resolve in the Light theme", async ({ page }) => {
    await page.goto(GALLERY);
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");

    const primary = page.getByRole("button", { name: "primary", exact: true });
    await expect(primary).toHaveCSS("background-color", "rgb(10, 110, 120)");
    await expect(primary).toHaveCSS("color", "rgb(255, 255, 255)");
    await expect(primary).toHaveCSS("border-radius", "8px");

    const danger = page.getByRole("button", { name: "danger", exact: true });
    await expect(danger).toHaveCSS("background-color", "rgb(200, 30, 30)");

    await expect(
      page.getByRole("heading", { level: 1, name: "Component gallery" }),
    ).toHaveCSS("color", "rgb(15, 14, 23)");
  });

  test("the theme toggle switches every token to Dark", async ({ page }) => {
    await page.goto(GALLERY);
    await page.getByTestId("theme-toggle").first().click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");

    const primary = page.getByRole("button", { name: "primary", exact: true });
    await expect(primary).toHaveCSS("background-color", "rgb(15, 240, 252)");
    await expect(primary).toHaveCSS("color", "rgb(15, 14, 23)");
    await expect(
      page.getByRole("heading", { level: 1, name: "Component gallery" }),
    ).toHaveCSS("color", "rgb(245, 246, 250)");
  });

  test("the type scale applies size, line height and weight", async ({
    page,
  }) => {
    await page.goto(GALLERY);
    const heading = page.getByRole("heading", { level: 2, name: "Button" });
    await expect(heading).toHaveCSS("font-size", "20px");
    await expect(heading).toHaveCSS("line-height", "28px");
    await expect(heading).toHaveCSS("font-weight", "600");
  });

  test("the modal opens, traps Escape and returns focus", async ({ page }) => {
    await page.goto(GALLERY);
    const trigger = page.getByRole("button", { name: "Open the modal" });
    await trigger.click();
    const dialog = page.getByRole("dialog", { name: "Delete Block Drop?" });
    await expect(dialog).toBeVisible();
    await page.keyboard.press("Tab");
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(trigger).toBeFocused();
  });

  for (const theme of ["light", "dark"] as const) {
    test(`has zero critical or serious axe violations in ${theme}`, async ({
      page,
    }) => {
      await page.addInitScript((value) => {
        window.localStorage.setItem("consoless.theme", value);
      }, theme);
      await page.goto(GALLERY);
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
    });
  }
});
