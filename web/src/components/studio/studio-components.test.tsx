import { describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { CodeEditorController } from "@/controllers/use-code-editor";
import { generation, PROJECT, VERSIONS } from "@/controllers/studio-fixtures";
import ChatPanel, { type ChatPanelProps } from "./ChatPanel";
import CodePanel from "./CodePanel";
import PreviewPanel, { type PreviewPanelProps } from "./PreviewPanel";
import PublishDialog from "./PublishDialog";
import StylePicker from "./StylePicker";
import VersionsPanel from "./VersionsPanel";
import { STYLE_OPTIONS, styleOption } from "./style-options";

describe("StylePicker", () => {
  it("offers the five styles and marks the chosen one", async () => {
    const onChange = vi.fn();
    render(<StylePicker value="8bit" onChange={onChange} />);
    const group = screen.getByRole("radiogroup", { name: "Console style" });
    expect(within(group).getAllByRole("radio")).toHaveLength(5);
    expect(screen.getByRole("radio", { name: /8-bit/ })).toBeChecked();
    await userEvent.click(screen.getByRole("radio", { name: /Arcade/ }));
    expect(onChange).toHaveBeenCalledWith("arcade");
  });

  it("falls back to the first style for an unknown id", () => {
    expect(styleOption("nope" as never)).toBe(STYLE_OPTIONS[0]);
  });
});

function chat(overrides: Partial<ChatPanelProps> = {}) {
  const props: ChatPanelProps = {
    generations: [generation()],
    versions: VERSIONS,
    style: "8bit",
    prompt: "",
    onPromptChange: vi.fn(),
    onSend: vi.fn(),
    onRetry: vi.fn(),
    onStyleClick: vi.fn(),
    disabled: false,
    quotaOut: false,
    error: null,
    ...overrides,
  };
  render(<ChatPanel {...props} />);
  return props;
}

describe("ChatPanel", () => {
  it("shows the prompt, the reply and the ready version", () => {
    chat();
    const log = screen.getByTestId("chat-log");
    expect(log).toHaveTextContent("A platformer where you collect coins");
    expect(log).toHaveTextContent("I built your game.");
    expect(log).toHaveTextContent("Version 1 is ready");
    expect(screen.getByRole("status")).toHaveTextContent("Version 1 is ready");
  });

  it("shows the status card only for the latest success", () => {
    chat({
      generations: [
        generation(),
        generation({ id: "gen_2", prompt: "Faster", version_id: "ver_2" }),
      ],
    });
    expect(screen.queryByText("Version 1 is ready")).not.toBeInTheDocument();
    expect(screen.getByText("Version 2 is ready")).toBeInTheDocument();
  });

  it("announces each step while a game is being built", () => {
    chat({
      generations: [
        generation({ status: "checking", message: null, version_id: null }),
      ],
      disabled: true,
    });
    expect(screen.getByText("Checking that it runs")).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent(
      "Checking that it runs",
    );
    expect(screen.getByRole("textbox")).toBeDisabled();
  });

  it("offers Try again on the latest failure", async () => {
    const props = chat({
      generations: [
        generation({
          status: "failed",
          attempt: 3,
          message: null,
          version_id: null,
        }),
      ],
    });
    await userEvent.click(screen.getByRole("button", { name: "Try again" }));
    expect(props.onRetry).toHaveBeenCalledTimes(1);
  });

  it("explains an empty quota and hides Try again", () => {
    chat({
      generations: [
        generation({ status: "failed", message: null, version_id: null }),
      ],
      quotaOut: true,
      disabled: true,
    });
    expect(screen.getByText(/used today's generations/)).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Try again" }),
    ).not.toBeInTheDocument();
  });

  it("sends on Enter, shows a send error, and opens the style tab from the chip", async () => {
    const props = chat({
      prompt: "Add a boss",
      error: "We could not send that.",
    });
    expect(screen.getByRole("alert")).toHaveTextContent(
      "We could not send that.",
    );
    await userEvent.type(screen.getByRole("textbox"), "{Enter}");
    expect(props.onSend).toHaveBeenCalledTimes(1);
    await userEvent.click(screen.getByRole("button", { name: /8-bit/ }));
    expect(props.onStyleClick).toHaveBeenCalledTimes(1);
  });
});

function preview(overrides: Partial<PreviewPanelProps> = {}) {
  const props: PreviewPanelProps = {
    project: PROJECT,
    viewing: VERSIONS[0],
    viewingHead: true,
    building: false,
    restoring: false,
    onRestore: vi.fn(),
    onBackToLatest: vi.fn(),
    ...overrides,
  };
  render(<PreviewPanel {...props} />);
  return props;
}

describe("PreviewPanel", () => {
  it("shows the head version in its console frame, and says it is a picture", () => {
    preview();
    const frame = screen.getByTestId("preview-frame");
    expect(frame).toHaveAttribute("data-version", "2");
    expect(frame).toHaveAttribute("data-style", "8bit");
    expect(screen.getByText(/This is a picture of the game/)).toBeVisible();
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  it("offers restore and back when an older version is open", async () => {
    const props = preview({ viewing: VERSIONS[1], viewingHead: false });
    expect(screen.getByRole("status")).toHaveTextContent(
      "You are looking at version 1.",
    );
    await userEvent.click(
      screen.getByRole("button", { name: "Restore this version" }),
    );
    expect(props.onRestore).toHaveBeenCalledTimes(1);
    await userEvent.click(
      screen.getByRole("button", { name: "Back to latest" }),
    );
    expect(props.onBackToLatest).toHaveBeenCalledTimes(1);
  });

  it("waits for the first version while it is being built", () => {
    preview({ viewing: null, building: true });
    expect(screen.getByTestId("preview-empty")).toHaveAttribute(
      "aria-busy",
      "true",
    );
    expect(
      screen.getByText(/appears here when its first version/),
    ).toBeVisible();
  });

  it("says there is nothing to show when no version exists", () => {
    preview({ viewing: null });
    expect(screen.getByText(/There is no version to show yet/)).toBeVisible();
  });
});

function editor(overrides: Partial<CodeEditorController> = {}) {
  return {
    content: "export default {};\n",
    loading: false,
    failed: false,
    dirty: false,
    setContent: vi.fn(),
    discard: vi.fn(),
    checking: false,
    checkError: null,
    saveError: null,
    save: vi.fn().mockResolvedValue(undefined),
    ...overrides,
  } satisfies CodeEditorController;
}

describe("CodePanel", () => {
  it("shows the code and enables Save only after an edit", async () => {
    const clean = editor();
    const { rerender } = render(
      <CodePanel editor={clean} readOnly={false} path="game.ts" />,
    );
    expect(screen.getByText("game.ts")).toBeInTheDocument();
    const field = screen.getByRole("textbox", { name: "Code" });
    expect(field).toHaveValue("export default {};\n");
    expect(screen.getByRole("button", { name: "Save" })).toBeDisabled();
    await userEvent.type(field, "x");
    expect(clean.setContent).toHaveBeenCalled();

    const dirty = editor({ dirty: true });
    rerender(<CodePanel editor={dirty} readOnly={false} path="game.ts" />);
    await userEvent.click(screen.getByRole("button", { name: "Save" }));
    expect(dirty.save).toHaveBeenCalledTimes(1);
    await userEvent.click(screen.getByRole("button", { name: "Discard" }));
    expect(dirty.discard).toHaveBeenCalledTimes(1);
  });

  it("locks the editor while an edit is checked", () => {
    render(
      <CodePanel
        editor={editor({ dirty: true, checking: true })}
        readOnly={false}
        path="game.ts"
      />,
    );
    expect(screen.getByRole("textbox", { name: "Code" })).toHaveAttribute(
      "readonly",
    );
    expect(screen.getByRole("button", { name: /Checking/ })).toBeDisabled();
    expect(screen.getByRole("status")).toHaveTextContent("Checking your edit.");
  });

  it("names the failing line and says the edit was not saved", () => {
    render(
      <CodePanel
        editor={editor({
          dirty: true,
          checkError: { path: "game.ts", line: 3, message: "Expected '}'." },
        })}
        readOnly={false}
        path="game.ts"
      />,
    );
    expect(screen.getByRole("alert")).toHaveTextContent(
      "Line 3: Expected '}'. Your edit was not saved.",
    );
  });

  it("is read-only on an older version", () => {
    render(<CodePanel editor={editor()} readOnly path="game.ts" />);
    expect(screen.getByRole("textbox", { name: "Code" })).toHaveAttribute(
      "readonly",
    );
    expect(screen.queryByRole("button", { name: "Save" })).toBeNull();
    expect(screen.getByText(/Older versions are read-only/)).toBeVisible();
  });

  it("shows loading, a failed load and a rejected save", () => {
    const { rerender } = render(
      <CodePanel
        editor={editor({ content: "", loading: true })}
        readOnly={false}
        path="game.ts"
      />,
    );
    expect(screen.getByLabelText("Loading code")).toBeInTheDocument();
    rerender(
      <CodePanel
        editor={editor({ failed: true })}
        readOnly={false}
        path="game.ts"
      />,
    );
    expect(screen.getByRole("alert")).toHaveTextContent(
      "We could not load the code.",
    );
    rerender(
      <CodePanel
        editor={editor({
          saveError: "We could not save your edit. Try again.",
        })}
        readOnly={false}
        path="game.ts"
      />,
    );
    expect(screen.getByRole("alert")).toHaveTextContent("Try again.");
  });
});

describe("VersionsPanel", () => {
  it("lists versions newest first and marks the current one", async () => {
    const onSelect = vi.fn();
    render(
      <VersionsPanel
        versions={VERSIONS}
        viewingId="ver_2"
        onSelect={onSelect}
      />,
    );
    const items = within(
      screen.getByRole("list", { name: "Versions" }),
    ).getAllByRole("listitem");
    expect(items).toHaveLength(2);
    expect(items[0]).toHaveTextContent("Version 2");
    expect(items[0]).toHaveTextContent("Current");
    expect(items[1]).toHaveTextContent("First version");
    await userEvent.click(within(items[1]).getByRole("button"));
    expect(onSelect).toHaveBeenCalledWith("ver_1");
  });

  it("marks an older version that is open as selected", () => {
    render(
      <VersionsPanel
        versions={VERSIONS}
        viewingId="ver_1"
        onSelect={vi.fn()}
      />,
    );
    const buttons = screen.getAllByRole("button");
    expect(buttons[0]).toHaveAttribute("data-state", "current");
    expect(buttons[1]).toHaveAttribute("data-state", "selected");
  });

  it("explains itself when there are no versions", () => {
    render(<VersionsPanel versions={[]} viewingId={null} onSelect={vi.fn()} />);
    expect(screen.getByText(/Versions appear here/)).toBeVisible();
  });
});

describe("PublishDialog", () => {
  const base = {
    project: PROJECT,
    version: 2,
    publishing: false,
    error: null,
    onClose: vi.fn(),
  };

  it("explains the review and sends the game for it", async () => {
    const onPublish = vi.fn();
    render(<PublishDialog {...base} onPublish={onPublish} />);
    const dialog = screen.getByRole("dialog", { name: "Publish Coin Canyon?" });
    expect(dialog).toHaveTextContent("Version 2 is reviewed");
    expect(dialog).toHaveTextContent("The prompt that made it is shown");
    await userEvent.click(
      screen.getByRole("button", { name: "Send for review" }),
    );
    expect(onPublish).toHaveBeenCalledTimes(1);
  });

  it("shows an error and locks the actions while sending", () => {
    render(
      <PublishDialog
        {...base}
        publishing
        error="We could not send the game for review. Try again."
        onPublish={vi.fn()}
      />,
    );
    expect(screen.getByRole("alert")).toHaveTextContent("Try again.");
    expect(screen.getByRole("button", { name: "Cancel" })).toBeDisabled();
  });
});
