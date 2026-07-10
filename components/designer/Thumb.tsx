import { SCENE_ITEMS } from "@/components/scene/items";

/* Renders a product's scene artwork as a self-contained thumbnail.
   Items are anchored at bottom-center (0,0) except the rug, which is
   drawn centered on its midline. */
export default function Thumb({ id, className }: { id: string; className?: string }) {
  const item = SCENE_ITEMS[id];
  if (!item) return null;
  const pad = 10;
  const w = item.width + pad * 2;
  const viewBox =
    id === "rug"
      ? `${-w / 2} ${-item.height / 2 - pad} ${w} ${item.height + pad * 2}`
      : `${-w / 2} ${-item.height - pad} ${w} ${item.height + pad * 2}`;
  return (
    <svg viewBox={viewBox} aria-hidden="true" className={className}>
      <item.render />
    </svg>
  );
}
