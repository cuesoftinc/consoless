"use client";

/**
 * CodePanel: the game's code, editable on the latest version. Saving sends
 * the edit to be checked; a failed check names the line and keeps the text.
 */

import Banner from "@/components/ui/Banner";
import Button from "@/components/ui/Button";
import Skeleton from "@/components/ui/Skeleton";
import type { CodeEditorController } from "@/controllers/use-code-editor";

export interface CodePanelProps {
  editor: CodeEditorController;
  /** Older versions are read-only. */
  readOnly: boolean;
  /** The file name shown above the editor. */
  path: string;
}

export default function CodePanel({ editor, readOnly, path }: CodePanelProps) {
  if (editor.failed) {
    return <Banner kind="danger">We could not load the code.</Banner>;
  }
  if (editor.loading && editor.content === "") {
    return (
      <div
        aria-busy="true"
        aria-label="Loading code"
        className="flex flex-col gap-2"
      >
        <Skeleton className="h-4 w-80 max-w-full" />
        <Skeleton className="h-4 w-64 max-w-full" />
        <Skeleton className="h-4 w-72 max-w-full" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="font-mono text-code-sm text-text-secondary">{path}</p>
        {readOnly ? (
          <p className="text-caption text-text-muted">
            Older versions are read-only. Restore one to edit it.
          </p>
        ) : (
          <div className="flex gap-2">
            <Button
              kind="ghost"
              size="sm"
              onClick={editor.discard}
              disabled={!editor.dirty || editor.checking}
            >
              Discard
            </Button>
            <Button
              size="sm"
              onClick={() => void editor.save()}
              loading={editor.checking}
              disabled={!editor.dirty}
            >
              {editor.checking ? "Checking" : "Save"}
            </Button>
          </div>
        )}
      </div>

      {editor.checkError ? (
        <Banner kind="danger">
          Line {editor.checkError.line}: {editor.checkError.message} Your edit
          was not saved. Fix the line and save again.
        </Banner>
      ) : null}
      {editor.saveError ? (
        <Banner kind="danger">{editor.saveError}</Banner>
      ) : null}

      <textarea
        aria-label="Code"
        value={editor.content}
        onChange={(event) => editor.setContent(event.target.value)}
        readOnly={readOnly || editor.checking}
        spellCheck={false}
        data-dirty={editor.dirty}
        className="min-h-100 w-full resize-y rounded-lg border border-border-default bg-bg-inset p-4 font-mono text-code-sm text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
      />
      <p role="status" className="sr-only">
        {editor.checking ? "Checking your edit." : ""}
      </p>
    </div>
  );
}
