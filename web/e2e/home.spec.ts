import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const GITBOOK = "https://cuesoft.gitbook.io/consoless";
const GITHUB = "https://github.com/cuesoftinc/consoless";

test.describe("home", () => {
  test("the marketing nav carries the shared link inventory", async ({
    page,
  }) => {
    await page.goto("/");
    const nav = page.getByRole("navigation", { name: "Marketing" });
    await expect(
      nav.getByRole("link", { name: "Features", exact: true }),
    ).toHaveAttribute("href", "#features");
    await expect(
      nav.getByRole("link", { name: "Consoles", exact: true }),
    ).toHaveAttribute("href", "#consoles");
    await expect(
      nav.getByRole("link", { name: "Docs", exact: true }),
    ).toHaveAttribute("href", GITBOOK);
    const star = nav.getByTestId("star-badge").first();
    await expect(star).toHaveAttribute("href", GITHUB);
    // TEST_MODE: the neutral badge, never a number.
    await expect(star).toHaveText(/Star$/);
    await expect(
      nav.getByRole("link", { name: "Sign in", exact: true }),
    ).toHaveAttribute("href", "/signin");
    await expect(
      nav.getByRole("link", { name: "Try Cloud", exact: true }),
    ).toHaveAttribute("href", "/signin");
  });

  test("every in-page link has a target", async ({ page }) => {
    await page.goto("/");
    const hrefs = await page
      .locator('a[href^="#"]')
      .evaluateAll((links) =>
        links.map((link) => link.getAttribute("href") ?? ""),
      );
    expect(hrefs.length).toBeGreaterThan(0);
    for (const href of new Set(hrefs)) {
      await expect(page.locator(href), `target for ${href}`).toHaveCount(1);
    }
  });

  test("the footer carries the legal links and the legal bar", async ({
    page,
  }) => {
    await page.goto("/");
    const footer = page.getByRole("contentinfo");
    await expect(
      footer.getByRole("link", { name: "Privacy", exact: true }),
    ).toHaveAttribute("href", "https://privacy.cuesoft.io");
    await expect(
      footer.getByRole("link", { name: "Terms", exact: true }),
    ).toHaveAttribute("href", "https://terms.cuesoft.io");
    await expect(
      footer.getByRole("link", { name: "Status", exact: true }),
    ).toHaveAttribute("href", "https://status.cuesoft.io");
    await expect(
      footer.getByRole("link", { name: "CueLABS™ Division" }),
    ).toHaveAttribute("href", "https://cuelabs.cuesoft.io");
    await expect(
      footer.getByRole("link", { name: "MIT License" }),
    ).toHaveAttribute("href", `${GITHUB}/blob/main/LICENSE`);
  });

  test("the hero type matches the display style", async ({ page }) => {
    await page.goto("/");
    const h1 = page.getByRole("heading", { level: 1 });
    await expect(h1).toHaveCSS("font-size", "56px");
    await expect(h1).toHaveCSS("line-height", "64px");
    await expect(h1).toHaveCSS("font-weight", "700");
    await expect(h1).toHaveCSS("font-family", /Inter/);
  });

  test("buttons and links show the pointer cursor", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByTestId("theme-toggle").first()).toHaveCSS(
      "cursor",
      "pointer",
    );
    await expect(
      page
        .getByRole("navigation", { name: "Marketing" })
        .getByRole("link", { name: "Features" }),
    ).toHaveCSS("cursor", "pointer");
  });

  test("the theme toggle switches the landing page to Dark", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
    await page.getByTestId("theme-toggle").first().click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
    await expect(page.getByRole("heading", { level: 1 })).toHaveCSS(
      "color",
      "rgb(245, 246, 250)",
    );
  });

  test("the console style picker swaps the frame", async ({ page }) => {
    await page.goto("/");
    const preview = page.getByTestId("console-preview");
    await expect(preview).toHaveAttribute("data-style", "handheld");
    await page.getByRole("radio", { name: /Arcade/ }).click();
    await expect(preview).toHaveAttribute("data-style", "arcade");
    await expect(preview.getByText("ARCADE")).toBeVisible();
  });

  test("the FAQ opens one answer at a time", async ({ page }) => {
    await page.goto("/");
    const first = page.getByRole("button", {
      name: "Do I need to know how to code?",
    });
    const second = page.getByRole("button", { name: "Is it free?" });
    await expect(first).toHaveAttribute("aria-expanded", "true");
    await second.click();
    await expect(first).toHaveAttribute("aria-expanded", "false");
    await expect(
      page.getByRole("region", { name: "Is it free?" }),
    ).toContainText("Self-hosting is free forever.");
  });

  test("on a phone the page does not scroll sideways and the menu works", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - window.innerWidth,
    );
    expect(overflow).toBeLessThanOrEqual(0);

    const nav = page.getByRole("navigation", { name: "Marketing" });
    await expect(
      nav.getByRole("link", { name: "Try Cloud", exact: true }),
    ).toBeVisible();
    const menu = nav.getByRole("button", { name: "Menu" });
    await expect(menu).toHaveAttribute("aria-expanded", "false");
    await menu.click();
    await expect(menu).toHaveAttribute("aria-expanded", "true");
    await expect(
      nav.getByRole("link", { name: "Features", exact: true }).last(),
    ).toBeVisible();
  });

  for (const theme of ["light", "dark"] as const) {
    test(`has zero critical or serious axe violations in ${theme}`, async ({
      page,
    }) => {
      await page.addInitScript((value) => {
        window.localStorage.setItem("consoless.theme", value);
      }, theme);
      await page.goto("/");
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
