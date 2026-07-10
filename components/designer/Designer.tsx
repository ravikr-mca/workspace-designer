"use client";

import { useEffect, useReducer, useRef, useState } from "react";
import Scene from "@/components/scene/Scene";
import type { Product } from "@/lib/catalog";
import {
  decodeSetup,
  EMPTY_SETUP,
  encodeSetup,
  selectedIds,
  setupReducer,
  type Duration,
} from "@/lib/setup-state";
import BundlePicker from "./BundlePicker";
import CheckoutSheet from "./CheckoutSheet";
import ProductTray from "./ProductTray";
import RentBar from "./RentBar";

export default function Designer() {
  const [state, dispatch] = useReducer(setupReducer, EMPTY_SETUP);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const restoredRef = useRef(false);

  /* Restore a shared setup from the URL after mount (avoids SSR mismatch) */
  useEffect(() => {
    const shared = decodeSetup(new URLSearchParams(window.location.search).get("s"));
    if (shared) dispatch({ type: "replace", state: shared });
    restoredRef.current = true;
  }, []);

  /* Keep the URL shareable as the setup changes */
  useEffect(() => {
    if (!restoredRef.current) return;
    const encoded = encodeSetup(state);
    window.history.replaceState(null, "", encoded ? `?s=${encoded}` : "/");
  }, [state]);

  const empty = selectedIds(state).length === 0;

  function toggle(product: Product) {
    dispatch({ type: "toggle", product });
  }

  function openCheckout() {
    setConfirmed(false);
    setCheckoutOpen(true);
  }

  function startOver() {
    setCheckoutOpen(false);
    setConfirmed(false);
    dispatch({ type: "clear" });
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="mx-auto flex w-full max-w-6xl items-baseline justify-between px-4 pb-3 pt-5 sm:px-6">
        <div className="flex items-baseline gap-2.5">
          <span className="font-display text-lg font-extrabold tracking-tight">
            monis<span className="text-terracotta">.</span>rent
          </span>
          <span className="hidden text-sm text-ink-faint sm:block">workspace designer</span>
        </div>
        <p className="text-[13px] font-medium text-ink-faint">
          <span className="mr-1.5 inline-block h-2 w-2 rounded-full bg-sage" aria-hidden="true" />
          Same-day delivery in Bali
        </p>
      </header>

      <main className="mx-auto grid w-full max-w-6xl flex-1 grid-cols-1 gap-4 px-4 pb-4 sm:px-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
        <div className="lg:sticky lg:top-4">
          <h1 className="pb-3 font-display text-2xl font-extrabold tracking-tight sm:text-3xl">
            Design your dream workspace
          </h1>
          <div className="relative overflow-hidden rounded-3xl border border-line bg-cream shadow-sm">
            <div className="h-[38dvh] min-h-60 sm:h-auto sm:aspect-[3/2]">
              <Scene state={state} />
            </div>
            {empty && (
              <div className="pointer-events-none absolute inset-x-0 top-4 flex justify-center px-4">
                <p className="rounded-full bg-ink/85 px-4 py-2 text-center text-[13px] font-medium text-cream">
                  Your room is waiting. Start with a desk, or grab a starter setup.
                </p>
              </div>
            )}
          </div>
          <div className="pt-3">
            <BundlePicker onApply={(itemIds) => dispatch({ type: "applyBundle", itemIds })} />
          </div>
        </div>

        <ProductTray state={state} onToggle={toggle} />
      </main>

      <RentBar state={state} onRent={openCheckout} onClear={() => dispatch({ type: "clear" })} />

      <CheckoutSheet
        open={checkoutOpen}
        state={state}
        onClose={() => setCheckoutOpen(false)}
        onRemove={(id) => dispatch({ type: "remove", productId: id })}
        onSetDuration={(d: Duration) => dispatch({ type: "setDuration", duration: d })}
        onConfirm={() => setConfirmed(true)}
        confirmed={confirmed}
        onStartOver={startOver}
      />
    </div>
  );
}
