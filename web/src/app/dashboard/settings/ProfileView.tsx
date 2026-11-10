"use client";

/** Settings / Profile: the display name, and the Google identity read-only. */

import { useState, type FormEvent } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useMe } from "@/controllers/me-context";
import { useSettingsController } from "@/controllers/use-settings";
import type { Me } from "@/models";

function ProfileForm({ me }: { me: Me }) {
  const settings = useSettingsController();
  const [name, setName] = useState(me.display_name);
  const trimmed = name.trim();
  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (trimmed) void settings.saveDisplayName(trimmed);
  };

  return (
    <div className="flex flex-col gap-8">
      <form onSubmit={submit} className="flex flex-col gap-4">
        <Input
          label="Display name"
          helper="Shown beside games you publish and scores you submit."
          value={name}
          maxLength={40}
          onChange={(event) => setName(event.target.value)}
          error={settings.nameError ?? undefined}
        />
        <div>
          <Button
            type="submit"
            loading={settings.saving}
            disabled={!trimmed || trimmed === me.display_name}
          >
            Save
          </Button>
        </div>
      </form>

      <dl className="flex flex-col gap-4 border-t border-border-default pt-6">
        <div className="flex flex-col gap-1">
          <dt className="text-label-md text-text-primary">Username</dt>
          <dd className="text-body-md text-text-secondary">{me.username}</dd>
        </div>
        <div className="flex flex-col gap-1">
          <dt className="text-label-md text-text-primary">Email</dt>
          <dd className="text-body-md text-text-secondary">{me.email}</dd>
        </div>
        <div className="flex flex-col gap-1">
          <dt className="text-label-md text-text-primary">Sign-in</dt>
          <dd className="text-body-md text-text-secondary">
            Google. Your email comes from your Google account and cannot be
            changed here.
          </dd>
        </div>
      </dl>
    </div>
  );
}

export default function ProfileView() {
  const { me } = useMe();
  return me ? <ProfileForm key={me.id} me={me} /> : null;
}
