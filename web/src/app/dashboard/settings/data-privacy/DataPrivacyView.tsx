"use client";

/**
 * Settings / Data and privacy: what the account holds, the policies, and
 * account deletion (CON-014). Deleting asks for the username (P-13).
 */

import { useState, type FormEvent } from "react";
import Banner from "@/components/ui/Banner";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import { useMe } from "@/controllers/me-context";
import { useSettingsController } from "@/controllers/use-settings";

const LINK =
  "rounded-sm text-accent-text underline underline-offset-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring";

export default function DataPrivacyView() {
  const { me } = useMe();
  const settings = useSettingsController();
  const [open, setOpen] = useState(false);
  const [typed, setTyped] = useState("");
  if (!me) return null;

  const matches = typed.trim() === me.username;
  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (matches && !settings.deleting) void settings.deleteAccount();
  };
  const onOpenChange = (next: boolean) => {
    if (settings.deleting) return;
    setOpen(next);
    if (!next) setTyped("");
  };

  return (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col gap-3">
        <h2 className="text-heading-sm text-text-primary">What we keep</h2>
        <ul className="flex list-disc flex-col gap-1 pl-6 text-body-md text-text-secondary">
          <li>Your name and email from your Google account.</li>
          <li>The games you make, with their prompts and versions.</li>
          <li>Scores you submit and reports you send.</li>
        </ul>
        <p className="text-body-md text-text-secondary">
          Read the{" "}
          <a
            href="https://privacy.cuesoft.io"
            target="_blank"
            rel="noreferrer"
            className={LINK}
          >
            Privacy Policy
          </a>{" "}
          and the{" "}
          <a
            href="https://terms.cuesoft.io"
            target="_blank"
            rel="noreferrer"
            className={LINK}
          >
            Terms
          </a>
          .
        </p>
      </section>

      <section className="flex flex-col gap-3 rounded-lg border border-border-default p-6">
        <h2 className="text-heading-sm text-text-primary">Delete account</h2>
        <p className="text-body-md text-text-secondary">
          Deleting your account deletes every game you made and takes your
          published games out of the Arcade. This cannot be undone.
        </p>
        <div>
          <Button kind="danger" onClick={() => setOpen(true)}>
            Delete account
          </Button>
        </div>
      </section>

      <Modal
        open={open}
        onOpenChange={onOpenChange}
        title="Delete your account?"
        description="Every game you made is deleted, your published games leave the Arcade, and you are signed out. This cannot be undone."
        kind="destructive"
        size="sm"
        footer={
          <>
            <Button
              kind="ghost"
              onClick={() => onOpenChange(false)}
              disabled={settings.deleting}
            >
              Cancel
            </Button>
            <Button
              kind="danger"
              type="submit"
              form="delete-account"
              loading={settings.deleting}
              disabled={!matches}
            >
              Delete account
            </Button>
          </>
        }
      >
        <form
          id="delete-account"
          onSubmit={submit}
          className="flex flex-col gap-3"
        >
          <Input
            label={`Type ${me.username} to confirm`}
            value={typed}
            onChange={(event) => setTyped(event.target.value)}
            autoComplete="off"
            autoFocus
          />
          {settings.deleteError ? (
            <Banner kind="danger">{settings.deleteError}</Banner>
          ) : null}
        </form>
      </Modal>
    </div>
  );
}
