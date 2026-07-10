"use client";

import { useState } from "react";
import { CATEGORIES, PRODUCTS, type Category, type Product } from "@/lib/catalog";
import { formatUSD, isSelected, type SetupState } from "@/lib/setup-state";
import Thumb from "./Thumb";

/* Items that sit on or at the desk — locked until a desk is chosen */
const NEEDS_DESK = new Set([
  "mon-24", "mon-27", "mon-studio",
  "macbook", "keyboard", "headphones",
  "desklamp", "deskplant", "mug",
]);

function CheckIcon() {
  return (
    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" aria-hidden="true">
      <path
        d="M3 8.5 L6.5 12 L13 4.5"
        fill="none"
        stroke="currentColor"
        strokeWidth={2.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" aria-hidden="true">
      <path
        d="M8 3 V13 M3 8 H13"
        fill="none"
        stroke="currentColor"
        strokeWidth={2.2}
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function ProductTray({
  state,
  onToggle,
}: {
  state: SetupState;
  onToggle: (product: Product) => void;
}) {
  const [category, setCategory] = useState<Category>("desks");
  const active = CATEGORIES.find((c) => c.key === category)!;
  const products = PRODUCTS.filter((p) => p.category === category);
  const hasLockedItems = !state.deskId && products.some((p) => NEEDS_DESK.has(p.id));

  return (
    <section aria-label="Product picker" className="flex min-h-0 flex-col">
      <div
        aria-label="Product categories"
        className="no-scrollbar -mx-1 flex gap-1.5 overflow-x-auto px-1 pb-3"
      >
        {CATEGORIES.map((c) => {
          const current = c.key === category;
          const count = PRODUCTS.filter(
            (p) => p.category === c.key && isSelected(state, p.id),
          ).length;
          return (
            <button
              key={c.key}
              aria-pressed={current}
              onClick={() => setCategory(c.key)}
              className={`relative shrink-0 rounded-full px-4 py-2 font-display text-sm font-semibold transition-colors duration-200 ${
                current
                  ? "bg-ink text-cream"
                  : "bg-cream text-ink-soft hover:bg-sand-deep hover:text-ink"
              }`}
            >
              {c.label}
              {count > 0 && (
                <span
                  className={`ml-1.5 inline-flex h-4.5 min-w-4.5 items-center justify-center rounded-full px-1 text-[11px] font-bold ${
                    current ? "bg-terracotta text-cream" : "bg-terracotta-tint text-terracotta-deep"
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <p className="pb-2 text-[13px] text-ink-faint">
        {active.pick === "one" ? "Pick one. Tap again to remove it." : "Add as many as you like."}
      </p>

      {hasLockedItems && (
        <button
          onClick={() => setCategory("desks")}
          className="mb-2.5 flex w-full items-center gap-2 rounded-xl bg-terracotta-tint px-3 py-2 text-left text-[12.5px] text-terracotta-deep transition-colors hover:bg-terracotta/15"
        >
          <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 shrink-0" aria-hidden="true">
            <rect x={3} y={8} width={10} height={7} rx={2} fill="none" stroke="currentColor" strokeWidth={1.6} />
            <path d="M5 8 V5 A3 3 0 0 1 11 5 V8" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" />
          </svg>
          Pick a desk first to unlock these items
        </button>
      )}

      <div className="grid grid-cols-2 gap-2.5 lg:overflow-y-auto lg:pr-1">
        {products.map((p) => {
          const selected = isSelected(state, p.id);
          const locked = NEEDS_DESK.has(p.id) && !state.deskId;
          return (
            <button
              key={p.id}
              aria-pressed={selected}
              aria-disabled={locked}
              onClick={() => {
                if (locked) { setCategory("desks"); return; }
                onToggle(p);
              }}
              className={`group relative flex min-h-11 flex-col rounded-2xl border-2 p-3 text-left transition-colors duration-200 ${
                locked
                  ? "cursor-pointer border-line bg-cream opacity-45"
                  : selected
                  ? "border-terracotta bg-terracotta-tint"
                  : "border-line bg-cream hover:border-ink-faint"
              }`}
            >
              {locked ? (
                <span
                  className="absolute right-2.5 top-2.5 flex h-6 w-6 items-center justify-center rounded-full bg-sand-deep text-ink-faint"
                  aria-hidden="true"
                >
                  <svg viewBox="0 0 16 16" className="h-3 w-3">
                    <rect x={3} y={8} width={10} height={7} rx={2} fill="none" stroke="currentColor" strokeWidth={1.6} />
                    <path d="M5 8 V5 A3 3 0 0 1 11 5 V8" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" />
                  </svg>
                </span>
              ) : (
                <span
                  className={`absolute right-2.5 top-2.5 flex h-6 w-6 items-center justify-center rounded-full transition-colors duration-200 ${
                    selected
                      ? "bg-terracotta text-cream"
                      : "bg-sand-deep text-ink-soft group-hover:bg-ink group-hover:text-cream"
                  }`}
                  aria-hidden="true"
                >
                  {selected ? <CheckIcon /> : <PlusIcon />}
                </span>
              )}
              <Thumb id={p.id} className="h-20 w-full" />
              <span className="mt-2 font-display text-[13.5px] font-bold leading-tight">
                {p.name}
              </span>
              <span className="mt-0.5 text-xs text-ink-faint">{p.blurb}</span>
              <span className="mt-1.5 font-display text-sm font-bold text-terracotta-deep">
                {formatUSD(p.pricePerWeek)}
                <span className="font-sans text-xs font-medium text-ink-faint">/week</span>
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
