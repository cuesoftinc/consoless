/**
 * GameScreen: synthetic demo game pictures drawn as inline SVG pixel
 * grids (20 columns × 18 rows of 16px cells). These are original pixel
 * drawings, not screenshots of any existing game. The "green" palette
 * redraws the same picture in the four-shade handheld screen colours.
 */

import { cn } from "@/lib/cn";

export type GameScreenGame = "blocks" | "platformer" | "shooter" | "kart";
export type GameScreenPalette = "colour" | "green";

type FillToken =
  | "screen-green"
  | "screen-green-mid"
  | "screen-ink"
  | "screen-black"
  | "px-pink"
  | "px-cyan"
  | "px-orange"
  | "px-yellow"
  | "px-green"
  | "px-white"
  | "px-sky"
  | "px-grey"
  | "px-dirt";

/** Full literal class strings, so Tailwind sees every fill. */
const FILL_CLASSES: Record<FillToken, string> = {
  "screen-green": "fill-console-screen-green",
  "screen-green-mid": "fill-console-screen-green-mid",
  "screen-ink": "fill-console-screen-ink",
  "screen-black": "fill-console-screen-black",
  "px-pink": "fill-console-px-pink",
  "px-cyan": "fill-console-px-cyan",
  "px-orange": "fill-console-px-orange",
  "px-yellow": "fill-console-px-yellow",
  "px-green": "fill-console-px-green",
  "px-white": "fill-console-px-white",
  "px-sky": "fill-console-px-sky",
  "px-grey": "fill-console-px-grey",
  "px-dirt": "fill-console-px-dirt",
};

const CELL = 16;
const COLS = 20;
const ROWS = 18;

const E = "....................";
const WELL = "....#..........#....";

interface PaletteSpec {
  background: FillToken;
  /** Grid character → fill. A character missing here is empty. */
  cells: Record<string, FillToken>;
}

interface GameSpec {
  label: string;
  rows: string[];
  palettes: Record<GameScreenPalette, PaletteSpec>;
}

const GAMES: Record<GameScreenGame, GameSpec> = {
  blocks: {
    label: "Falling-block puzzle demo picture",
    rows: [
      "....#..........#....",
      "....#.....a....#....",
      "....#....aaa...#....",
      WELL,
      WELL,
      WELL,
      WELL,
      WELL,
      WELL,
      WELL,
      WELL,
      "....#.......b..#....",
      "....#..c....b..#....",
      "....#..cc..bb.d#....",
      "....#.eec.ffbdd#....",
      "....#.eeffff.dd#....",
      "....#eeeffbbbdd#....",
      "....############....",
    ],
    palettes: {
      colour: {
        background: "screen-black",
        cells: {
          "#": "px-grey",
          a: "px-pink",
          b: "px-cyan",
          c: "px-orange",
          d: "px-yellow",
          e: "px-green",
          f: "px-white",
        },
      },
      green: {
        background: "screen-green",
        cells: {
          "#": "screen-ink",
          a: "screen-ink",
          c: "screen-ink",
          d: "screen-ink",
          f: "screen-ink",
          b: "screen-green-mid",
          e: "screen-green-mid",
        },
      },
    },
  },
  platformer: {
    label: "Platformer demo picture",
    rows: [
      E,
      "..ww.........www....",
      ".wwww.......wwwww...",
      E,
      E,
      "..............o.o...",
      E,
      ".............pppp...",
      ".....o..............",
      E,
      "...pppp.............",
      "..................o.",
      ".........hh.........",
      ".........hh....x....",
      "........hhhh..xxx...",
      "gggggggggggg..gggggg",
      "dddddddddddd..dddddd",
      "dddddddddddd..dddddd",
    ],
    palettes: {
      colour: {
        background: "px-sky",
        cells: {
          w: "px-white",
          o: "px-yellow",
          p: "px-orange",
          h: "px-pink",
          x: "px-cyan",
          g: "px-green",
          d: "px-dirt",
        },
      },
      green: {
        background: "screen-green",
        cells: {
          w: "screen-green-mid",
          o: "screen-green-mid",
          d: "screen-green-mid",
          p: "screen-ink",
          h: "screen-ink",
          x: "screen-ink",
          g: "screen-ink",
        },
      },
    },
  },
  shooter: {
    label: "Space shooter demo picture",
    rows: [
      E,
      "..xx..xx..xx..xx....",
      "..xx..xx..xx..xx....",
      E,
      "....ee..ee..ee......",
      "....ee..ee..ee......",
      E,
      ".........b..........",
      "...s..........s.....",
      ".........b..........",
      E,
      "......s......s......",
      ".........b..........",
      E,
      ".........h..........",
      "........hhh.........",
      ".......hhhhh........",
      E,
    ],
    palettes: {
      colour: {
        background: "screen-black",
        cells: {
          x: "px-pink",
          e: "px-orange",
          b: "px-yellow",
          s: "px-grey",
          h: "px-cyan",
        },
      },
      green: {
        background: "screen-green",
        cells: {
          x: "screen-ink",
          e: "screen-ink",
          h: "screen-ink",
          b: "screen-green-mid",
          s: "screen-green-mid",
        },
      },
    },
  },
  kart: {
    label: "Kart racer demo picture",
    rows: [
      "ssssssssssssssssssss",
      "ssssssssssssssyyssss",
      "ssssssssssssssyyssss",
      "ssssssssssssssssssss",
      "sssgggsssssssssggsss",
      "ssggggggssssgggggggs",
      "gggggggggrrggggggggg",
      "ggggggggrrrrgggggggg",
      "ggggggggrllrgggggggg",
      "gggggggrrrrrrggggggg",
      "ggggggrrrllrrrgggggg",
      "ggggggrrrrrrrrgggggg",
      "gggggrrrrllrrrrggggg",
      "ggggrrrrrrrrrrrrgggg",
      "gggrrrrrkkkkrrrrrggg",
      "ggrrrrrrkkkkrrrrrrgg",
      "grrrrrrrrllrrrrrrrrg",
      "rrrrrrrrrrrrrrrrrrrr",
    ],
    palettes: {
      colour: {
        background: "px-sky",
        // "s" (sky) is empty: the background shows through.
        cells: {
          y: "px-yellow",
          g: "px-green",
          r: "px-grey",
          l: "px-white",
          k: "px-pink",
        },
      },
      green: {
        background: "screen-green",
        cells: {
          y: "screen-ink",
          r: "screen-ink",
          g: "screen-green-mid",
        },
      },
    },
  },
};

interface Run {
  key: string;
  x: number;
  y: number;
  width: number;
  fill: FillToken;
}

/** One run per horizontal stretch of cells that share a fill. */
function toRuns(rows: string[], cells: Record<string, FillToken>): Run[] {
  const runs: Run[] = [];
  rows.forEach((row, rowIndex) => {
    let col = 0;
    while (col < COLS) {
      const fill = cells[row[col]];
      if (!fill) {
        col += 1;
        continue;
      }
      const start = col;
      while (col < COLS && cells[row[col]] === fill) col += 1;
      runs.push({
        key: `${rowIndex}-${start}`,
        x: start * CELL,
        y: rowIndex * CELL,
        width: (col - start) * CELL,
        fill,
      });
    }
  });
  return runs;
}

export interface GameScreenProps {
  game: GameScreenGame;
  palette?: GameScreenPalette;
  className?: string;
}

export default function GameScreen({
  game,
  palette = "colour",
  className,
}: GameScreenProps) {
  const spec = GAMES[game];
  const { background, cells } = spec.palettes[palette];
  return (
    <svg
      viewBox={`0 0 ${COLS * CELL} ${ROWS * CELL}`}
      preserveAspectRatio="none"
      shapeRendering="crispEdges"
      role="img"
      aria-label={spec.label}
      data-game={game}
      data-palette={palette}
      className={cn("block h-full w-full", className)}
    >
      <rect
        data-testid="game-screen-background"
        x={0}
        y={0}
        width={COLS * CELL}
        height={ROWS * CELL}
        className={FILL_CLASSES[background]}
      />
      {toRuns(spec.rows, cells).map((run) => (
        <rect
          key={run.key}
          data-testid="game-screen-run"
          x={run.x}
          y={run.y}
          width={run.width}
          height={CELL}
          className={FILL_CLASSES[run.fill]}
        />
      ))}
    </svg>
  );
}
