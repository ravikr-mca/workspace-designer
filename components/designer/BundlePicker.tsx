"use client";

import { BUNDLES } from "@/lib/catalog";

export default function BundlePicker({
  onApply,
}: {
  onApply: (itemIds: string[]) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-1.5" aria-label="Starter setups">
      <span className="pr-1 text-[13px] font-medium text-ink-faint">Starter setups:</span>
      {BUNDLES.map((b) => (
        <button
          key={b.id}
          onClick={() => onApply(b.itemIds)}
          title={b.tagline}
          className="rounded-full border border-line bg-cream px-3.5 py-1.5 font-display text-[13px] font-semibold text-ink-soft transition-colors duration-200 hover:border-terracotta hover:bg-terracotta-tint hover:text-terracotta-deep"
        >
          {b.name}
        </button>
      ))}
    </div>
  );
}
