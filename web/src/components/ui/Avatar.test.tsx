import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import Avatar, { initialsOf } from "./Avatar";

describe("Avatar", () => {
  it("shows initials and is named by the person's name", () => {
    render(<Avatar name="Ada Okafor" />);
    const avatar = screen.getByRole("img", { name: "Ada Okafor" });
    expect(avatar).toHaveTextContent("AO");
    expect(avatar).toHaveAttribute("data-size", "md");
    expect(avatar).toHaveClass("h-8", "w-8");
  });

  it("supports the small and large sizes", () => {
    const { rerender } = render(<Avatar name="Tunde Bello" size="sm" />);
    expect(screen.getByRole("img")).toHaveClass("h-6", "w-6");
    rerender(<Avatar name="Tunde Bello" size="lg" />);
    expect(screen.getByRole("img")).toHaveClass("h-12", "w-12");
  });

  it("derives initials from one, two or many names", () => {
    expect(initialsOf("Mei Tanaka")).toBe("MT");
    expect(initialsOf("ada")).toBe("AD");
    expect(initialsOf("Kwame Nii Mensah")).toBe("KM");
    expect(initialsOf("  ")).toBe("?");
  });
});
