import { PRODUCT_BY_ID, type Product } from "./catalog";

export type Duration = "week" | "month" | "quarter";

export interface SetupState {
  deskId: string | null;
  chairId: string | null;
  accessoryIds: string[];
  duration: Duration;
}

export const EMPTY_SETUP: SetupState = {
  deskId: null,
  chairId: null,
  accessoryIds: [],
  duration: "month",
};

export type SetupAction =
  | { type: "toggle"; product: Product }
  | { type: "remove"; productId: string }
  | { type: "applyBundle"; itemIds: string[] }
  | { type: "setDuration"; duration: Duration }
  | { type: "replace"; state: SetupState }
  | { type: "clear" };

export function setupReducer(state: SetupState, action: SetupAction): SetupState {
  switch (action.type) {
    case "toggle": {
      const { product } = action;
      if (product.category === "desks") {
        return {
          ...state,
          deskId: state.deskId === product.id ? null : product.id,
        };
      }
      if (product.category === "chairs") {
        return {
          ...state,
          chairId: state.chairId === product.id ? null : product.id,
        };
      }
      const has = state.accessoryIds.includes(product.id);
      return {
        ...state,
        accessoryIds: has
          ? state.accessoryIds.filter((id) => id !== product.id)
          : [...state.accessoryIds, product.id],
      };
    }
    case "remove": {
      if (state.deskId === action.productId) return { ...state, deskId: null };
      if (state.chairId === action.productId) return { ...state, chairId: null };
      return {
        ...state,
        accessoryIds: state.accessoryIds.filter((id) => id !== action.productId),
      };
    }
    case "applyBundle": {
      const next: SetupState = { ...state, deskId: null, chairId: null, accessoryIds: [] };
      for (const id of action.itemIds) {
        const p = PRODUCT_BY_ID[id];
        if (!p) continue;
        if (p.category === "desks") next.deskId = id;
        else if (p.category === "chairs") next.chairId = id;
        else if (!next.accessoryIds.includes(id)) next.accessoryIds.push(id);
      }
      return next;
    }
    case "setDuration":
      return { ...state, duration: action.duration };
    case "replace":
      return action.state;
    case "clear":
      return { ...EMPTY_SETUP, duration: state.duration };
  }
}

export function selectedIds(state: SetupState): string[] {
  return [
    ...(state.deskId ? [state.deskId] : []),
    ...(state.chairId ? [state.chairId] : []),
    ...state.accessoryIds,
  ];
}

export function selectedProducts(state: SetupState): Product[] {
  return selectedIds(state)
    .map((id) => PRODUCT_BY_ID[id])
    .filter(Boolean);
}

export function isSelected(state: SetupState, productId: string): boolean {
  return selectedIds(state).includes(productId);
}

/* ── Pricing ─────────────────────────────────────────────── */

export const DURATIONS: {
  key: Duration;
  label: string;
  weeks: number;
  discount: number;
  note: string;
}[] = [
  { key: "week", label: "1 week", weeks: 1, discount: 0, note: "Try it out" },
  { key: "month", label: "1 month", weeks: 4, discount: 0.1, note: "Save 10%" },
  { key: "quarter", label: "3 months", weeks: 12, discount: 0.2, note: "Save 20%" },
];

export function weeklyTotal(state: SetupState): number {
  return selectedProducts(state).reduce((sum, p) => sum + p.pricePerWeek, 0);
}

export interface Quote {
  weekly: number;
  weeks: number;
  discount: number;
  gross: number;
  savings: number;
  total: number;
}

export function quote(state: SetupState): Quote {
  const d = DURATIONS.find((x) => x.key === state.duration) ?? DURATIONS[1];
  const weekly = weeklyTotal(state);
  const gross = weekly * d.weeks;
  const savings = Math.round(gross * d.discount * 100) / 100;
  return {
    weekly,
    weeks: d.weeks,
    discount: d.discount,
    gross,
    savings,
    total: Math.round((gross - savings) * 100) / 100,
  };
}

export function formatUSD(n: number): string {
  return n % 1 === 0 ? `$${n}` : `$${n.toFixed(2)}`;
}

/* ── URL sharing ─────────────────────────────────────────── */

export function encodeSetup(state: SetupState): string {
  const ids = selectedIds(state);
  if (ids.length === 0) return "";
  return `${ids.join(".")}~${state.duration}`;
}

export function decodeSetup(encoded: string | null): SetupState | null {
  if (!encoded) return null;
  const [idPart, durationPart] = encoded.split("~");
  const ids = (idPart ?? "").split(".").filter((id) => PRODUCT_BY_ID[id]);
  if (ids.length === 0) return null;
  const duration: Duration =
    durationPart === "week" || durationPart === "month" || durationPart === "quarter"
      ? durationPart
      : "month";
  return setupReducer(
    { ...EMPTY_SETUP, duration },
    { type: "applyBundle", itemIds: ids },
  );
}
