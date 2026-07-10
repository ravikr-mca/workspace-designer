"use client";

import { AnimatePresence, motion } from "motion/react";
import type { SetupState } from "@/lib/setup-state";
import { SCENE_ITEMS } from "./items";
import { P } from "./palette";

/* Scene geometry (viewBox 1200×800):
   wall/floor line y=620 · desk base (600,640) · chair (600,726)
   rug (600,716) · plant corner (250,692) · lamp corner (968,688) */

const DESK_POS = { x: 600, y: 640 };
const CHAIR_POS = { x: 600, y: 726 };

/* Desk surface height above its base, per desk — must match the y of each
   desk's top-face rect in items.tsx (not the underside of the slab), or
   surface items render partially sunk into the desktop. */
const DESK_SURFACE: Record<string, number> = {
  "desk-standing": 186,
  "desk-electric": 184,
  "desk-teak": 188,
};

const SURFACE_ORDER = [
  "deskplant",
  "macbook",
  "mon-24",
  "mon-27",
  "mon-studio",
  "headphones",
  "desklamp",
];

interface Placement {
  id: string;
  x: number;
  y: number;
  scale: number;
}

function computePlacements(state: SetupState): Placement[] {
  const placements: Placement[] = [];
  const surfaceY = DESK_POS.y - (state.deskId ? DESK_SURFACE[state.deskId] ?? 186 : 186);

  if (state.accessoryIds.includes("rug")) {
    placements.push({ id: "rug", x: 600, y: 716, scale: 1 });
  }
  if (state.accessoryIds.includes("monstera")) {
    placements.push({ id: "monstera", x: 250, y: 692, scale: 1 });
  }
  if (state.accessoryIds.includes("floorlamp")) {
    placements.push({ id: "floorlamp", x: 968, y: 688, scale: 1 });
  }
  if (state.deskId) {
    placements.push({ id: state.deskId, x: DESK_POS.x, y: DESK_POS.y, scale: 1 });
  }

  /* Auto-arrange the desk back line: distribute selected surface items
     across the desktop, shrinking gently if it gets crowded. The keyboard
     and mug (fixed front-edge items) share the same scale factor so a
     packed desk shrinks as one consistent group instead of mixing
     full-size front items with a shrunken back row. */
  const surface = SURFACE_ORDER.filter((id) => state.accessoryIds.includes(id));
  let surfaceScale = 1;
  if (surface.length > 0) {
    const span = 440;
    const minGap = 8;
    const widths = surface.map((id) => SCENE_ITEMS[id].width);
    const total = widths.reduce((a, b) => a + b, 0);
    const needed = total + minGap * (surface.length + 1);
    surfaceScale = needed > span ? span / needed : 1;
    const gap =
      surfaceScale === 1 ? (span - total) / (surface.length + 1) : minGap * surfaceScale;
    let cursor = DESK_POS.x - span / 2 + gap;
    surface.forEach((id, i) => {
      const w = widths[i] * surfaceScale;
      placements.push({ id, x: cursor + w / 2, y: surfaceY, scale: surfaceScale });
      cursor += w + gap;
    });
  }

  if (state.accessoryIds.includes("keyboard")) {
    placements.push({
      id: "keyboard",
      x: 588,
      y: surfaceY + 14 * surfaceScale,
      scale: surfaceScale,
    });
  }
  if (state.accessoryIds.includes("mug")) {
    placements.push({
      id: "mug",
      x: 762,
      y: surfaceY + 12 * surfaceScale,
      scale: 0.9 * surfaceScale,
    });
  }
  if (state.chairId) {
    placements.push({ id: state.chairId, x: CHAIR_POS.x, y: CHAIR_POS.y, scale: 1 });
  }
  return placements;
}

const POP = {
  type: "spring" as const,
  stiffness: 320,
  damping: 24,
  mass: 0.9,
};

export default function Scene({ state }: { state: SetupState }) {
  const placements = computePlacements(state);
  const empty = placements.length === 0;

  return (
    <svg
      viewBox="0 0 1200 800"
      role="img"
      aria-label="Illustrated preview of your workspace setup"
      className="block h-full w-full"
      preserveAspectRatio="xMidYMax slice"
    >
      {/* room */}
      <defs>
        <radialGradient id="room-glow" cx="46%" cy="32%" r="75%">
          <stop offset="0%" stopColor={P.wallDeep} stopOpacity={0} />
          <stop offset="100%" stopColor={P.terracottaDark} stopOpacity={0.055} />
        </radialGradient>
        <linearGradient id="floor-fade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={P.floorShade} stopOpacity={0.5} />
          <stop offset="100%" stopColor={P.floorShade} stopOpacity={0} />
        </linearGradient>
      </defs>
      <rect x={0} y={0} width={1200} height={624} fill={P.wall} />
      {/* wainscoting band */}
      <rect x={0} y={460} width={1200} height={160} fill={P.wallDeep} />
      <rect x={0} y={456} width={1200} height={6} fill={P.panelLine} />
      {Array.from({ length: 15 }, (_, i) => (
        <line
          key={i}
          x1={i * 84 + 20}
          y1={470}
          x2={i * 84 + 20}
          y2={616}
          stroke={P.panelLine}
          strokeWidth={2}
          opacity={0.6}
        />
      ))}
      <rect x={0} y={596} width={1200} height={28} fill={P.wallShade} />
      <rect x={0} y={620} width={1200} height={180} fill={P.floor} />
      {/* floorboards */}
      {Array.from({ length: 10 }, (_, i) => (
        <line
          key={i}
          x1={0}
          y1={640 + i * 17}
          x2={1200}
          y2={640 + i * 17}
          stroke={P.floorShade}
          strokeWidth={1.5}
          opacity={0.45}
        />
      ))}
      <rect x={0} y={620} width={1200} height={10} fill={P.floorShade} />
      <rect x={0} y={620} width={1200} height={130} fill="url(#floor-fade)" />
      <rect x={0} y={0} width={1200} height={800} fill="url(#room-glow)" />

      {/* window with curtains and a palm view */}
      <g>
        <defs>
          <clipPath id="window-view">
            <path d="M150 430 L150 240 Q150 130 270 130 Q390 130 390 240 L390 430 Z" />
          </clipPath>
        </defs>
        <path
          d="M150 430 L150 240 Q150 130 270 130 Q390 130 390 240 L390 430 Z"
          fill={P.sky}
        />
        <g clipPath="url(#window-view)">
          <circle cx={318} cy={230} r={36} fill={P.sun} />
          {/* palm peeking in from the left */}
          <path
            d="M168 430 Q186 360 176 306"
            stroke={P.palmDark}
            strokeWidth={13}
            strokeLinecap="round"
            fill="none"
          />
          <path d="M176 306 Q214 258 272 254 Q222 276 192 312 Q182 314 176 306 Z" fill={P.palm} />
          <path d="M176 306 Q236 296 282 320 Q228 316 190 318 Q178 314 176 306 Z" fill={P.palmDark} />
          <path d="M176 306 Q158 252 108 236 Q150 272 168 312 Q174 314 176 306 Z" fill={P.palm} />
          <path d="M176 306 Q198 348 250 366 Q206 358 180 326 Z" fill={P.palmDark} />
          {/* distant hill line */}
          <path d="M150 402 Q250 372 390 398 L390 430 L150 430 Z" fill={P.palm} opacity={0.28} />
        </g>
        {/* sheer curtains, tied back at the sides */}
        <path
          d="M118 120 Q108 280 132 430 L154 430 Q132 280 142 120 Z"
          fill={P.curtain}
          opacity={0.92}
        />
        <path d="M122 130 Q116 280 136 424" stroke={P.curtainShade} strokeWidth={2} fill="none" opacity={0.7} />
        <circle cx={134} cy={318} r={7} fill={P.terracotta} opacity={0.8} />
        <path
          d="M398 120 Q408 280 384 430 L406 430 Q422 280 412 120 Z"
          fill={P.curtain}
          opacity={0.92}
        />
        <path d="M406 130 Q414 280 400 424" stroke={P.curtainShade} strokeWidth={2} fill="none" opacity={0.7} />
        <circle cx={396} cy={318} r={7} fill={P.terracotta} opacity={0.8} />
        <rect x={110} y={110} width={310} height={10} rx={5} fill={P.windowFrame} />

        <path
          d="M150 430 L150 240 Q150 130 270 130 Q390 130 390 240 L390 430 Z"
          fill="none"
          stroke={P.windowFrame}
          strokeWidth={14}
        />
        <line x1={270} y1={144} x2={270} y2={430} stroke={P.windowFrame} strokeWidth={10} />
        <line x1={157} y1={300} x2={383} y2={300} stroke={P.windowFrame} strokeWidth={10} />
        <ellipse cx={270} cy={432} rx={128} ry={9} fill={P.shadow} opacity={0.5} />
      </g>

      {/* framed print + floating shelf on the right wall */}
      <g>
        <rect x={932} y={168} width={116} height={144} rx={5} fill={P.cream} stroke={P.windowFrame} strokeWidth={7} />
        <path d="M950 288 Q978 218 1006 288" fill={P.terracotta} opacity={0.75} />
        <circle cx={1016} cy={202} r={14} fill={P.sun} />
        <path d="M946 244 Q990 230 1034 244" stroke={P.sage} strokeWidth={4.5} fill="none" />
        <ellipse cx={990} cy={316} rx={62} ry={7} fill={P.shadow} opacity={0.4} />

        {/* shelf with books + a little plant */}
        <rect x={912} y={392} width={172} height={8} rx={3} fill={P.shelf} />
        <rect x={914} y={400} width={168} height={4} fill={P.terracottaDark} opacity={0.25} />
        <rect x={928} y={356} width={16} height={36} fill={P.bookRed} />
        <rect x={946} y={350} width={14} height={42} fill={P.bookMustard} />
        <rect x={962} y={360} width={15} height={32} fill={P.bookSage} />
        <path d="M998 392 L998 372 Q998 358 1012 358 Q1026 358 1026 372 L1026 392 Z" fill={P.leaf} />
        <rect x={1002} y={392} width={20} height={10} rx={3} fill={P.clay} />
        <ellipse cx={996} cy={402} rx={78} ry={6} fill={P.shadow} opacity={0.35} />
      </g>

      {/* ghost hints while slots are empty */}
      {!state.deskId && (
        <g stroke={P.floorShade} strokeWidth={4} strokeDasharray="12 10" fill="none" opacity={empty ? 0.9 : 0.65}>
          <rect x={380} y={456} width={440} height={16} rx={6} />
          <line x1={400} y1={472} x2={400} y2={636} />
          <line x1={800} y1={472} x2={800} y2={636} />
        </g>
      )}
      {!state.chairId && (
        <g stroke={P.floorShade} strokeWidth={4} strokeDasharray="10 9" fill="none" opacity={0.55}>
          <rect x={548} y={506} width={104} height={110} rx={22} />
          <line x1={600} y1={616} x2={600} y2={690} />
          <line x1={556} y1={700} x2={644} y2={700} />
        </g>
      )}

      {/* soft contact shadows */}
      {state.deskId && <ellipse cx={600} cy={646} rx={252} ry={13} fill={P.shadow} />}
      {state.chairId && <ellipse cx={600} cy={728} rx={82} ry={10} fill={P.shadow} />}
      {state.accessoryIds.includes("monstera") && (
        <ellipse cx={250} cy={694} rx={44} ry={8} fill={P.shadow} />
      )}
      {state.accessoryIds.includes("floorlamp") && (
        <ellipse cx={968} cy={690} rx={44} ry={8} fill={P.shadow} />
      )}

      <AnimatePresence>
        {placements.map((p) => {
          const item = SCENE_ITEMS[p.id];
          if (!item) return null;
          return (
            <motion.g
              key={p.id}
              initial={{ x: p.x, y: p.y + 26, scale: 0, opacity: 0 }}
              animate={{ x: p.x, y: p.y, scale: p.scale, opacity: 1 }}
              exit={{ scale: 0, opacity: 0, transition: { duration: 0.18 } }}
              transition={POP}
            >
              <item.render />
            </motion.g>
          );
        })}
      </AnimatePresence>
    </svg>
  );
}
