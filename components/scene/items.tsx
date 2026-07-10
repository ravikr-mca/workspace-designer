import type { JSX } from "react";
import { P } from "./palette";

/* Every item is drawn with its anchor at (0,0) = bottom-center, growing
   upward in negative y. The Scene compositor translates it into place. */

export type ItemKind =
  | "desk"
  | "chair"
  | "surface" // sits on the desk back line, auto-arranged
  | "front" // fixed spot on the desk front edge (keyboard, mug)
  | "floor-left"
  | "floor-right"
  | "rug";

export interface SceneItem {
  kind: ItemKind;
  width: number; // footprint used by the surface auto-layout
  height: number; // visual height, used for picker thumbnails
  render: () => JSX.Element;
}

/* ── Desks (surface line at y = -170, top spans x = ±230) ── */

function DeskStanding() {
  return (
    <g>
      {/* crank legs */}
      <rect x={-186} y={-170} width={14} height={166} fill={P.ink} />
      <rect x={172} y={-170} width={14} height={166} fill={P.ink} />
      <rect x={-216} y={-10} width={74} height={10} rx={5} fill={P.inkSoft} />
      <rect x={142} y={-10} width={74} height={10} rx={5} fill={P.inkSoft} />
      <rect x={-180} y={-64} width={360} height={9} fill={P.inkSoft} />
      {/* crank handle */}
      <circle cx={196} cy={-140} r={7} fill={P.metal} />
      <rect x={196} y={-144} width={26} height={8} rx={4} fill={P.metal} />
      {/* top */}
      <rect x={-230} y={-186} width={460} height={18} rx={6} fill={P.woodLight} />
      <rect x={-230} y={-174} width={460} height={6} rx={3} fill={P.woodLightDark} />
    </g>
  );
}

function DeskElectric() {
  return (
    <g>
      {/* T-legs */}
      <rect x={-168} y={-170} width={16} height={166} fill={P.ink} />
      <rect x={152} y={-170} width={16} height={166} fill={P.ink} />
      <rect x={-222} y={-8} width={124} height={8} rx={4} fill={P.ink} />
      <rect x={98} y={-8} width={124} height={8} rx={4} fill={P.ink} />
      {/* motor housings */}
      <rect x={-176} y={-166} width={32} height={26} rx={5} fill={P.inkSoft} />
      <rect x={144} y={-166} width={32} height={26} rx={5} fill={P.inkSoft} />
      {/* top */}
      <rect x={-230} y={-184} width={460} height={16} rx={6} fill={P.teak} />
      <rect x={-230} y={-173} width={460} height={5} rx={2.5} fill={P.teakDark} />
      {/* control pad */}
      <rect x={122} y={-168} width={34} height={10} rx={3} fill={P.metalLight} />
      <circle cx={131} cy={-163} r={2.4} fill={P.ink} />
      <circle cx={140} cy={-163} r={2.4} fill={P.ink} />
      <circle cx={149} cy={-163} r={2.4} fill={P.terracotta} />
    </g>
  );
}

function DeskTeak() {
  return (
    <g>
      {/* side panels */}
      <rect x={-224} y={-170} width={64} height={166} rx={4} fill={P.teakDark} />
      {/* drawer pedestal */}
      <rect x={112} y={-170} width={112} height={166} rx={4} fill={P.teak} />
      <rect x={124} y={-152} width={88} height={40} rx={4} fill={P.teakLight} />
      <rect x={124} y={-104} width={88} height={40} rx={4} fill={P.teakLight} />
      <rect x={124} y={-56} width={88} height={40} rx={4} fill={P.teakLight} />
      <rect x={156} y={-136} width={24} height={5} rx={2.5} fill={P.teakDark} />
      <rect x={156} y={-88} width={24} height={5} rx={2.5} fill={P.teakDark} />
      <rect x={156} y={-40} width={24} height={5} rx={2.5} fill={P.teakDark} />
      {/* top */}
      <rect x={-236} y={-188} width={472} height={20} rx={7} fill={P.teakLight} />
      <rect x={-236} y={-175} width={472} height={7} rx={3.5} fill={P.teak} />
    </g>
  );
}

/* ── Chairs (front view, floor anchor) ── */

function StarBase({ tint }: { tint: string }) {
  return (
    <g>
      <path d="M0 -34 L-64 -4" stroke={tint} strokeWidth={9} strokeLinecap="round" fill="none" />
      <path d="M0 -34 L64 -4" stroke={tint} strokeWidth={9} strokeLinecap="round" fill="none" />
      <path d="M0 -34 L-26 -2" stroke={tint} strokeWidth={9} strokeLinecap="round" fill="none" />
      <path d="M0 -34 L26 -2" stroke={tint} strokeWidth={9} strokeLinecap="round" fill="none" />
      <circle cx={-64} cy={-5} r={6.5} fill={P.inkSoft} />
      <circle cx={64} cy={-5} r={6.5} fill={P.inkSoft} />
      <circle cx={-26} cy={-3} r={6.5} fill={P.inkSoft} />
      <circle cx={26} cy={-3} r={6.5} fill={P.inkSoft} />
      <rect x={-6} y={-96} width={12} height={66} rx={5} fill={P.metal} />
    </g>
  );
}

function ChairErgo() {
  return (
    <g>
      <StarBase tint={P.ink} />
      {/* seat */}
      <rect x={-58} y={-118} width={116} height={30} rx={12} fill={P.terracotta} />
      <rect x={-58} y={-100} width={116} height={12} rx={6} fill={P.terracottaDark} />
      {/* armrests */}
      <rect x={-74} y={-152} width={10} height={44} rx={5} fill={P.ink} />
      <rect x={64} y={-152} width={10} height={44} rx={5} fill={P.ink} />
      <rect x={-84} y={-160} width={32} height={10} rx={5} fill={P.inkSoft} />
      <rect x={52} y={-160} width={32} height={10} rx={5} fill={P.inkSoft} />
      {/* backrest + lumbar */}
      <rect x={-50} y={-252} width={100} height={130} rx={20} fill={P.terracotta} />
      <path
        d="M-46 -176 Q0 -162 46 -176"
        stroke={P.terracottaDark}
        strokeWidth={6}
        strokeLinecap="round"
        fill="none"
      />
      {/* headrest */}
      <rect x={-32} y={-286} width={64} height={26} rx={12} fill={P.terracottaDark} />
    </g>
  );
}

function ChairMesh() {
  return (
    <g>
      <StarBase tint={P.inkSoft} />
      <rect x={-54} y={-114} width={108} height={26} rx={11} fill={P.sage} />
      <rect x={-54} y={-98} width={108} height={10} rx={5} fill={P.sageDark} />
      {/* back frame + mesh */}
      <rect x={-46} y={-238} width={92} height={122} rx={18} fill={P.sage} />
      <rect x={-36} y={-228} width={72} height={102} rx={12} fill={P.sageDark} opacity={0.35} />
      <path d="M-36 -202 H36 M-36 -178 H36 M-36 -154 H36" stroke={P.sageDark} strokeWidth={2.5} />
      <path d="M-18 -228 V-126 M18 -228 V-126" stroke={P.sageDark} strokeWidth={2.5} />
    </g>
  );
}

function ChairStool() {
  return (
    <g>
      <ellipse cx={0} cy={-6} rx={44} ry={10} fill={P.ink} />
      <rect x={-6} y={-96} width={12} height={88} rx={5} fill={P.metal} />
      <ellipse cx={0} cy={-104} rx={48} ry={18} fill={P.mustard} />
      <ellipse cx={0} cy={-109} rx={48} ry={16} fill={P.mustardDark} opacity={0.25} />
      <path d="M-30 -104 Q0 -96 30 -104" stroke={P.mustardDark} strokeWidth={3.5} strokeLinecap="round" fill="none" />
    </g>
  );
}

/* ── Monitors ── */

function Monitor({
  w,
  h,
  bezel,
  studio,
}: {
  w: number;
  h: number;
  bezel: number;
  studio?: boolean;
}) {
  const frame = studio ? P.metalLight : P.bezel;
  return (
    <g>
      {studio ? (
        <path d={`M-26 0 L26 0 L18 -34 L-18 -34 Z`} fill={P.metalLight} />
      ) : (
        <g>
          <rect x={-32} y={-7} width={64} height={7} rx={3.5} fill={P.ink} />
          <rect x={-5} y={-42} width={10} height={38} rx={4} fill={P.ink} />
        </g>
      )}
      <rect
        x={-w / 2}
        y={studio ? -34 - h : -40 - h}
        width={w}
        height={h}
        rx={7}
        fill={frame}
      />
      <rect
        x={-w / 2 + bezel}
        y={(studio ? -34 - h : -40 - h) + bezel}
        width={w - bezel * 2}
        height={h - bezel * 2 - (studio ? 8 : 0)}
        rx={4}
        fill={P.screen}
      />
      <path
        d={`M${-w / 2 + bezel} ${(studio ? -34 : -40) - bezel - 4} L${-w / 2 + bezel + (w - bezel * 2) * 0.45} ${(studio ? -34 - h : -40 - h) + bezel} L${-w / 2 + bezel} ${(studio ? -34 - h : -40 - h) + bezel} Z`}
        fill={P.screenGlow}
        opacity={0.8}
      />
      {!studio && <circle cx={0} cy={-44} r={2.2} fill={P.sageDark} />}
    </g>
  );
}

const Mon24 = () => <Monitor w={124} h={76} bezel={6} />;
const Mon27 = () => <Monitor w={148} h={88} bezel={4} />;
const MonStudio = () => <Monitor w={148} h={92} bezel={5} studio />;

/* ── Tech ── */

function Macbook() {
  return (
    <g>
      <rect x={-58} y={-84} width={116} height={76} rx={6} fill={P.metalLight} />
      <rect x={-53} y={-79} width={106} height={62} rx={3} fill={P.screen} />
      <path d="M-53 -17 L-6 -79 L-53 -79 Z" fill={P.screenGlow} opacity={0.8} />
      <rect x={-9} y={-84} width={18} height={5} rx={2.5} fill={P.metalLight} />
      <path d="M-66 0 L66 0 L58 -8 L-58 -8 Z" fill={P.metal} />
      <rect x={-12} y={-7} width={24} height={3} rx={1.5} fill={P.metalLight} />
    </g>
  );
}

function Keyboard() {
  return (
    <g>
      <rect x={-72} y={-11} width={116} height={11} rx={5} fill={P.cream} />
      <path
        d="M-62 -7.5 H34 M-62 -4 H34"
        stroke={P.metal}
        strokeWidth={1.6}
        strokeLinecap="round"
      />
      <ellipse cx={62} cy={-6} rx={10} ry={7} fill={P.cream} />
      <path d="M62 -10 V-6" stroke={P.metal} strokeWidth={1.6} />
    </g>
  );
}

function Headphones() {
  return (
    <g>
      <ellipse cx={0} cy={-2} rx={22} ry={4} fill={P.inkSoft} />
      <rect x={-3.5} y={-64} width={7} height={60} rx={3} fill={P.metal} />
      <path d="M0 -64 Q14 -64 14 -52" stroke={P.metal} strokeWidth={6} strokeLinecap="round" fill="none" />
      {/* hanging headphones */}
      <path d="M-14 -46 Q0 -60 14 -46" stroke={P.ink} strokeWidth={6} fill="none" />
      <rect x={-21} y={-48} width={13} height={20} rx={6} fill={P.ink} />
      <rect x={8} y={-48} width={13} height={20} rx={6} fill={P.ink} />
      <rect x={-18.5} y={-45} width={8} height={14} rx={4} fill={P.terracotta} />
      <rect x={10.5} y={-45} width={8} height={14} rx={4} fill={P.terracotta} />
    </g>
  );
}

/* ── Lighting ── */

function DeskLamp() {
  return (
    <g>
      <ellipse cx={0} cy={-3} rx={22} ry={5} fill={P.ink} />
      <path d="M0 -6 L-12 -62" stroke={P.ink} strokeWidth={5.5} strokeLinecap="round" />
      <circle cx={-12} cy={-62} r={4.5} fill={P.terracotta} />
      <path d="M-12 -62 L26 -88" stroke={P.ink} strokeWidth={5.5} strokeLinecap="round" />
      {/* shade */}
      <path d="M18 -96 L44 -78 L30 -64 Z" fill={P.terracotta} />
      <path d="M22 -70 L64 -30 L30 -22 Z" fill={P.sun} opacity={0.32} />
    </g>
  );
}

function FloorLamp() {
  return (
    <g>
      <ellipse cx={0} cy={-5} rx={36} ry={9} fill={P.ink} />
      <path
        d="M0 -10 L0 -238 Q0 -282 -52 -282 L-116 -282"
        stroke={P.metal}
        strokeWidth={8}
        strokeLinecap="round"
        fill="none"
      />
      {/* dome shade */}
      <path d="M-146 -282 A30 30 0 0 0 -86 -282 Z" fill={P.terracotta} />
      <path d="M-146 -282 A30 30 0 0 1 -86 -282" fill={P.terracottaDark} opacity={0.4} />
      <circle cx={-116} cy={-274} r={6} fill={P.sun} />
      <path d="M-140 -270 L-92 -270 L-72 -196 L-160 -196 Z" fill={P.sun} opacity={0.2} />
    </g>
  );
}

/* ── Comfort ── */

function Monstera() {
  return (
    <g>
      <g className="plant-sway">
        <path d="M0 -46 Q-34 -92 -58 -138" stroke={P.leafDark} strokeWidth={5} fill="none" />
        <path d="M0 -46 Q6 -110 44 -150" stroke={P.leafDark} strokeWidth={5} fill="none" />
        <path d="M0 -46 Q-4 -86 -6 -108" stroke={P.leafDark} strokeWidth={5} fill="none" />
        {/* big split leaves */}
        <path
          d="M-58 -138 Q-96 -170 -70 -196 Q-38 -216 -34 -172 Q-32 -148 -58 -138 Z"
          fill={P.leaf}
        />
        <path d="M-58 -140 L-62 -186" stroke={P.leafDark} strokeWidth={3} />
        <path
          d="M44 -150 Q52 -206 96 -196 Q120 -178 84 -152 Q62 -138 44 -150 Z"
          fill={P.leafDark}
        />
        <path d="M46 -152 L86 -178" stroke={P.leaf} strokeWidth={3} />
        <path
          d="M-6 -108 Q-46 -128 -32 -160 Q-4 -178 8 -140 Q12 -118 -6 -108 Z"
          fill={P.leaf}
        />
        <path
          d="M-4 -110 Q34 -134 58 -112 Q66 -84 24 -88 Q0 -92 -4 -110 Z"
          fill={P.leafDark}
        />
      </g>
      {/* pot */}
      <path d="M-34 -52 L34 -52 L26 0 L-26 0 Z" fill={P.clay} />
      <rect x={-38} y={-60} width={76} height={12} rx={5} fill={P.clayDark} />
    </g>
  );
}

function DeskPlant() {
  return (
    <g>
      <g className="plant-sway">
        <path d="M0 -20 Q-12 -34 -8 -48" stroke={P.leafDark} strokeWidth={4} strokeLinecap="round" fill="none" />
        <path d="M0 -20 Q12 -36 6 -50" stroke={P.leaf} strokeWidth={4} strokeLinecap="round" fill="none" />
        <path d="M0 -20 Q0 -38 0 -44" stroke={P.sageDark} strokeWidth={4} strokeLinecap="round" fill="none" />
        <circle cx={-8} cy={-50} r={5} fill={P.leaf} />
        <circle cx={6} cy={-52} r={5} fill={P.leafDark} />
        <circle cx={0} cy={-46} r={4.5} fill={P.sage} />
      </g>
      <path d="M-14 -22 L14 -22 L10 0 L-10 0 Z" fill={P.terracotta} />
      <rect x={-16} y={-27} width={32} height={7} rx={3} fill={P.terracottaDark} />
    </g>
  );
}

function Rug() {
  return (
    <g>
      <ellipse cx={0} cy={0} rx={330} ry={54} fill={P.jute} />
      <ellipse cx={0} cy={0} rx={296} ry={45} fill="none" stroke={P.juteDark} strokeWidth={5} />
      <ellipse cx={0} cy={0} rx={240} ry={34} fill="none" stroke={P.juteDark} strokeWidth={3} opacity={0.7} />
      <ellipse cx={0} cy={0} rx={180} ry={24} fill="none" stroke={P.juteDark} strokeWidth={3} opacity={0.5} />
    </g>
  );
}

function Mug() {
  return (
    <g>
      <g className="steam-wisp">
        <path d="M-5 -36 Q-9 -42 -5 -48" stroke={P.metal} strokeWidth={2.5} strokeLinecap="round" fill="none" />
      </g>
      <g className="steam-wisp delay">
        <path d="M4 -38 Q8 -44 4 -50" stroke={P.metal} strokeWidth={2.5} strokeLinecap="round" fill="none" />
      </g>
      <rect x={-13} y={-30} width={26} height={30} rx={5} fill={P.cream} />
      <path d="M13 -24 Q26 -22 22 -12 Q20 -6 13 -8" fill="none" stroke={P.cream} strokeWidth={5} />
      <rect x={-13} y={-30} width={26} height={8} rx={4} fill={P.clayDark} />
      <rect x={-9} y={-16} width={18} height={4} rx={2} fill={P.terracotta} opacity={0.6} />
    </g>
  );
}

/* ── Registry ── */

export const SCENE_ITEMS: Record<string, SceneItem> = {
  "desk-standing": { kind: "desk", width: 460, height: 200, render: DeskStanding },
  "desk-electric": { kind: "desk", width: 460, height: 200, render: DeskElectric },
  "desk-teak": { kind: "desk", width: 472, height: 202, render: DeskTeak },
  "chair-ergo": { kind: "chair", width: 170, height: 300, render: ChairErgo },
  "chair-mesh": { kind: "chair", width: 150, height: 252, render: ChairMesh },
  "chair-stool": { kind: "chair", width: 100, height: 136, render: ChairStool },
  "mon-24": { kind: "surface", width: 130, height: 125, render: Mon24 },
  "mon-27": { kind: "surface", width: 154, height: 142, render: Mon27 },
  "mon-studio": { kind: "surface", width: 154, height: 134, render: MonStudio },
  macbook: { kind: "surface", width: 136, height: 92, render: Macbook },
  keyboard: { kind: "front", width: 150, height: 26, render: Keyboard },
  headphones: { kind: "surface", width: 60, height: 72, render: Headphones },
  desklamp: { kind: "surface", width: 90, height: 104, render: DeskLamp },
  floorlamp: { kind: "floor-right", width: 312, height: 300, render: FloorLamp },
  monstera: { kind: "floor-left", width: 250, height: 230, render: Monstera },
  deskplant: { kind: "surface", width: 44, height: 62, render: DeskPlant },
  rug: { kind: "rug", width: 660, height: 112, render: Rug },
  mug: { kind: "front", width: 52, height: 56, render: Mug },
};
