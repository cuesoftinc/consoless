import { describe, expect, it } from "vitest";
import manifest from "./manifest";

describe("manifest", () => {
  it("carries the product identity, the token colours and the icons", () => {
    expect(manifest()).toMatchObject({
      name: "Consoless",
      short_name: "Consoless",
      description: "Describe it. Play it. Share it.",
      start_url: "/",
      display: "standalone",
      background_color: "#f5f6fa",
      theme_color: "#0a6e78",
    });
    expect(manifest().icons?.map((icon) => icon.src)).toEqual([
      "/favicon.ico",
      "/apple-icon.png",
    ]);
  });
});
