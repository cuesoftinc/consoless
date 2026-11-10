"use client";

/**
 * The component gallery: renders every components/ui set in its variants
 * with labels. Dev and TEST_MODE only (guarded by page.tsx). The theme
 * toggle in the header switches the whole page between Light and Dark.
 */

import { useState, type ReactNode } from "react";
import {
  Box,
  Download,
  Gamepad2,
  Globe,
  Joystick,
  Monitor,
  Search,
  Send,
  Share2,
  Smartphone,
} from "lucide-react";
import Avatar from "@/components/ui/Avatar";
import Badge, { type BadgeKind } from "@/components/ui/Badge";
import Banner from "@/components/ui/Banner";
import Button, { type ButtonKind } from "@/components/ui/Button";
import ChatMessage from "@/components/ui/ChatMessage";
import Checkbox from "@/components/ui/Checkbox";
import CodeLine from "@/components/ui/CodeLine";
import ConsoleFrame, {
  type ConsoleFrameStyle,
} from "@/components/ui/ConsoleFrame";
import EmptyState from "@/components/ui/EmptyState";
import GameCard from "@/components/ui/GameCard";
import GameCardSkeleton from "@/components/ui/GameCardSkeleton";
import GameScreen, { type GameScreenGame } from "@/components/ui/GameScreen";
import GenerationStatus, {
  type GenerationState,
} from "@/components/ui/GenerationStatus";
import IconButton from "@/components/ui/IconButton";
import Input from "@/components/ui/Input";
import LeaderboardRow from "@/components/ui/LeaderboardRow";
import LogoPlaceholder from "@/components/ui/LogoPlaceholder";
import MarketingFooter from "@/components/ui/MarketingFooter";
import MarketingNav from "@/components/ui/MarketingNav";
import Menu, { MenuItem } from "@/components/ui/Menu";
import Modal from "@/components/ui/Modal";
import { PatternStrip } from "@/components/ui/PatternTile";
import PromptInput from "@/components/ui/PromptInput";
import QuotaMeter from "@/components/ui/QuotaMeter";
import RadioGroup, { RadioItem } from "@/components/ui/RadioGroup";
import Select from "@/components/ui/Select";
import Skeleton from "@/components/ui/Skeleton";
import StyleCard from "@/components/ui/StyleCard";
import Tabs, { TabPanel } from "@/components/ui/Tabs";
import ThemeToggle from "@/components/ui/ThemeToggle";
import Toast from "@/components/ui/Toast";
import Toggle from "@/components/ui/Toggle";
import Tooltip from "@/components/ui/Tooltip";
import TouchControls from "@/components/ui/TouchControls";
import VersionItem from "@/components/ui/VersionItem";

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section
      aria-label={title}
      data-testid={`gallery-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
      className="flex flex-col gap-4 rounded-xl border border-border-default bg-bg-surface p-8"
    >
      <h2 className="text-heading-md text-text-primary">{title}</h2>
      <div className="flex flex-wrap items-start gap-6">{children}</div>
    </section>
  );
}

const BUTTON_KINDS: ButtonKind[] = [
  "primary",
  "secondary",
  "ghost",
  "danger",
  "quiet-danger",
];
const BADGE_KINDS: BadgeKind[] = [
  "neutral",
  "accent",
  "brand",
  "retro",
  "success",
  "warning",
  "danger",
];
const GENERATION_STATES: GenerationState[] = [
  "queued",
  "generating",
  "checking",
  "retrying",
  "ready",
  "failed",
  "refused",
];
const CONSOLE_STYLES: [
  ConsoleFrameStyle,
  GameScreenGame,
  "colour" | "green",
][] = [
  ["handheld", "blocks", "green"],
  ["8-bit", "platformer", "colour"],
  ["16-bit", "shooter", "colour"],
  ["arcade", "shooter", "colour"],
  ["modern", "platformer", "colour"],
  ["3d", "kart", "colour"],
];
const STYLE_CARDS = [
  { name: "Handheld", spec: "160 × 144, 4 greens", icon: Smartphone },
  { name: "8-bit", spec: "256 × 240, 25 colours", icon: Gamepad2 },
  { name: "Arcade", spec: "240 × 320, upright", icon: Joystick },
  { name: "Modern", spec: "1280 × 720, full colour", icon: Monitor },
  { name: "3D", spec: "Stage 2", icon: Box },
];
const CODE = [
  'import { Game, Grid, Piece } from "@consoless/engine";',
  "",
  "game.onTick(() => {",
  "  if (!board.dorp(piece)) {",
  "    speed = 1 + Math.floor(game.score.lines / 10);",
  "});",
];

export default function ComponentGallery() {
  const [text, setText] = useState("Block Drop");
  const [sort, setSort] = useState("most-played");
  const [checked, setChecked] = useState(true);
  const [reason, setReason] = useState("trademark");
  const [on, setOn] = useState(false);
  const [modal, setModal] = useState(false);
  const [tab, setTab] = useState("versions");
  const [prompt, setPrompt] = useState("Make the blocks fall faster.");
  const [style, setStyle] = useState("Handheld");
  const [lastInput, setLastInput] = useState("none");

  return (
    <div className="h-screen overflow-y-auto bg-bg-base text-text-primary">
      <main
        id="main"
        tabIndex={-1}
        className="mx-auto flex max-w-[1312px] flex-col gap-8 px-8 py-12"
      >
        <header className="flex items-center justify-between">
          <div className="flex flex-col gap-2">
            <h1 className="text-display-lg">Component gallery</h1>
            <p className="text-body-md text-text-secondary">
              Every component in its variants. Use the theme toggle to check
              Light and Dark.
            </p>
          </div>
          <ThemeToggle />
        </header>

        <Section title="Button">
          {BUTTON_KINDS.map((kind) => (
            <Button key={kind} kind={kind}>
              {kind}
            </Button>
          ))}
          <Button size="sm" icon={Send}>
            Send
          </Button>
          <Button kind="secondary" size="sm" icon={Download}>
            Export
          </Button>
          <Button disabled>Disabled</Button>
          <Button loading>Saving</Button>
          <IconButton icon={Share2} aria-label="Share" />
          <IconButton icon={Globe} aria-label="Publish" kind="secondary" />
        </Section>

        <Section title="Form">
          <div className="w-80">
            <Input
              label="Game title"
              value={text}
              onChange={(event) => setText(event.target.value)}
              helper="Shown in the Arcade."
            />
          </div>
          <div className="w-80">
            <Input
              label="Invite by email"
              defaultValue="mei@"
              error="Enter a full email address."
            />
          </div>
          <div className="w-80">
            <Input label="Username" placeholder="Your username" disabled />
          </div>
          <div className="w-60">
            <Select
              label="Sort by"
              value={sort}
              onValueChange={setSort}
              options={[
                { value: "most-played", label: "Most played" },
                { value: "newest", label: "Newest" },
              ]}
            />
          </div>
          <Checkbox
            label="I confirm that I am 16 or older"
            checked={checked}
            onCheckedChange={setChecked}
          />
          <RadioGroup
            aria-label="Report reason"
            value={reason}
            onValueChange={setReason}
          >
            <RadioItem
              value="trademark"
              label="It uses a trademarked name, character or design"
            />
            <RadioItem value="broken" label="It does not work" />
          </RadioGroup>
          <Toggle label="Reduce motion" checked={on} onCheckedChange={setOn} />
        </Section>

        <Section title="Badge and Avatar">
          {BADGE_KINDS.map((kind) => (
            <Badge key={kind} kind={kind}>
              {kind}
            </Badge>
          ))}
          <Avatar name="Ada Okafor" size="sm" />
          <Avatar name="Tunde Bello" />
          <Avatar name="Mei Tanaka" size="lg" />
          <Tooltip label="Restart the game">
            <Button kind="secondary" size="sm">
              Hover for a tooltip
            </Button>
          </Tooltip>
          <QuotaMeter used={8} limit={20} />
          <QuotaMeter used={17} limit={20} />
          <QuotaMeter used={20} limit={20} />
        </Section>

        <Section title="Feedback">
          <div className="flex w-140 flex-col gap-3">
            <Banner kind="info">
              Block Drop is in review. This usually takes under a minute.
            </Banner>
            <Banner kind="warning">
              You have used today’s 20 generations. You get 20 more tomorrow.
            </Banner>
            <Banner kind="danger">
              Line 13: Property “dorp” does not exist on type “Grid”.
            </Banner>
            <Banner kind="success">Your edit passed its checks.</Banner>
          </div>
          <div className="flex flex-col gap-3">
            <Toast
              kind="success"
              title="Block Drop is live"
              body="Anyone with the link can play it."
              onDismiss={() => {}}
            />
            <Toast
              kind="error"
              title="We could not save that"
              body="Check your connection and try again."
              onDismiss={() => {}}
            />
            <Toast kind="info" title="Link copied" />
          </div>
          <div className="flex flex-col gap-3">
            <Skeleton />
            <Skeleton kind="block" />
            <Skeleton kind="circle" />
          </div>
          <EmptyState
            icon={Search}
            title="No games match “space golf”"
            body="Try a different word or clear the filters."
            action={<Button>Clear search</Button>}
          />
        </Section>

        <Section title="Menu, Modal and Tabs">
          <Menu aria-label="Project actions">
            <MenuItem>Open in the Studio</MenuItem>
            <MenuItem selected>Rename</MenuItem>
            <MenuItem>Export project</MenuItem>
            <MenuItem kind="danger">Delete project</MenuItem>
          </Menu>
          <Button kind="secondary" onClick={() => setModal(true)}>
            Open the modal
          </Button>
          <Modal
            open={modal}
            onOpenChange={setModal}
            kind="destructive"
            title="Delete Block Drop?"
            description="This deletes the project and every version, and takes down its public link and leaderboard. It cannot be undone."
            footer={
              <>
                <Button kind="ghost" onClick={() => setModal(false)}>
                  Cancel
                </Button>
                <Button kind="danger" onClick={() => setModal(false)}>
                  Delete project
                </Button>
              </>
            }
          />
          <div className="w-80">
            <Tabs
              aria-label="Side panel"
              tabs={[
                { id: "versions", label: "Versions" },
                { id: "style", label: "Style" },
              ]}
              value={tab}
              onChange={setTab}
            />
            <TabPanel id="versions" active={tab === "versions"}>
              <p className="py-3 text-body-sm text-text-secondary">
                Versions panel
              </p>
            </TabPanel>
            <TabPanel id="style" active={tab === "style"}>
              <p className="py-3 text-body-sm text-text-secondary">
                Style panel
              </p>
            </TabPanel>
          </div>
        </Section>

        <Section title="Studio">
          <div className="flex w-100 flex-col gap-4">
            <ChatMessage author="user">
              A falling-block puzzle on a handheld with a green screen.
            </ChatMessage>
            <ChatMessage author="assistant">
              I built a falling-block puzzle with seven piece shapes. Arrow keys
              move a piece, Z rotates it and Space drops it.
            </ChatMessage>
            <PromptInput
              value={prompt}
              onChange={setPrompt}
              onSubmit={() => setPrompt("")}
              styleLabel={style}
              styleIcon={Smartphone}
            />
            <PromptInput
              value=""
              onChange={() => {}}
              onSubmit={() => {}}
              styleLabel="Handheld"
              styleIcon={Smartphone}
              disabled
            />
          </div>
          <div className="flex w-100 flex-col gap-3">
            {GENERATION_STATES.map((state) => (
              <GenerationStatus
                key={state}
                state={state}
                version={4}
                onRetry={() => {}}
              />
            ))}
          </div>
          <div className="flex w-80 flex-col gap-1">
            <VersionItem
              version={4}
              summary="Make the blocks fall faster after every ten lines."
              time="2 minutes ago"
              source="Generated"
              current
            />
            <VersionItem
              version={3}
              summary="Edited main.ts by hand."
              time="5 minutes ago"
              source="Edited"
              selected
            />
            <VersionItem
              version={2}
              summary="Add a next-piece panel and a score."
              time="9 minutes ago"
              source="Generated"
            />
          </div>
          <div
            role="radiogroup"
            aria-label="Console style"
            className="flex w-80 flex-wrap gap-4"
          >
            {STYLE_CARDS.map((card) => (
              <StyleCard
                key={card.name}
                {...card}
                selected={style === card.name}
                onSelect={() => setStyle(card.name)}
              />
            ))}
          </div>
          <div className="w-140 rounded-md border border-border-default bg-bg-surface py-3">
            {CODE.map((code, index) => (
              <CodeLine
                key={index}
                number={index + 1}
                code={code}
                kind={index === 3 ? "error" : index === 4 ? "added" : "default"}
              />
            ))}
          </div>
        </Section>

        <Section title="Console frames">
          {CONSOLE_STYLES.map(([consoleStyle, game, palette]) => (
            <div key={consoleStyle} className="w-90">
              <ConsoleFrame consoleStyle={consoleStyle}>
                <GameScreen game={game} palette={palette} />
              </ConsoleFrame>
            </div>
          ))}
        </Section>

        <Section title="Arcade">
          <GameCard
            title="Block Drop"
            byline="by Ada Okafor"
            meta="128 plays"
            badge="Handheld"
            href="/dev/components"
            screen={<GameScreen game="blocks" palette="green" />}
          />
          <GameCard
            title="Sky Hopper"
            byline="by Tunde Bello"
            meta="96 plays"
            badge="8-bit"
            href="/dev/components"
            screen={<GameScreen game="platformer" />}
          />
          <GameCardSkeleton />
          <ol className="w-160">
            <LeaderboardRow rank={1} name="Mei Tanaka" score={18250} />
            <LeaderboardRow rank={2} name="Kwame Mensah" score={16900} />
            <LeaderboardRow rank={3} name="Lena Fischer" score={15300} />
            <LeaderboardRow rank={4} name="Sam Rivera" score={13750} />
            <LeaderboardRow rank={12} name="Ada Okafor" score={12400} you />
          </ol>
          <div className="w-94 rounded-lg border border-border-default">
            <TouchControls onInput={setLastInput} />
            <p className="px-6 pb-4 text-caption text-text-muted">
              Last input: {lastInput}
            </p>
          </div>
        </Section>

        <Section title="Marketing chrome">
          <div className="flex w-full flex-col gap-6">
            <LogoPlaceholder />
            <div className="overflow-hidden rounded-lg border border-border-default">
              <MarketingNav starCount={null} />
            </div>
            <PatternStrip />
            <div className="overflow-hidden rounded-lg border border-border-default">
              <MarketingFooter />
            </div>
          </div>
        </Section>
      </main>
    </div>
  );
}
