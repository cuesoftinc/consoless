"use client";

import { useState } from "react";
import FAQItem from "@/components/ui/FAQItem";
import { ANCHORS } from "./links";
import Section from "./Section";

export const FAQS = [
  {
    question: "Do I need to know how to code?",
    answer:
      "No. You describe the game in plain language and change it by chatting. If you do code, you can read and edit the generated code and download the game as a project.",
  },
  {
    question: "Is it free?",
    answer:
      "The hosted service is free, with 20 generations a day. Self-hosting is free forever.",
  },
  {
    question: "Who owns the games I make?",
    answer:
      "You do. The engine and the runtime are MIT-licensed, so you can keep building on your game anywhere.",
  },
  {
    question: "Can I make a copy of an existing game?",
    answer:
      "No. Consoless does not copy named games, characters or console designs. Ask for one and you get an original game of the same kind instead.",
  },
  {
    question: "What kinds of games can I make?",
    answer:
      "Stage one covers retro and 2D games: puzzles, platformers, shooters and top-down adventures. 3D games come in stage two, and installable desktop games in stage three.",
  },
  {
    question: "Who can use it?",
    answer:
      "Anyone can play published games without an account. You need to be 16 or older to make games.",
  },
  {
    question: "Is it safe to play games other people made?",
    answer:
      "Every game is checked before it is published. Games run in a sandbox on a separate address and cannot read your session, your cookies or your account.",
  },
] as const;

export interface FaqSectionProps {
  onOpen?: (index: number) => void;
}

/** Single-open accordion; the first question starts open. */
export default function FaqSection({ onOpen }: FaqSectionProps) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <Section id={ANCHORS.faq} title="Questions and answers">
      <div className="max-w-200">
        {FAQS.map((faq, index) => (
          <FAQItem
            key={faq.question}
            question={faq.question}
            answer={faq.answer}
            expanded={open === index}
            onToggle={() => {
              const next = open === index ? null : index;
              setOpen(next);
              if (next !== null) onOpen?.(next);
            }}
          />
        ))}
      </div>
    </Section>
  );
}
