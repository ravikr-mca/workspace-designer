"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  DURATIONS,
  encodeSetup,
  formatUSD,
  quote,
  selectedProducts,
  type Duration,
  type SetupState,
} from "@/lib/setup-state";
import Thumb from "./Thumb";

const CONFETTI_COLORS = ["#c9704a", "#87a892", "#d9a441", "#f2bf5e", "#7cab84"];

/* Deterministic pseudo-random (mulberry32) so the burst is pure per render */
function seededRandom(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function Confetti() {
  const pieces = useMemo(() => {
    const rand = seededRandom(20260710);
    return Array.from({ length: 42 }, (_, i) => ({
      id: i,
      x: (rand() - 0.5) * 340,
      y: 90 + rand() * 260,
      rotate: (rand() - 0.5) * 720,
      color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
      delay: rand() * 0.15,
      round: i % 3 === 0,
    }));
  }, []);
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-10 z-10">
      {pieces.map((p) => (
        <motion.span
          key={p.id}
          initial={{ x: 0, y: -10, rotate: 0, opacity: 1 }}
          animate={{ x: p.x, y: p.y, rotate: p.rotate, opacity: 0 }}
          transition={{ duration: 1.5, delay: p.delay, ease: [0.16, 1, 0.3, 1] }}
          className={`absolute left-1/2 h-2.5 w-1.5 ${p.round ? "rounded-full" : "rounded-[2px]"}`}
          style={{ backgroundColor: p.color }}
        />
      ))}
    </div>
  );
}

function RemoveIcon() {
  return (
    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" aria-hidden="true">
      <path
        d="M4 4 L12 12 M12 4 L4 12"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function CheckoutSheet({
  open,
  state,
  onClose,
  onRemove,
  onSetDuration,
  onConfirm,
  confirmed,
  onStartOver,
}: {
  open: boolean;
  state: SetupState;
  onClose: () => void;
  onRemove: (id: string) => void;
  onSetDuration: (d: Duration) => void;
  onConfirm: () => void;
  confirmed: boolean;
  onStartOver: () => void;
}) {
  const reduceMotion = useReducedMotion();
  const [copied, setCopied] = useState(false);
  const items = selectedProducts(state);
  const q = quote(state);

  async function copyLink() {
    const url = `${window.location.origin}/?s=${encodeSetup(state)}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard unavailable (permissions/insecure context) — button just stays as-is
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-stretch sm:justify-end">
          <motion.button
            aria-label="Close checkout"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-ink/35"
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Your setup summary"
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 48 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 48 }}
            transition={{ type: "spring", stiffness: 380, damping: 34 }}
            className="relative flex max-h-[92dvh] w-full flex-col overflow-hidden rounded-t-3xl bg-sand sm:max-h-none sm:w-[420px] sm:rounded-none"
          >
            {confirmed ? (
              <div className="relative flex flex-1 flex-col items-center justify-center gap-4 px-8 py-16 text-center">
                {!reduceMotion && <Confetti />}
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-sage-tint">
                  <svg viewBox="0 0 24 24" className="h-8 w-8 text-sage" aria-hidden="true">
                    <path
                      d="M5 12.5 L10 17.5 L19 7"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={3}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <h2 className="font-display text-2xl font-extrabold">Your setup is on its way</h2>
                <p className="max-w-xs text-[15px] leading-relaxed text-ink-soft">
                  {items.length} items, {formatUSD(q.total)} for {q.weeks}{" "}
                  {q.weeks === 1 ? "week" : "weeks"}. We&apos;ll deliver and set everything up
                  today. See you at the desk.
                </p>
                <div className="mt-2 flex flex-col items-center gap-2">
                  <button
                    onClick={copyLink}
                    className="rounded-full border-2 border-ink px-5 py-2.5 font-display text-sm font-bold transition-colors duration-200 hover:bg-ink hover:text-cream"
                  >
                    {copied ? "Link copied!" : "Copy a link to this setup"}
                  </button>
                  <button
                    onClick={onStartOver}
                    className="rounded-full px-4 py-2 text-sm font-medium text-ink-faint transition-colors duration-200 hover:text-ink"
                  >
                    Design another setup
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between px-6 pb-2 pt-6">
                  <h2 className="font-display text-xl font-extrabold">Your setup</h2>
                  <button
                    onClick={onClose}
                    aria-label="Close"
                    className="flex h-9 w-9 items-center justify-center rounded-full text-ink-soft transition-colors duration-200 hover:bg-sand-deep hover:text-ink"
                  >
                    <svg viewBox="0 0 20 20" className="h-5 w-5" aria-hidden="true">
                      <path
                        d="M5 5 L15 15 M15 5 L5 15"
                        stroke="currentColor"
                        strokeWidth={2}
                        strokeLinecap="round"
                      />
                    </svg>
                  </button>
                </div>

                <ul className="min-h-0 flex-1 overflow-y-auto px-6 py-2">
                  {items.map((p) => (
                    <li
                      key={p.id}
                      className="flex items-center gap-3 border-b border-line py-2.5 last:border-0"
                    >
                      <span className="flex h-12 w-14 shrink-0 items-center justify-center rounded-xl bg-cream p-1.5">
                        <Thumb id={p.id} className="h-full w-full" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-semibold">{p.name}</span>
                        <span className="text-[13px] text-ink-faint">
                          {formatUSD(p.pricePerWeek)}/week
                        </span>
                      </span>
                      <button
                        onClick={() => onRemove(p.id)}
                        aria-label={`Remove ${p.name}`}
                        className="flex h-8 w-8 items-center justify-center rounded-full text-ink-faint transition-colors duration-200 hover:bg-terracotta-tint hover:text-terracotta-deep"
                      >
                        <RemoveIcon />
                      </button>
                    </li>
                  ))}
                </ul>

                <div className="border-t border-line px-6 py-4">
                  <p className="pb-2 text-[13px] font-medium text-ink-faint">
                    How long do you need it?
                  </p>
                  <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label="Rental duration">
                    {DURATIONS.map((d) => {
                      const active = state.duration === d.key;
                      return (
                        <button
                          key={d.key}
                          role="radio"
                          aria-checked={active}
                          onClick={() => onSetDuration(d.key)}
                          className={`rounded-xl border-2 px-2 py-2.5 text-center transition-colors duration-200 ${
                            active
                              ? "border-terracotta bg-terracotta-tint"
                              : "border-line bg-cream hover:border-ink-faint"
                          }`}
                        >
                          <span className="block font-display text-sm font-bold">{d.label}</span>
                          <span
                            className={`block text-[11.5px] font-medium ${
                              d.discount > 0 ? "text-terracotta-deep" : "text-ink-faint"
                            }`}
                          >
                            {d.note}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  <dl className="pt-4 text-sm">
                    <div className="flex justify-between py-0.5 text-ink-soft">
                      <dt>
                        {formatUSD(q.weekly)}/week × {q.weeks} {q.weeks === 1 ? "week" : "weeks"}
                      </dt>
                      <dd>{formatUSD(q.gross)}</dd>
                    </div>
                    {q.savings > 0 && (
                      <div className="flex justify-between py-0.5 font-medium text-terracotta-deep">
                        <dt>Longer-stay saving ({Math.round(q.discount * 100)}%)</dt>
                        <dd>−{formatUSD(q.savings)}</dd>
                      </div>
                    )}
                    <div className="flex items-baseline justify-between pt-2 font-display text-xl font-extrabold">
                      <dt>Total</dt>
                      <dd>{formatUSD(q.total)}</dd>
                    </div>
                  </dl>

                  <button
                    onClick={onConfirm}
                    disabled={items.length === 0}
                    className="mt-3 w-full rounded-full bg-terracotta py-3.5 font-display text-[15px] font-bold text-cream transition-colors duration-200 hover:bg-terracotta-deep disabled:cursor-not-allowed disabled:bg-line disabled:text-ink-faint"
                  >
                    Confirm rental · {formatUSD(q.total)}
                  </button>
                  <p className="pt-2.5 text-center text-xs text-ink-faint">
                    Free same-day delivery &amp; setup anywhere in Bali. Cancel anytime.
                  </p>
                </div>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
