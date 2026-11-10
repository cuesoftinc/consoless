"use client";

/**
 * CodeSnippet: shell commands in a dark block with a copy button, used for
 * the self-host commands on the landing page. With more than one tab the
 * commands are mirrored per install method and Copy takes the open tab.
 * The `$ ` prompts are decoration and stay out of what is copied. The block
 * is always dark: it scopes the Dark token mode to itself.
 */

import { useEffect, useState } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/cn";
import Tabs, { TabPanel } from "./Tabs";

export interface CodeSnippetTab {
  /** Slug-safe id. */
  id: string;
  label: string;
  /** One command per line. */
  code: string;
}

export interface CodeSnippetProps {
  tabs: CodeSnippetTab[];
  /** Accessible name of the tab list. */
  tabsLabel?: string;
  /** Accessible name of the command block. */
  label: string;
  onCopy?: (tabId: string) => void;
  className?: string;
}

export default function CodeSnippet({
  tabs,
  tabsLabel = "Install method",
  label,
  onCopy,
  className,
}: CodeSnippetProps) {
  const [active, setActive] = useState(tabs[0]?.id ?? "");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [copied]);

  const current = tabs.find((tab) => tab.id === active) ?? tabs[0];

  const copy = async () => {
    if (!current) return;
    try {
      await navigator.clipboard.writeText(current.code);
      setCopied(true);
      onCopy?.(current.id);
    } catch {
      // The clipboard is unavailable: the commands can still be selected.
    }
  };

  return (
    <div
      data-theme="dark"
      data-testid="code-snippet"
      className={cn(
        "rounded-lg border border-border-default bg-bg-base",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-4 px-4 pt-2">
        {tabs.length > 1 ? (
          <Tabs
            tabs={tabs.map(({ id, label: tabLabel }) => ({
              id,
              label: tabLabel,
            }))}
            value={current?.id ?? ""}
            onChange={(id) => {
              setActive(id);
              setCopied(false);
            }}
            aria-label={tabsLabel}
          />
        ) : (
          <span />
        )}
        <button
          type="button"
          aria-label={copied ? "Copied" : "Copy commands"}
          data-state={copied ? "copied" : "idle"}
          onClick={() => void copy()}
          className={cn(
            "flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-md",
            "transition-colors duration-fast ease-enter motion-reduce:transition-none",
            copied
              ? "text-success-text"
              : "text-text-secondary hover:text-text-primary",
            "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring",
          )}
        >
          {copied ? (
            <Check aria-hidden className="h-4 w-4" data-testid="copy-check" />
          ) : (
            <Copy aria-hidden className="h-4 w-4" />
          )}
        </button>
      </div>
      {tabs.map((tab) => (
        <TabPanel key={tab.id} id={tab.id} active={tab.id === current?.id}>
          <pre
            aria-label={label}
            tabIndex={0}
            className="overflow-x-auto px-4 pt-2 pb-4 font-mono text-code-sm text-text-primary focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-focus-ring"
          >
            <code>
              {tab.code.split("\n").map((line, index) => (
                <span key={index} className="block whitespace-nowrap">
                  <span aria-hidden className="text-text-muted select-none">
                    {"$ "}
                  </span>
                  {line}
                </span>
              ))}
            </code>
          </pre>
        </TabPanel>
      ))}
      <p role="status" className="sr-only">
        {copied ? "Commands copied." : ""}
      </p>
    </div>
  );
}
