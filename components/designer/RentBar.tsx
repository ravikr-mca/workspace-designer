"use client";

import { formatUSD, selectedProducts, weeklyTotal, type SetupState } from "@/lib/setup-state";

export default function RentBar({
  state,
  onRent,
  onClear,
}: {
  state: SetupState;
  onRent: () => void;
  onClear: () => void;
}) {
  const items = selectedProducts(state);
  const weekly = weeklyTotal(state);
  const empty = items.length === 0;

  return (
    <div className="sticky bottom-0 z-30 border-t border-line bg-cream/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3 sm:px-6">
        <div className="min-w-0 flex-1">
          {empty ? (
            <p className="text-sm text-ink-faint">Your setup is empty. Add a desk to begin.</p>
          ) : (
            <>
              <p className="font-display text-lg font-bold leading-tight">
                {formatUSD(weekly)}
                <span className="font-sans text-sm font-medium text-ink-faint">/week</span>
              </p>
              <p className="truncate text-[13px] text-ink-faint">
                {items.length} {items.length === 1 ? "item" : "items"} · free same-day delivery
                in Dubai
              </p>
            </>
          )}
        </div>
        {!empty && (
          <button
            onClick={onClear}
            className="rounded-full px-3 py-2 text-sm font-medium text-ink-faint transition-colors duration-200 hover:bg-sand-deep hover:text-ink"
          >
            Clear
          </button>
        )}
        <button
          onClick={onRent}
          disabled={empty}
          className="rounded-full bg-terracotta px-6 py-3 font-display text-[15px] font-bold text-cream shadow-sm transition-colors duration-200 hover:bg-terracotta-deep disabled:cursor-not-allowed disabled:bg-line disabled:text-ink-faint"
        >
          Rent this setup
        </button>
      </div>
    </div>
  );
}
