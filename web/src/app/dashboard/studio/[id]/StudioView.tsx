"use client";

/**
 * The Studio: chat on the left, the workspace (Preview and Code) in the
 * middle, and Versions and Style on the right. The project bar carries the
 * title, where the game stands, and Publish.
 */

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, SearchX } from "lucide-react";
import ChatPanel from "@/components/studio/ChatPanel";
import CodePanel from "@/components/studio/CodePanel";
import PreviewPanel from "@/components/studio/PreviewPanel";
import PublishDialog from "@/components/studio/PublishDialog";
import StylePicker from "@/components/studio/StylePicker";
import VersionsPanel from "@/components/studio/VersionsPanel";
import { STATUS_KIND, STATUS_LABEL } from "@/components/dashboard/ProjectCard";
import Badge from "@/components/ui/Badge";
import Banner from "@/components/ui/Banner";
import Button, { buttonClasses } from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import Skeleton from "@/components/ui/Skeleton";
import Tabs, { TabPanel } from "@/components/ui/Tabs";
import { useCodeEditorController } from "@/controllers/use-code-editor";
import { useStudioController } from "@/controllers/use-studio";
import { GAME_FILE } from "@/models";

const WORKSPACE_TABS = [
  { id: "preview", label: "Preview" },
  { id: "code", label: "Code" },
];
const SIDE_TABS = [
  { id: "versions", label: "Versions" },
  { id: "style", label: "Style" },
];

export default function StudioView({ projectId }: { projectId: string }) {
  const studio = useStudioController(projectId);
  const [workspaceTab, setWorkspaceTab] = useState("preview");
  const [sideTab, setSideTab] = useState("versions");
  const editor = useCodeEditorController(
    projectId,
    studio.viewing?.id ?? null,
    studio.reload,
  );
  const { project } = studio;

  if (studio.notFound) {
    return (
      <EmptyState
        icon={SearchX}
        title="We could not find this game"
        body="It may have been deleted, or the link may be wrong."
        action={
          <Link href="/dashboard" className={buttonClasses("primary", "md")}>
            Go to My Games
          </Link>
        }
      />
    );
  }
  if (studio.failed) {
    return (
      <Banner
        kind="danger"
        action={
          <Button
            kind="secondary"
            size="sm"
            onClick={() => void studio.reload()}
          >
            Try again
          </Button>
        }
      >
        We could not load this game.
      </Banner>
    );
  }
  if (!project) {
    return (
      <div
        aria-busy="true"
        aria-label="Loading the Studio"
        data-testid="studio-loading"
        className="flex flex-col gap-4"
      >
        <Skeleton className="h-8 w-64 max-w-full" />
        <Skeleton kind="block" className="h-80 w-full" />
      </div>
    );
  }

  const canPublish =
    studio.viewing !== null &&
    studio.active === null &&
    (project.status === "draft" || project.status === "rejected");

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-wrap items-center gap-3">
        <Link
          href="/dashboard"
          aria-label="Back to My Games"
          className={buttonClasses("ghost", "sm")}
        >
          <ArrowLeft aria-hidden className="h-4 w-4" />
          My Games
        </Link>
        <h1 className="min-w-0 flex-1 truncate text-heading-lg text-text-primary">
          {project.title}
        </h1>
        <Badge kind={STATUS_KIND[project.status]}>
          {STATUS_LABEL[project.status]}
        </Badge>
        <Button onClick={studio.openPublish} disabled={!canPublish}>
          Publish
        </Button>
      </header>

      {project.status === "in_review" ? (
        <Banner kind="info">
          This game is in review. It gets its public link once it passes.
        </Banner>
      ) : null}
      {project.status === "rejected" ? (
        <Banner kind="warning">
          The last review did not approve this game. Change it and publish
          again.
        </Banner>
      ) : null}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] xl:grid-cols-[minmax(0,20rem)_minmax(0,1fr)_minmax(0,17rem)]">
        <ChatPanel
          generations={studio.generations}
          versions={studio.versions}
          style={project.style_id}
          prompt={studio.prompt}
          onPromptChange={studio.setPrompt}
          onSend={() => void studio.send()}
          onRetry={() => void studio.retry()}
          onStyleClick={() => setSideTab("style")}
          disabled={studio.promptDisabled}
          quotaOut={studio.quotaOut}
          error={studio.sendError}
        />

        <section aria-label="Workspace" className="flex min-w-0 flex-col gap-4">
          <Tabs
            tabs={WORKSPACE_TABS}
            value={workspaceTab}
            onChange={setWorkspaceTab}
            aria-label="Workspace"
          />
          <TabPanel id="preview" active={workspaceTab === "preview"}>
            <PreviewPanel
              project={project}
              viewing={studio.viewing}
              viewingHead={studio.viewingHead}
              building={studio.active !== null}
              restoring={studio.restoring}
              onRestore={() => void studio.restore()}
              onBackToLatest={() => studio.selectVersion(null)}
            />
          </TabPanel>
          <TabPanel id="code" active={workspaceTab === "code"}>
            {studio.viewing ? (
              <CodePanel
                editor={editor}
                readOnly={!studio.viewingHead || studio.active !== null}
                path={GAME_FILE}
              />
            ) : (
              <p className="text-body-md text-text-secondary">
                The code appears here when the first version is ready.
              </p>
            )}
          </TabPanel>
        </section>

        <section
          aria-label="Versions and style"
          className="flex min-w-0 flex-col gap-4 lg:col-span-2 xl:col-span-1"
        >
          <Tabs
            tabs={SIDE_TABS}
            value={sideTab}
            onChange={setSideTab}
            aria-label="Versions and style"
          />
          <TabPanel id="versions" active={sideTab === "versions"}>
            <VersionsPanel
              versions={studio.versions}
              viewingId={studio.viewing?.id ?? null}
              onSelect={studio.selectVersion}
            />
          </TabPanel>
          <TabPanel id="style" active={sideTab === "style"}>
            <div className="flex flex-col gap-3">
              <p className="text-body-sm text-text-secondary">
                Switching style changes the frame, the colours and the controls.
                The game stays the same and no version is made.
              </p>
              <StylePicker
                value={project.style_id}
                onChange={(style) => void studio.setStyle(style)}
              />
            </div>
          </TabPanel>
        </section>
      </div>

      {studio.publishOpen && studio.viewing ? (
        <PublishDialog
          project={project}
          version={studio.versions[0]?.number ?? studio.viewing.number}
          publishing={studio.publishing}
          error={studio.publishError}
          onPublish={() => void studio.publish()}
          onClose={studio.closePublish}
        />
      ) : null}
    </div>
  );
}
