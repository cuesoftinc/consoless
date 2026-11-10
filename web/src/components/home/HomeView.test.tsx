import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeProvider } from "@/design/ThemeProvider";
import { FAQS } from "./FaqSection";
import HomeView from "./HomeView";
import { ANCHORS } from "./links";

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
}));

const setup = () =>
  render(
    <ThemeProvider>
      <HomeView />
    </ThemeProvider>,
  );

beforeEach(() => {
  window.__consolessEvents = undefined;
});

describe("HomeView", () => {
  it("renders one main with the hero and every band", () => {
    setup();
    expect(screen.getAllByRole("main")).toHaveLength(1);
    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "Describe it. Play it. Share it.",
      }),
    ).toBeInTheDocument();
    for (const name of [
      "How it works",
      "From a sentence to a game",
      "Pick a look",
      "What you can make",
      "Built in the open",
      "Hosted, or run it yourself",
      "Questions and answers",
      "Make your first game",
    ]) {
      expect(
        screen.getByRole("heading", { level: 2, name }),
      ).toBeInTheDocument();
    }
  });

  it("gives every nav and footer anchor a target on the page", () => {
    setup();
    const targets: [string, string][] = [
      [ANCHORS.features, "How it works"],
      [ANCHORS.consoles, "Pick a look"],
      [ANCHORS.selfHost, "Hosted, or run it yourself"],
    ];
    for (const [id, name] of targets) {
      expect(screen.getByRole("region", { name })).toHaveAttribute("id", id);
    }
  });

  it("emits page_view on mount and try_cloud_click from the hero", async () => {
    setup();
    expect(window.__consolessEvents?.[0]).toMatchObject({
      event: "page_view",
      props: { page: "home" },
    });
    const main = screen.getByRole("main");
    await userEvent.click(
      within(main).getAllByRole("link", { name: "Start building" })[0],
    );
    expect(window.__consolessEvents?.map((e) => e.event)).toContain(
      "try_cloud_click",
    );
  });

  it("switches the console style preview and records the interaction", async () => {
    setup();
    expect(screen.getByTestId("console-preview")).toHaveAttribute(
      "data-style",
      "handheld",
    );
    await userEvent.click(screen.getByRole("radio", { name: /Arcade/ }));
    expect(screen.getByTestId("console-preview")).toHaveAttribute(
      "data-style",
      "arcade",
    );
    expect(window.__consolessEvents).toContainEqual(
      expect.objectContaining({
        event: "demo_interact",
        props: { style: "arcade" },
      }),
    );
  });

  it("opens one question at a time and records faq_open", async () => {
    setup();
    const first = screen.getByRole("button", { name: FAQS[0].question });
    const second = screen.getByRole("button", { name: FAQS[1].question });
    expect(first).toHaveAttribute("aria-expanded", "true");
    await userEvent.click(second);
    expect(first).toHaveAttribute("aria-expanded", "false");
    expect(second).toHaveAttribute("aria-expanded", "true");
    expect(window.__consolessEvents).toContainEqual(
      expect.objectContaining({ event: "faq_open", props: { question: "2" } }),
    );
  });

  it("shows the neutral Star badge in TEST_MODE", () => {
    setup();
    expect(screen.getAllByTestId("star-badge")[0]).toHaveTextContent("Star");
    expect(screen.queryByTestId("star-count")).not.toBeInTheDocument();
  });
});
