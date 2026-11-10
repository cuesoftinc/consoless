"use client";

/**
 * ChatPanel: the prompts and what became of each, the live status of the
 * generation being built, and the prompt box. The status card is a live
 * region, so each step is announced as it changes (MI-9).
 */

import { useEffect, useRef } from "react";
import Banner from "@/components/ui/Banner";
import ChatMessage from "@/components/ui/ChatMessage";
import GenerationStatus from "@/components/ui/GenerationStatus";
import PromptInput from "@/components/ui/PromptInput";
import type { ConsoleStyleId, Generation, Version } from "@/models";
import { styleOption } from "./style-options";

export interface ChatPanelProps {
  generations: Generation[];
  versions: Version[];
  style: ConsoleStyleId;
  prompt: string;
  onPromptChange: (prompt: string) => void;
  onSend: () => void;
  onRetry: () => void;
  onStyleClick: () => void;
  disabled: boolean;
  quotaOut: boolean;
  error: string | null;
}

export default function ChatPanel({
  generations,
  versions,
  style,
  prompt,
  onPromptChange,
  onSend,
  onRetry,
  onStyleClick,
  disabled,
  quotaOut,
  error,
}: ChatPanelProps) {
  const option = styleOption(style);
  const last = generations.at(-1);
  const log = useRef<HTMLOListElement>(null);
  const count = generations.length;
  const lastStatus = last?.status;

  // Keep the newest message in view as the chat grows.
  useEffect(() => {
    // Scroll the log itself, never the page.
    const node = log.current;
    if (node) node.scrollTop = node.scrollHeight;
  }, [count, lastStatus]);

  const numberOf = (versionId: string | null) =>
    versions.find((version) => version.id === versionId)?.number;

  return (
    <section
      aria-label="Chat"
      className="flex min-h-0 flex-col gap-4 rounded-xl border border-border-default bg-bg-surface p-4 lg:sticky lg:top-24 lg:self-start"
    >
      <ol
        ref={log}
        data-testid="chat-log"
        className="flex max-h-120 min-h-40 flex-1 flex-col gap-4 overflow-y-auto"
      >
        {generations.map((generation, index) => {
          const isLast = index === generations.length - 1;
          return (
            <li key={generation.id} className="flex flex-col gap-3">
              <ChatMessage author="user">{generation.prompt}</ChatMessage>
              {generation.message ? (
                <ChatMessage author="assistant">
                  {generation.message}
                </ChatMessage>
              ) : null}
              {/* Earlier successes are told by the assistant's message. */}
              {isLast || generation.status !== "ready" ? (
                <GenerationStatus
                  state={generation.status}
                  version={numberOf(generation.version_id)}
                  attempt={generation.attempt}
                  maxAttempts={generation.max_attempts}
                  onRetry={
                    isLast && generation.status === "failed" && !quotaOut
                      ? onRetry
                      : undefined
                  }
                />
              ) : null}
            </li>
          );
        })}
      </ol>

      {quotaOut ? (
        <Banner kind="warning">
          You have used today&apos;s generations. They reset tomorrow. You can
          still edit the code and publish.
        </Banner>
      ) : null}
      {error ? <Banner kind="danger">{error}</Banner> : null}

      <PromptInput
        value={prompt}
        onChange={onPromptChange}
        onSubmit={onSend}
        styleLabel={option.name}
        styleIcon={option.icon}
        onStyleClick={onStyleClick}
        disabled={disabled}
        placeholder="Describe a change to your game"
      />
    </section>
  );
}
