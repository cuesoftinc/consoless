"use client";

/** New game: a first prompt and a console style become a project. */

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { newIdempotencyKey } from "@/lib/idempotency";
import { ApiError, type ConsoleStyleId } from "@/models";
import { studioRepo } from "@/models/repositories";
import { useMe } from "./me-context";

export interface NewGameController {
  prompt: string;
  setPrompt: (prompt: string) => void;
  style: ConsoleStyleId;
  setStyle: (style: ConsoleStyleId) => void;
  /** Today's generations are used up (S-21). */
  quotaOut: boolean;
  creating: boolean;
  error: string | null;
  create: () => Promise<void>;
}

export function useNewGameController(): NewGameController {
  const router = useRouter();
  const { me, reload } = useMe();
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState<ConsoleStyleId>("handheld");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const create = useCallback(async () => {
    const text = prompt.trim();
    if (!text || creating) return;
    setCreating(true);
    setError(null);
    try {
      const { project } = await studioRepo.create(
        text,
        style,
        newIdempotencyKey(),
      );
      void reload();
      router.push(`/dashboard/studio/${project.id}`);
    } catch (caught) {
      setError(
        caught instanceof ApiError && caught.status < 500
          ? caught.message
          : "We could not start your game. Try again.",
      );
      setCreating(false);
    }
  }, [creating, prompt, reload, router, style]);

  return {
    prompt,
    setPrompt,
    style,
    setStyle,
    quotaOut: me ? me.quota.used >= me.quota.limit : false,
    creating,
    error,
    create,
  };
}
