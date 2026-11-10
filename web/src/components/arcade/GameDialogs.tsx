"use client";

/**
 * The game page dialogs: share, report and remix. Each keeps only its own
 * field text; `useGameController` owns the actions and their state.
 */

import { useState, type FormEvent } from "react";
import Link from "next/link";
import Banner from "@/components/ui/Banner";
import Button, { buttonClasses } from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import RadioGroup, { RadioItem } from "@/components/ui/RadioGroup";
import type { ArcadeGame, ReportReason } from "@/models";

export interface ShareDialogProps {
  game: ArcadeGame;
  url: string;
  copied: boolean;
  error: string | null;
  onCopy: () => void;
  onClose: () => void;
}

export function ShareDialog({
  game,
  url,
  copied,
  error,
  onCopy,
  onClose,
}: ShareDialogProps) {
  return (
    <Modal
      open
      onOpenChange={(open) => !open && onClose()}
      title={`Share ${game.title}`}
      description="Anyone with the link can play. No account is needed."
      size="sm"
      footer={
        <>
          <Button kind="ghost" onClick={onClose}>
            Close
          </Button>
          <Button onClick={onCopy}>
            {copied ? "Link copied" : "Copy link"}
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-3">
        <Input
          label="Link"
          value={url}
          readOnly
          onFocus={(event) => event.target.select()}
        />
        <p role="status" className="sr-only">
          {copied ? "Link copied." : ""}
        </p>
        {error ? <Banner kind="danger">{error}</Banner> : null}
      </div>
    </Modal>
  );
}

export const REPORT_REASONS: { value: ReportReason; label: string }[] = [
  { value: "copied", label: "It copies another game or uses a brand" },
  { value: "inappropriate", label: "It is offensive or not suitable" },
  { value: "broken", label: "It does not work" },
  { value: "other", label: "Something else" },
];

export interface ReportDialogProps {
  game: ArcadeGame;
  saving: boolean;
  sent: boolean;
  error: string | null;
  onReport: (reason: ReportReason, details: string) => void;
  onClose: () => void;
}

export function ReportDialog({
  game,
  saving,
  sent,
  error,
  onReport,
  onClose,
}: ReportDialogProps) {
  const [reason, setReason] = useState<ReportReason | "">("");
  const [details, setDetails] = useState("");
  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (reason && !saving) onReport(reason, details.trim());
  };

  if (sent) {
    return (
      <Modal
        open
        onOpenChange={(open) => !open && onClose()}
        title="Report sent"
        description="Thank you. We review every report and take a game down if it breaks the rules."
        size="sm"
        footer={<Button onClick={onClose}>Done</Button>}
      />
    );
  }

  return (
    <Modal
      open
      onOpenChange={(open) => !open && onClose()}
      title={`Report ${game.title}`}
      description="Tell us what is wrong with this game."
      size="sm"
      footer={
        <>
          <Button kind="ghost" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button
            type="submit"
            form="report-game"
            loading={saving}
            disabled={!reason}
          >
            Send report
          </Button>
        </>
      }
    >
      <form id="report-game" onSubmit={submit} className="flex flex-col gap-4">
        <RadioGroup
          aria-label="Reason"
          value={reason}
          onValueChange={(value) => setReason(value as ReportReason)}
        >
          {REPORT_REASONS.map((item) => (
            <RadioItem key={item.value} value={item.value} label={item.label} />
          ))}
        </RadioGroup>
        <Input
          label="Details (optional)"
          value={details}
          maxLength={500}
          onChange={(event) => setDetails(event.target.value)}
        />
        {error ? <Banner kind="danger">{error}</Banner> : null}
      </form>
    </Modal>
  );
}

export interface RemixDialogProps {
  game: ArcadeGame;
  signedIn: boolean;
  saving: boolean;
  error: string | null;
  onRemix: () => void;
  onClose: () => void;
}

export function RemixDialog({
  game,
  signedIn,
  saving,
  error,
  onRemix,
  onClose,
}: RemixDialogProps) {
  if (!signedIn) {
    return (
      <Modal
        open
        onOpenChange={(open) => !open && onClose()}
        title="Sign in to remix"
        description="Remixing makes your own copy of a game that you can change. It needs an account; playing does not."
        size="sm"
        footer={
          <>
            <Button kind="ghost" onClick={onClose}>
              Not now
            </Button>
            <Link href="/signin" className={buttonClasses("primary", "md")}>
              Sign in
            </Link>
          </>
        }
      />
    );
  }

  return (
    <Modal
      open
      onOpenChange={(open) => !open && onClose()}
      title={`Remix ${game.title}?`}
      description={`You get your own copy in My Games to change as you like. If you publish it, it credits ${game.title} by ${game.author.display_name}.`}
      size="sm"
      footer={
        <>
          <Button kind="ghost" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button onClick={onRemix} loading={saving}>
            Remix
          </Button>
        </>
      }
    >
      {error ? <Banner kind="danger">{error}</Banner> : null}
    </Modal>
  );
}
